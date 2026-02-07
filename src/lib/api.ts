import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;
if (!API_BASE_URL) {
   console.warn('VITE_API_URL is not defined. API calls will fail.');
}

const api = axios.create({
   baseURL: API_BASE_URL,
   withCredentials: true,
   headers: {
      'Content-Type': 'application/json',
   },
});

let csrfToken: string | null = null;

let _sessionExpired = false;

export const resetSessionExpiredFlag = () => {
   _sessionExpired = false;
};

export const getCsrfToken = async () => {
   try {
      const response = await api.get('/api/v1/auth/csrf-token');
      csrfToken = response.data.token;
      return csrfToken;
   } catch (error) {
      console.error('Failed to fetch CSRF token', error);
      throw error;
   }
};

api.interceptors.request.use(async (config) => {
   const needsCsrf = ['post', 'put', 'patch', 'delete'].includes(
      config.method?.toLowerCase() || '',
   );

   if (needsCsrf) {
      if (!csrfToken) {
         await getCsrfToken();
      }
      config.headers['x-csrf-token'] = csrfToken || '';
   }

   return config;
});

api.interceptors.response.use(
   (response) => response,
   async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !_sessionExpired) {
         _sessionExpired = true;
         window.dispatchEvent(new Event('session-expired'));
      }

      if (error.response?.status === 403 && !originalRequest._retry) {
         originalRequest._retry = true;
         await getCsrfToken();
         originalRequest.headers['x-csrf-token'] = csrfToken || '';
         return api(originalRequest);
      }

      return Promise.reject(error);
   },
);

export const signupInit = async (data: any): Promise<any> => {
   const response = await api.post('/api/v1/auth/signup/_init', data);
   return response.data;
};

export const signupVerify = async (otp: string): Promise<any> => {
   const response = await api.post('/api/v1/auth/signup/verify-otp', { otp });
   return response.data;
};

export const resendOtp = async (): Promise<any> => {
   const response = await api.post('/api/v1/auth/signup/resend-otp', {});
   return response.data;
};

export const signin = async (data: { identifier: string; password: string }): Promise<any> => {
   const response = await api.post('/api/v1/auth/signin', data);
   return response.data;
};

export const signin2FA = async (sessionId: string, token: string): Promise<any> => {
   const response = await api.post('/api/v1/auth/signin/2fa', { sessionId, token });
   return response.data;
};

export const forgotPassword = async (email: string): Promise<any> => {
   const response = await api.post('/api/v1/auth/forgot-password', { email });
   return response.data;
};

export const verifyOtpGeneric = async (otpSessionId: string, otp: string): Promise<any> => {
   const response = await api.post('/api/v1/auth/verify-otp', { otpSessionId, otp });
   return response.data;
};

export const resetPassword = async (token: string, password: string): Promise<any> => {
   const response = await api.post('/api/v1/auth/reset-password', { token, password });
   return response.data;
};

const graphqlRequest = async (query: string, variables = {}) => {
   const response = await api.post('/api/_he/graphql', { query, variables });

   if (response.data.errors) {
      const errorMsg = response.data.errors[0]?.message || 'GraphQL Error';
      if (
         !_sessionExpired &&
         (errorMsg === 'Unauthorized' ||
            errorMsg.includes('Not authenticated') ||
            response.data.errors[0]?.extensions?.code === 'UNAUTHENTICATED' ||
            errorMsg.includes('Invalid session'))
      ) {
         _sessionExpired = true;
         window.dispatchEvent(new Event('session-expired'));
      }
      throw { response: { data: { message: errorMsg } } };
   }

   return response.data.data;
};

export const getMe = async (): Promise<any> => {
   const query = `
    query { 
      me { 
         publicId
         username
         email 
         deliveryEmail
         firstName
         lastName
         avatarId
         isTwoFactorEnabled
      } 
    }
  `;
   const data = await graphqlRequest(query);
   return { success: true, data: data.me };
};

export const signout = async (): Promise<any> => {
   const query = `mutation { signout }`;
   const data = await graphqlRequest(query);
   return { success: data.signout };
};

export const getSessions = async (): Promise<any> => {
   const query = `
    query { 
      mySessions { 
        sessionId publicId browser os deviceType ip location 
        latitude longitude
        createdAt lastAccessedAt isCurrent isOnline
      } 
    }
  `;
   const data = await graphqlRequest(query);
   return { success: true, data: data.mySessions };
};

export const signoutAll = async (): Promise<any> => {
   const query = `mutation { signoutAll }`;
   const data = await graphqlRequest(query);
   return { success: data.signoutAll };
};

export const signoutSession = async (sessionId: string): Promise<any> => {
   const query = `mutation($sessionId: String!) { signoutSession(sessionId: $sessionId) }`;
   const data = await graphqlRequest(query, { sessionId });
   return { success: data.signoutSession };
};

export const setup2FA = async (): Promise<any> => {
   const query = `mutation { setup2FA { secret qrCode } }`;
   const data = await graphqlRequest(query);
   return { success: true, data: data.setup2FA };
};

export const confirm2FA = async (token: string): Promise<any> => {
   const query = `mutation($token: String!) { confirm2FA(token: $token) }`;
   const data = await graphqlRequest(query, { token });
   return { success: data.confirm2FA };
};

export const disable2FA = async (token: string): Promise<any> => {
   const query = `mutation($token: String!) { disable2FA(token: $token) }`;
   const data = await graphqlRequest(query, { token });
   return { success: data.disable2FA };
};

export const requestPasswordChange = async (): Promise<any> => {
   const query = `mutation { requestPasswordChange }`;
   const data = await graphqlRequest(query);
   return { success: data.requestPasswordChange };
};

export const changePassword = async (newPassword: string, code: string): Promise<any> => {
   const query = `mutation($newPassword: String!, $code: String!) { changePassword(newPassword: $newPassword, code: $code) }`;
   const data = await graphqlRequest(query, { newPassword, code });
   return { success: data.changePassword };
};

export const updateName = async (firstName: string, lastName: string): Promise<any> => {
   const query = `mutation($firstName: String!, $lastName: String!) { updateName(firstName: $firstName, lastName: $lastName) }`;
   const data = await graphqlRequest(query, { firstName, lastName });
   return { success: data.updateName };
};

export const requestDeliveryEmailChange = async (newEmail: string): Promise<any> => {
   const query = `mutation($newEmail: String!) { requestDeliveryEmailChange(newEmail: $newEmail) }`;
   const data = await graphqlRequest(query, { newEmail });
   return { success: data.requestDeliveryEmailChange };
};

export const confirmDeliveryEmailChange = async (otp: string): Promise<any> => {
   const query = `mutation($otp: String!) { confirmDeliveryEmailChange(otp: $otp) }`;
   const data = await graphqlRequest(query, { otp });
   return { success: data.confirmDeliveryEmailChange };
};

export const getAuditLogs = async (limit: number = 10, offset: number = 0): Promise<any> => {
   const query = `
    query($limit: Int, $offset: Int) { 
      myAuditLogs(limit: $limit, offset: $offset) { 
         id
         action
         operationType
         ipHash
         metadata
         timestamp
      } 
    }
  `;
   const data = await graphqlRequest(query, { limit, offset });
   return { success: true, data: data.myAuditLogs };
};

export const uploadAvatar = async (file: Blob): Promise<any> => {
   const formData = new FormData();
   formData.append('file', file, 'avatar.jpg');
   const response = await api.post('/api/v1/user/profile/avatar', formData, {
      headers: {
         'Content-Type': 'multipart/form-data',
      },
   });
   return response.data;
};

export default api;
