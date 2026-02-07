import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Signup from './pages/auth/Signup/Signup';
import Signin from './pages/auth/Signin/Signin';
import ForgotPassword from './pages/auth/ResetPassword/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword/ResetPassword';
import Dashboard from './pages/Dashboards/Dashboard';
import Settings from './pages/Dashboards/Settings/settings';
import { Loader2 } from 'lucide-react';

function AppRoutes() {
   const { user, loading } = useAuth();
   const navigate = useNavigate();
   const queryClient = useQueryClient();

   useEffect(() => {
      let handled = false;
      const handleExpired = () => {
         if (handled) return;
         handled = true;

         queryClient.setQueryData(['me'], null);
         navigate('/signin', { replace: true });
         toast.error('Session expired. Please sign in again.');
      };

      window.addEventListener('session-expired', handleExpired);
      return () => window.removeEventListener('session-expired', handleExpired);
   }, [navigate, queryClient]);

   if (loading) {
      return (
         <div className="min-h-screen bg-background flex items-center justify-center text-primary">
            <Loader2 className="animate-spin size-10" />
         </div>
      );
   }

   return (
      <Routes>
         <Route path="/" element={user ? <Dashboard /> : <Home />} />

         <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
         <Route path="/signin" element={user ? <Navigate to="/" /> : <Signin />} />
         <Route path="/forgot-password" element={user ? <Navigate to="/" /> : <ForgotPassword />} />
         <Route path="/reset-password" element={user ? <Navigate to="/" /> : <ResetPassword />} />

         <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/signin" />} />

         <Route path="/settings" element={user ? <Settings /> : <Navigate to="/signin" />} />
         <Route path="/settings/:tab" element={user ? <Settings /> : <Navigate to="/signin" />} />
      </Routes>
   );
}

const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         refetchOnWindowFocus: false,
         retry: false,
         staleTime: 5 * 60 * 1000,
      },
   },
});

function App() {
   return (
      <QueryClientProvider client={queryClient}>
         <AuthProvider>
            <Toaster position="top-right" richColors theme="dark" />
            <AppRoutes />
         </AuthProvider>
      </QueryClientProvider>
   );
}

export default App;
