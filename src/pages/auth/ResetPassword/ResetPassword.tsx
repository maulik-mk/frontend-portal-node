import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
   AuthLayout,
   Field,
   FieldGroup,
   Button,
   InputGroup,
   InputGroupInput,
   InputGroupAddon,
   InputGroupButton,
} from '@/components/index';
import { resetPassword } from '@/lib/api';
import { LockKeyhole, EyeIcon, EyeOffIcon, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ResetPassword() {
   const navigate = useNavigate();
   const [searchParams] = useSearchParams();
   const token = searchParams.get('token');

   const [showPassword, setShowPassword] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [isSuccess, setIsSuccess] = useState(false);

   const [formData, setFormData] = useState({
      password: '',
      confirmPassword: '',
   });

   useEffect(() => {
      if (!token) {
         toast.error('Invalid or missing reset token');
         navigate('/signin');
      }
   }, [token, navigate]);

   const handleResetPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.password !== formData.confirmPassword) {
         return toast.error('Passwords do not match');
      }

      setIsLoading(true);
      try {
         const response = await resetPassword(token!, formData.password);
         if (response.success) {
            setIsSuccess(true);
            toast.success('Password reset successfully');
         }
      } catch (err: any) {
         toast.error(err.response?.data?.message || 'Failed to reset password');
      } finally {
         setIsLoading(false);
      }
   };

   if (isSuccess) {
      return (
         <AuthLayout title="Password Reset Complete" description="Your password has been successfully updated.">
            <div className="flex flex-col items-center gap-6 py-8 animate-in zoom-in-95 duration-300">
               <div className="p-4 rounded-full bg-primary/10 text-primary border border-primary/20">
                  <CheckCircle2 className="size-12" />
               </div>
               <p className="text-sm text-muted-foreground text-center">
                  Sign in with your new credentials to access your dashboard.
               </p>
               <Link to="/signin" className="w-full">
                  <Button className="w-full">
                     Sign In
                  </Button>
               </Link>
            </div>
         </AuthLayout>
      );
   }

   return (
      <AuthLayout
         title="Reset Password"
         description="Create a strong, unique password for your account."
      >
         <div className="bg-background text-foreground">
            <form className="w-full max-w-sm" onSubmit={handleResetPassword}>
               <FieldGroup>
                  <Field>
                     <InputGroup className="border-border hover:text-muted-foreground">
                        <InputGroupAddon align="inline-start">
                           <LockKeyhole className="size-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                           id="new-password"
                           type={showPassword ? 'text' : 'password'}
                           placeholder="New Password"
                           value={formData.password}
                           onChange={(e) =>
                              setFormData((p) => ({ ...p, password: e.target.value }))
                           }
                           required
                           disabled={isLoading}
                        />
                        <InputGroupAddon align="inline-end">
                           <InputGroupButton
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                           >
                              {showPassword ? (
                                 <EyeIcon className="size-4" />
                              ) : (
                                 <EyeOffIcon className="size-4" />
                              )}
                           </InputGroupButton>
                        </InputGroupAddon>
                     </InputGroup>
                  </Field>

                  <Field>
                     <InputGroup className="border-border hover:text-muted-foreground">
                        <InputGroupAddon align="inline-start">
                           <LockKeyhole className="size-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                           id="confirm-password"
                           type="password"
                           placeholder="Confirm New Password"
                           value={formData.confirmPassword}
                           onChange={(e) =>
                              setFormData((p) => ({ ...p, confirmPassword: e.target.value }))
                           }
                           required
                           disabled={isLoading}
                        />
                     </InputGroup>
                  </Field>

                  <Field orientation="horizontal">
                     <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full"
                     >
                        {isLoading ? (
                           <Loader2 className="animate-spin size-4" />
                        ) : (
                           'Update Password'
                        )}
                     </Button>
                  </Field>
               </FieldGroup>
            </form>
         </div>

         <div className="text-center text-muted-foreground text-sm mt-10">
            <Link
               to="/signin"
               className="text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 transition-colors"
            >
               <ArrowLeft className="size-3.5" /> Back to sign in
            </Link>
         </div>
      </AuthLayout>
   );
}
