import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import {
   AuthLayout,
   Field,
   FieldGroup,
   Button,
   InputGroup,
   InputGroupInput,
   InputGroupAddon,
   InputGroupButton,
   OTPInput,
} from '@/components/index';
import { signin, signin2FA } from '@/lib/api';
import { EyeIcon, EyeOffIcon, CircleUserRound, LockKeyhole, Loader2 } from 'lucide-react';

function Signin() {
   const navigate = useNavigate();
   const { login } = useAuth();
   const [showPassword, setShowPassword] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const [is2FARequired, setIs2FARequired] = useState(false);
   const [sessionId, setSessionId] = useState<string | null>(null);
   const [otp, setOtp] = useState('');

   const [formData, setFormData] = useState({
      identifier: '',
      password: '',
   });

   const handleChange = (field: keyof typeof formData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (error) setError(null);
   };

   const handleSignin = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);

      try {
         const response = await signin(formData);

         if (response.data.requires2FA) {
            setIs2FARequired(true);
            setSessionId(response.data.sessionId);
            toast.info('Two-factor authentication required');
            return;
         }

         // Update global auth state
         login(response.data);
         navigate('/');
      } catch (err: any) {
         console.error('Signin error:', err);
         const msg = err.response?.data?.message || 'Invalid credentials. Please try again.';
         toast.error(msg);
         setError(msg);
      } finally {
         setIsLoading(false);
      }
   };

   const handle2FAVerify = async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (otp.length < 6) return;
      setIsLoading(true);

      try {
         const response = await signin2FA(sessionId!, otp);
         login(response.data);
         toast.success('Signed in successfully');
         navigate('/');
      } catch (err: any) {
         toast.error(err.response?.data?.message || 'Invalid 2FA code');
      } finally {
         setIsLoading(false);
      }
   };

   if (is2FARequired) {
      return (
         <AuthLayout
            title="Two-Factor Authentication"
            description="Your account is protected. Enter the verification code from your authenticator app."
         >
            <div className="flex flex-col items-center gap-8 py-4 animate-in fade-in duration-300">
               <OTPInput value={otp} onChange={setOtp} disabled={isLoading} />

               <div className="flex flex-col w-full gap-3">
                  <Button
                     onClick={() => handle2FAVerify()}
                     disabled={isLoading || otp.length < 6}
                     className="w-full"
                  >
                     {isLoading ? <Loader2 className="animate-spin size-4" /> : 'Verify & Sign In'}
                  </Button>

                  <button
                     onClick={() => {
                        setIs2FARequired(false);
                        setOtp('');
                     }}
                     className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                     Back to sign in
                  </button>
               </div>
            </div>
         </AuthLayout>
      );
   }

   return (
      <AuthLayout title="Sign In" description="Enter your credentials to access your secure dashboard.">
         <div className="bg-background text-foreground">
            <form className="w-full max-w-sm" onSubmit={handleSignin}>
               <FieldGroup>
                  <Field>
                     <InputGroup className="border-border hover:text-muted-foreground">
                        <InputGroupAddon align="inline-start">
                           <CircleUserRound className="size-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                           id="form-identifier"
                           type="text"
                           placeholder="Username or email address"
                           value={formData.identifier}
                           onChange={(e) => handleChange('identifier', e.target.value)}
                           required
                           disabled={isLoading}
                        />
                     </InputGroup>
                  </Field>

                  <Field className="max-w-sm">
                     <InputGroup className="border-border hover:text-muted-foreground">
                        <InputGroupAddon align="inline-start">
                           <LockKeyhole className="size-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                           id="form-password"
                           type={showPassword ? 'text' : 'password'}
                           placeholder="Password"
                           value={formData.password}
                           onChange={(e) => handleChange('password', e.target.value)}
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
                     <div className="flex justify-end mt-1 px-1">
                        <Link
                           to="/forgot-password"
                           className="text-[11px] font-bold text-secondary uppercase tracking-wider hover:text-secondary-foreground transition-colors"
                        >
                           Forgot password?
                        </Link>
                     </div>
                  </Field>

                  <Field orientation="horizontal">
                     <Button
                        className="w-full"
                        type="submit"
                        disabled={isLoading}
                     >
                        {isLoading ? <Loader2 className="animate-spin size-4" /> : 'Sign In'}
                     </Button>
                  </Field>
               </FieldGroup>
            </form>
         </div>

         <div className="text-center text-muted-foreground text-sm mt-10">
            New User?{' '}
            <Link to="/signup" className="text-secondary text-decoration-line: underline ml-0.5">
               Create an account
            </Link>
         </div>
      </AuthLayout>
   );
}

export default Signin;
