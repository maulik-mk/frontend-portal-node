import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
   AuthLayout,
   Field,
   FieldGroup,
   Button,
   InputGroup,
   InputGroupInput,
   InputGroupAddon,
   OTPInput,
} from '@/components/index';
import { forgotPassword, verifyOtpGeneric } from '@/lib/api';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';

type RecoveryStep = 'email' | 'otp';

export default function ForgotPassword() {
   const navigate = useNavigate();
   const [step, setStep] = useState<RecoveryStep>('email');
   const [isLoading, setIsLoading] = useState(false);
   const [email, setEmail] = useState('');
   const [otp, setOtp] = useState('');
   const [otpSessionId, setOtpSessionId] = useState<string | null>(null);

   const handleRequestRecovery = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      try {
         const response = await forgotPassword(email);
         if (response.success) {
            setOtpSessionId(response.data.otpSessionId);
            setStep('otp');
            toast.success('Recovery code sent to your email');
         }
      } catch (err: any) {
         toast.error(err.response?.data?.message || 'Failed to request recovery');
      } finally {
         setIsLoading(false);
      }
   };

   const handleVerifyOtp = async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (otp.length < 6) return;
      setIsLoading(true);
      try {
         const response = await verifyOtpGeneric(otpSessionId!, otp);
         if (response.success) {
            toast.success('Email verified');
            // Redirect to reset password with the session ID as the token
            navigate(`/reset-password?token=${otpSessionId}`);
         }
      } catch (err: any) {
         toast.error(err.response?.data?.message || 'Invalid or expired code');
      } finally {
         setIsLoading(false);
      }
   };

   if (step === 'otp') {
      return (
         <AuthLayout
            title="Verify Recovery"
            description={`Enter the 6-digit code sent to ${email}`}
         >
            <div className="flex flex-col items-center gap-8 py-4 animate-in fade-in duration-300">
               <OTPInput value={otp} onChange={setOtp} disabled={isLoading} />

               <div className="flex flex-col w-full gap-3">
                  <Button
                     onClick={() => handleVerifyOtp()}
                     disabled={isLoading || otp.length < 6}
                     className="w-full"
                  >
                     {isLoading ? <Loader2 className="animate-spin size-4" /> : 'Verify Code'}
                  </Button>

                  <button
                     onClick={() => setStep('email')}
                     className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
                  >
                     <ArrowLeft className="size-3.5" /> Back to email
                  </button>
               </div>
            </div>
         </AuthLayout>
      );
   }

   return (
      <AuthLayout
         title="Forgot Password"
         description="Enter your email address to receive a password recovery code."
      >
         <div className="bg-background text-foreground">
            <form className="w-full max-w-sm" onSubmit={handleRequestRecovery}>
               <FieldGroup>
                  <Field>
                     <InputGroup className="border-border hover:text-muted-foreground">
                        <InputGroupAddon align="inline-start">
                           <Mail className="size-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                           id="recovery-email"
                           type="email"
                           placeholder="name@domain.com"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
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
                           'Send Recovery Code'
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
