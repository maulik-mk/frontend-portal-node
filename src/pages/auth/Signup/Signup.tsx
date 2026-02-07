import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
   AuthLayout,
   Field,
   FieldGroup,
   Select,
   SelectTrigger,
   SelectItem,
   SelectContent,
   SelectValue,
   Button,
   InputGroup,
   InputGroupInput,
   InputGroupAddon,
   InputGroupButton,
   DateInput,
   OTPInput,
} from '@/components/index';
import { countries } from '@/lib/countries';
import { signupInit, signupVerify, resendOtp as apiResendOtp } from '@/lib/api';
import {
   EyeIcon,
   EyeOffIcon,
   User,
   Mail,
   MapPinned,
   CircleUserRound,
   LockKeyhole,
   ArrowLeft,
   Loader2,
} from 'lucide-react';

type SignupStep = 'info' | 'otp';

function Signup() {
   const navigate = useNavigate();
   const [step, setStep] = useState<SignupStep>('info');
   const [showPassword, setShowPassword] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   // Form State
   const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      birthDate: null as Date | null,
      country: 'in',
      otp: '',
   });

   const handleChange = (field: keyof typeof formData, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (error) setError(null);
   };

   const handleInitSignup = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);

      try {
         const formattedDate = formData.birthDate
            ? formData.birthDate.toISOString().split('T')[0]
            : '';

         const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: formData.username,
            email: formData.email,
            password: formData.password,
            birthDate: formattedDate,
            country: formData.country,
         };

         await signupInit(payload);
         setStep('otp');
      } catch (err: any) {
         console.error('Signup Init Error:', err);
         const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
         toast.error(msg);
         setError(msg);
      } finally {
         setIsLoading(false);
      }
   };

   const handleVerifyOtp = async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (formData.otp.length < 6) return;

      setIsLoading(true);
      setError(null);

      try {
         await signupVerify(formData.otp);
         toast.success('Account created successfully! Please sign in.');
         navigate('/signin');
      } catch (err: any) {
         console.error('OTP Verify Error:', err);
         const msg = err.response?.data?.message || 'Invalid OTP. Please try again.';
         toast.error(msg);
         setError(msg);
      } finally {
         setIsLoading(false);
      }
   };

   const handleResendOtp = async () => {
      setIsLoading(true);
      try {
         await apiResendOtp();
      } catch (err: any) {
         setError(err.response?.data?.message || 'Failed to resend OTP.');
      } finally {
         setIsLoading(false);
      }
   };

   if (step === 'otp') {
      return (
         <AuthLayout title="Verify Your Email" description={`Enter the verification code sent to ${formData.email}`}>
            <div className="flex flex-col items-center gap-8 py-4">
               <OTPInput
                  value={formData.otp}
                  onChange={(val) => handleChange('otp', val)}
                  disabled={isLoading}
               />

               <div className="flex flex-col w-full gap-3">
                  <Button
                     onClick={() => handleVerifyOtp()}
                     disabled={isLoading || formData.otp.length < 6}
                     className="w-fit self-center mx-auto"
                  >
                     {isLoading ? <Loader2 className="animate-spin size-4" /> : 'Verify & Continue'}
                  </Button>

                  <div className="flex justify-between items-center w-full px-1">
                     <button
                        onClick={() => setStep('info')}
                        className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
                     >
                        <ArrowLeft className="size-3.5" /> Back to details
                     </button>

                     <button
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="text-sm text-secondary hover:text-secondary font-medium disabled:opacity-50"
                     >
                        Resend Code
                     </button>
                  </div>
               </div>
            </div>
         </AuthLayout>
      );
   }

   return (
      <AuthLayout title="Create Your Account" description="Join us today. Enter your details to get started.">
         <div className="bg-background text-foreground">
            <form className="w-full max-w-sm" onSubmit={handleInitSignup}>
               <FieldGroup>
                  <div className="grid max-w-sm grid-cols-2 gap-5">
                     <Field>
                        <InputGroup className="border-border hover:text-muted-foreground">
                           <InputGroupAddon align="inline-start">
                              <User className="size-4" />
                           </InputGroupAddon>
                           <InputGroupInput
                              id="first-name"
                              placeholder="First Name"
                              value={formData.firstName}
                              onChange={(e) => handleChange('firstName', e.target.value)}
                              required
                           />
                        </InputGroup>
                     </Field>
                     <Field>
                        <InputGroup className="border-border hover:text-muted-foreground">
                           <InputGroupAddon align="inline-start"></InputGroupAddon>
                           <InputGroupInput
                              id="last-name"
                              placeholder="Last Name"
                              value={formData.lastName}
                              onChange={(e) => handleChange('lastName', e.target.value)}
                              required
                           />
                        </InputGroup>
                     </Field>
                  </div>

                  <Field>
                     <InputGroup className="border-border hover:text-muted-foreground">
                        <InputGroupAddon align="inline-start">
                           <CircleUserRound className="size-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                           id="form-name"
                           type="text"
                           placeholder="Username"
                           value={formData.username}
                           onChange={(e) => handleChange('username', e.target.value)}
                           required
                        />
                     </InputGroup>
                  </Field>
                  <Field>
                     <InputGroup className="border-border hover:text-muted-foreground">
                        <InputGroupAddon align="inline-start">
                           <Mail className="size-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                           id="form-email"
                           type="email"
                           placeholder="name@domain.com"
                           value={formData.email}
                           onChange={(e) => handleChange('email', e.target.value)}
                           required
                        />
                     </InputGroup>
                  </Field>

                  <Field className="max-w-sm">
                     <InputGroup className="border-border hover:text-muted-foreground">
                        <InputGroupAddon align="inline-start">
                           <LockKeyhole className="size-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                           id="inline-end-input"
                           type={showPassword ? 'text' : 'password'}
                           placeholder="Password"
                           value={formData.password}
                           onChange={(e) => handleChange('password', e.target.value)}
                           required
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
                     <div className="flex flex-col gap-2.5">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest pl-1">
                           Date of birth
                        </span>
                        <div className="p-1 bg-surface-container rounded-xl border border-border shadow-inner">
                           <DateInput
                              value={formData.birthDate}
                              onChange={(d) => handleChange('birthDate', d)}
                           />
                        </div>
                     </div>
                  </Field>

                  <div className="grid">
                     <Field>
                        <Select
                           value={formData.country}
                           onValueChange={(val) => handleChange('country', val)}
                        >
                           <SelectTrigger className="border-border" id="form-country">
                              <MapPinned className="size-4 text-muted-foreground" />
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent
                              position="popper"
                              className="bg-surface-container text-foreground border border-border max-h-56 overflow-y-auto"
                           >
                              {countries.map((country) => (
                                 <SelectItem key={country.code} value={country.code}>
                                    {country.name}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </Field>
                  </div>

                  <Field orientation="horizontal">
                     <Button
                        type="submit"
                        disabled={isLoading}
                     >
                        {isLoading ? <Loader2 className="animate-spin size-4" /> : 'Create Account'}
                     </Button>
                     <Button type="button" variant="ghost" disabled={isLoading}>
                        Cancel
                     </Button>
                  </Field>
               </FieldGroup>
            </form>
         </div>

         <div className="text-center text-muted-foreground text-sm mt-10">
            Already have an account?{' '}
            <a href="/signin" className="text-secondary hover:underline ml-0.5">
               Sign in →
            </a>
         </div>
      </AuthLayout>
   );
}

export default Signup;
