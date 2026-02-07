import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMe, signout as apiSignout, resetSessionExpiredFlag } from '@/lib/api';

interface User {
   publicId: string;
   username: string;
   email: string;
   firstName?: string;
   lastName?: string;
   avatarId?: string | null;
   isTwoFactorEnabled: boolean;
}

interface AuthContextType {
   user: User | null;
   loading: boolean;
   login: (userData: User) => void;
   logout: () => Promise<void>;
   checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SSE_URL = `${import.meta.env.VITE_API_URL}/api/v1/auth/session-stream`;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   const queryClient = useQueryClient();
   const abortRef = useRef<AbortController | null>(null);
   const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

   const {
      data: user = null,
      isLoading: loading,
      refetch,
   } = useQuery({
      queryKey: ['me'],
      queryFn: async () => {
         if (!document.cookie.includes('logged_in=yes')) {
            return null;
         }

         try {
            const response = await getMe();
            return response.success ? response.data : null;
         } catch {
            return null;
         }
      },
      retry: false,
      staleTime: 5 * 60 * 1000,
   });

   const signoutMutation = useMutation({
      mutationFn: apiSignout,
      onSettled: () => {
         queryClient.clear();
      },
   });

   const checkSession = async () => {
      await refetch();
   };

   const login = (userData: User) => {
      resetSessionExpiredFlag();
      queryClient.setQueryData(['me'], userData);
   };

   const logout = async () => {
      await signoutMutation.mutateAsync();
   };

   useEffect(() => {
      if (!user) return;

      let alive = true;
      let retryDelay = 1000;

      const connect = async () => {
         if (!alive) return;

         abortRef.current?.abort();
         const controller = new AbortController();
         abortRef.current = controller;

         try {
            const response = await fetch(SSE_URL, {
               credentials: 'include',
               signal: controller.signal,
               headers: { Accept: 'text/event-stream' },
            });

            if (!response.ok) {
               if (response.status === 401) {
                  window.dispatchEvent(new Event('session-expired'));
               }
               throw new Error(`SSE connect failed: ${response.status}`);
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error('No readable stream');

            const decoder = new TextDecoder();
            retryDelay = 1000;

            let buffer = '';

            while (alive) {
               const { done, value } = await reader.read();
               if (done) break;

               buffer += decoder.decode(value, { stream: true });

               const messages = buffer.split('\n\n');
               buffer = messages.pop() || '';

               for (const msg of messages) {
                  const dataLine = msg.split('\n').find((l) => l.startsWith('data: '));
                  if (!dataLine) continue;

                  const jsonStr = dataLine.slice(6);
                  try {
                     const event = JSON.parse(jsonStr);

                     if (event.type === 'SESSION_REVOKED') {
                        queryClient.invalidateQueries({
                           queryKey: ['sessions'],
                           refetchType: 'all',
                        });
                     }

                     if (event.type === 'NEW_SESSION') {
                        queryClient.invalidateQueries({
                           queryKey: ['sessions'],
                           refetchType: 'all',
                        });
                     }

                     if (event.type === 'PRESENCE_UPDATE') {
                        queryClient.invalidateQueries({
                           queryKey: ['sessions'],
                           refetchType: 'all',
                        });
                     }
                  } catch {
                  }
               }
            }
         } catch (err: unknown) {
            if (err instanceof DOMException && err.name === 'AbortError') return;
         }

         if (alive) {
            reconnectTimer.current = setTimeout(() => {
               retryDelay = Math.min(retryDelay * 2, 30000);
               connect();
            }, retryDelay);
         }
      };

      connect();

      return () => {
         alive = false;
         abortRef.current?.abort();
         if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      };
   }, [user, queryClient]);

   return (
      <AuthContext.Provider value={{ user, loading, login, logout, checkSession }}>
         {children}
      </AuthContext.Provider>
   );
};

export const useAuth = () => {
   const context = useContext(AuthContext);
   if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
   }
   return context;
};
