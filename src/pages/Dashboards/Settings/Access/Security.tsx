import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Button, Field, InputGroup, InputGroupInput, OTPInput } from '@/components/index';
import {
   getMe,
   setup2FA,
   confirm2FA,
   disable2FA,
   requestPasswordChange,
   changePassword,
} from '@/lib/api';
import {
   ShieldCheck,
   ShieldAlert,
   KeyRound,
   Copy,
   CheckCircle2,
   Loader2,
   Check,
} from 'lucide-react';

const PASSWORD_REGEX =
   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,64}$/;

export function Security() {
   const { user, login } = useAuth();
   const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);
   const [setupData, setSetupData] = useState<{ secret: string; qrCode: string } | null>(null);
   const [verificationCode, setVerificationCode] = useState('');
   const [isChangingPassword, setIsChangingPassword] = useState(false);
   const [isStep2, setIsStep2] = useState(false);
   const [isOtpSent, setIsOtpSent] = useState(false);
   const [passwordData, setPasswordData] = useState({
      newPassword: '',
      confirmPassword: '',
      code: '',
   });
   const [passwordError, setPasswordError] = useState('');
   const [isLoading, setIsLoading] = useState(false);

   const [showDisableConfirm, setShowDisableConfirm] = useState(false);
   const [disableToken, setDisableToken] = useState('');

   const refreshUser = async () => {
      try {
         const response = await getMe();
         if (response.success) login(response.data);
      } catch (err) {
         console.error('Refresh user error:', err);
      }
   };

   const handleStartSetup = async () => {
      setIsLoading(true);
      try {
         const response = await setup2FA();
         if (response.success) {
            setSetupData(response.data);
            setIsSettingUp2FA(true);
         }
      } catch (err: any) {
         toast.error(err.response?.data?.message || 'Failed to initialize 2FA setup');
      } finally {
         setIsLoading(false);
      }
   };

   const handleConfirm2FA = async () => {
      if (verificationCode.length < 6) return;
      setIsLoading(true);
      try {
         const response = await confirm2FA(verificationCode);
         if (response.success) {
            toast.success('Two-factor authentication enabled successfully');
            setIsSettingUp2FA(false);
            setSetupData(null);
            setVerificationCode('');
            refreshUser();
         }
      } catch (err: any) {
         toast.error(err.response?.data?.message || 'Invalid verification code');
      } finally {
         setIsLoading(false);
      }
   };

   const handleDisable2FA = async () => {
      if (disableToken.length !== 6) {
         return toast.error('Please enter your 6-digit authenticator code');
      }
      setIsLoading(true);
      try {
         const response = await disable2FA(disableToken);
         if (response.success) {
            toast.success('2FA has been disabled');
            setShowDisableConfirm(false);
            setDisableToken('');
            refreshUser();
         }
      } catch (err: any) {
         toast.error('Failed to disable 2FA');
      } finally {
         setIsLoading(false);
      }
   };

   const handleRequestPassChange = async () => {
      setIsLoading(true);
      try {
         const response = await requestPasswordChange();
         if (response.success) {
            setIsOtpSent(true);
            toast.success('Verification code sent to your email');
         }
      } catch (err: any) {
         toast.error('Failed to request password change');
      } finally {
         setIsLoading(false);
      }
   };

   const handleNextStep = async () => {
      if (!PASSWORD_REGEX.test(passwordData.newPassword)) {
         setPasswordError('Requirements not met');
         return toast.error(
            'Password must be 8+ chars, including uppercase, lowercase, number & special character.',
         );
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
         setPasswordError('');
         return toast.error('Passwords do not match');
      }

      setPasswordError('');
      setIsStep2(true);

      if (!user?.isTwoFactorEnabled && !isOtpSent) {
         handleRequestPassChange();
      }
   };

   const handleChangePassword = async (e: React.FormEvent) => {
      e.preventDefault();
      if (passwordData.code.length < 6) {
         return toast.error('Please enter the 6-digit verification code');
      }

      setIsLoading(true);
      try {
         const response = await changePassword(passwordData.newPassword, passwordData.code);
         if (response.success) {
            toast.success('Password updated successfully');
            setIsChangingPassword(false);
            setIsStep2(false);
            setIsOtpSent(false);
            setPasswordData({ newPassword: '', confirmPassword: '', code: '' });
         }
      } catch (err: any) {
         toast.error(err.response?.data?.message || 'Failed to update password');
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="space-y-6 animate-in fade-in duration-200">
         <div className="border-b border-border pb-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
               Password and authentication
            </h2>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed">
               Manage your security settings and authentication methods.
            </p>
         </div>

         <div className="border border-border rounded-xl bg-surface overflow-hidden divide-y divide-border">
            <div className="p-6">
               <div className="flex items-start justify-between gap-6">
                  <div className="flex gap-4">
                     <div
                        className={`p-3 rounded-xl ${user?.isTwoFactorEnabled ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'} border border-current/10 shrink-0`}
                     >
                        {user?.isTwoFactorEnabled ? (
                           <ShieldCheck className="size-6" />
                        ) : (
                           <ShieldAlert className="size-6" />
                        )}
                     </div>
                     <div>
                        <h3 className="font-semibold text-foreground">
                           Two-Factor Authentication (2FA)
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                           {user?.isTwoFactorEnabled
                              ? 'Your account is secure. Two-factor authentication is active for logins and sensitive actions.'
                              : 'Protect your account with an extra layer of security by requiring a code at login.'}
                        </p>
                     </div>
                  </div>

                  {!user?.isTwoFactorEnabled && !isSettingUp2FA && (
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={handleStartSetup}
                        disabled={isLoading}
                     >
                        {isLoading ? <Loader2 className="animate-spin size-4" /> : 'Enable 2FA'}
                     </Button>
                  )}

                  {user?.isTwoFactorEnabled && !showDisableConfirm && (
                     <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => setShowDisableConfirm(true)}
                        disabled={isLoading}
                     >
                        Disable
                     </Button>
                  )}

                  {showDisableConfirm && (
                     <div className="flex items-center gap-4 animate-in fade-in duration-200 bg-background p-3 rounded-lg border border-border">
                        <div className="space-y-1">
                           <p className="text-xs text-muted-foreground">Enter authenticator code</p>
                           <OTPInput
                              value={disableToken}
                              onChange={setDisableToken}
                              disabled={isLoading}
                           />
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                           <Button
                              size="xs"
                              variant="ghost"
                              onClick={() => {
                                 setShowDisableConfirm(false);
                                 setDisableToken('');
                              }}
                              className="text-muted-foreground"
                           >
                              Cancel
                           </Button>
                           <Button
                              size="sm"
                              variant="destructive"
                              onClick={handleDisable2FA}
                              disabled={isLoading || disableToken.length !== 6}
                              className="px-6"
                           >
                              {isLoading ? (
                                 <Loader2 className="animate-spin size-3 mr-2" />
                              ) : (
                                 <ShieldAlert className="size-4 mr-2" />
                              )}
                              Confirm Disable
                           </Button>
                        </div>
                     </div>
                  )}
               </div>
            </div>

            {isSettingUp2FA && setupData && (
               <div className="p-6 bg-surface/20 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-5">
                        <div className="flex items-center gap-2 text-sm font-medium text-surface-variant-foreground">
                           <span className="flex size-6 items-center justify-center rounded-full bg-surface-container-high text-xs border border-border">
                              1
                           </span>
                           Scan QR Code
                        </div>
                        <div className="bg-white p-3 rounded-2xl w-fit shadow-xl ring-1 ring-black/10 mx-auto md:mx-0">
                           <img src={setupData.qrCode} alt="2FA QR Code" className="size-36" />
                        </div>
                        <div className="p-3 bg-background border border-border rounded-lg space-y-2">
                           <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                              Or enter secret manually
                           </p>
                           <div className="flex items-center justify-between gap-3 text-xs font-mono text-muted-foreground">
                              <span className="truncate">{setupData.secret}</span>
                              <button
                                 onClick={() => {
                                    navigator.clipboard.writeText(setupData.secret);
                                    toast.success('Secret copied');
                                 }}
                                 className="p-1.5 hover:bg-surface-container-high rounded-md transition-colors shrink-0"
                              >
                                 <Copy className="size-3.5 text-muted-foreground hover:text-foreground" />
                              </button>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="flex items-center gap-2 text-sm font-medium text-surface-variant-foreground">
                           <span className="flex size-6 items-center justify-center rounded-full bg-surface-container-high text-xs border border-border">
                              2
                           </span>
                           Verify setup
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                           Enter the 6-digit code provided by your authenticator app (like Google
                           Authenticator or 1Password).
                        </p>

                        <div className="flex flex-col gap-6">
                           <OTPInput
                              value={verificationCode}
                              onChange={setVerificationCode}
                              disabled={isLoading}
                           />

                           <div className="flex gap-2">
                              <Button
                                 onClick={handleConfirm2FA}
                                 disabled={isLoading || verificationCode.length !== 6}
                                 className="w-full"
                              >
                                 {isLoading ? (
                                    <Loader2 className="animate-spin size-4" />
                                 ) : (
                                    'Verify & Enable'
                                 )}
                              </Button>
                              <Button
                                 variant="ghost"
                                 className="text-muted-foreground hover:text-foreground"
                                 onClick={() => setIsSettingUp2FA(false)}
                              >
                                 Cancel
                              </Button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </div>

         {/* Password Section */}
         <div className="border border-border rounded-xl bg-surface overflow-hidden divide-y divide-border">
            <div className="p-6">
               <div className="flex items-start justify-between gap-6">
                  <div className="flex gap-4">
                     <div className="p-3 rounded-xl bg-secondary/10 text-secondary border border-secondary/10 shrink-0">
                        <KeyRound className="size-6" />
                     </div>
                     <div>
                        <h3 className="font-semibold text-foreground">Account Password</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                           Maintain account security by updating your password regularly.
                        </p>
                     </div>
                  </div>
                  {!isChangingPassword && (
                     <Button
                        variant="outline"
                        size="sm"
                        className="border-border hover:bg-surface shadow-sm"
                        onClick={() => setIsChangingPassword(true)}
                     >
                        Change password
                     </Button>
                  )}
               </div>
            </div>

            {isChangingPassword && (
               <form
                  onSubmit={handleChangePassword}
                  className="p-6 space-y-6 animate-in fade-in duration-200"
               >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pointer-events-auto">
                     <Field>
                        <div className="flex items-center justify-between mb-1.5 px-1">
                           <span className="text-sm font-medium text-muted-foreground">New password</span>
                           {isStep2 && <CheckCircle2 className="size-4 text-primary" />}
                        </div>
                        <InputGroup
                           className={`border-border shadow-sm ${isStep2 ? 'opacity-50' : ''}`}
                        >
                           <InputGroupInput
                              type="password"
                              placeholder="At least 8 characters"
                              value={passwordData.newPassword}
                              onChange={(e) => {
                                 setPasswordData((p) => ({ ...p, newPassword: e.target.value }));
                                 setPasswordError('');
                              }}
                              required
                              disabled={isStep2 || isLoading}
                           />
                        </InputGroup>
                        <div className="px-1 mt-1">
                           {passwordError ? (
                              <p className="text-[11px] text-destructive font-medium">
                                 {passwordError}
                              </p>
                           ) : (
                              <p className="text-xs text-muted-foreground">
                                 At least 8 characters, including uppercase, lowercase, a number, and a symbol.
                              </p>
                           )}
                        </div>
                     </Field>
                     <Field>
                        <div className="flex items-center justify-between mb-1.5 px-1">
                           <span className="text-sm font-medium text-muted-foreground">
                              Confirm password
                           </span>
                           {isStep2 && <CheckCircle2 className="size-4 text-primary" />}
                        </div>
                        <InputGroup
                           className={`border-border shadow-sm ${isStep2 ? 'opacity-50' : ''}`}
                        >
                           <InputGroupInput
                              type="password"
                              placeholder="Verify your password"
                              value={passwordData.confirmPassword}
                              onChange={(e) =>
                                 setPasswordData((p) => ({ ...p, confirmPassword: e.target.value }))
                              }
                              required
                              disabled={isStep2 || isLoading}
                           />
                        </InputGroup>
                     </Field>
                  </div>

                  {isStep2 && (
                     <div className="p-5 bg-background/40 rounded-xl border border-border space-y-4 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between">
                           <div>
                              <p className="text-sm font-semibold text-foreground italic">
                                 Security Verification
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                 {user?.isTwoFactorEnabled
                                    ? '2FA is active. Enter the current token from your authenticator app.'
                                    : "Verification is required. We've sent a code to your registered email."}
                              </p>
                           </div>

                           {!user?.isTwoFactorEnabled && isOtpSent && (
                              <Button
                                 type="button"
                                 size="xs"
                                 variant="ghost"
                                 onClick={handleRequestPassChange}
                                 disabled={isLoading}
                                 className="text-secondary hover:text-secondary text-[10px] font-bold uppercase tracking-wider"
                              >
                                 {isLoading ? (
                                    <Loader2 className="animate-spin size-3 mr-2" />
                                 ) : (
                                    'Resend Code'
                                 )}
                              </Button>
                           )}
                        </div>

                        <div className="flex flex-col items-center gap-4 py-2">
                           {isOtpSent && !user?.isTwoFactorEnabled && (
                              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary">
                                 <Check className="size-3" /> Code sent to email
                              </div>
                           )}
                           <OTPInput
                              value={passwordData.code}
                              onChange={(val) => setPasswordData((p) => ({ ...p, code: val }))}
                              disabled={isLoading}
                           />
                        </div>
                     </div>
                  )}

                  <div className="flex gap-3 justify-end pt-2">
                     <Button
                        variant="ghost"
                        type="button"
                        onClick={() => {
                           setIsChangingPassword(false);
                           setIsStep2(false);
                           setIsOtpSent(false);
                           setPasswordError('');
                           setPasswordData({ newPassword: '', confirmPassword: '', code: '' });
                        }}
                        className="text-muted-foreground hover:text-foreground"
                     >
                        Cancel
                     </Button>

                     {!isStep2 ? (
                        <Button
                           type="button"
                           onClick={handleNextStep}
                           className="bg-surface-container-high hover:bg-surface-container-highest text-foreground border border-border px-6"
                           disabled={isLoading}
                        >
                           Confirm & Verify
                        </Button>
                     ) : (
                        <Button
                           type="submit"
                           className="px-6"
                           disabled={isLoading || passwordData.code.length !== 6}
                        >
                           {isLoading ? (
                              <Loader2 className="animate-spin size-4 mr-1" />
                           ) : (
                              <Check className="size-4 mr-1" />
                           )}
                           Update password
                        </Button>
                     )}
                  </div>
               </form>
            )}
         </div>

         <div className="p-5 bg-primary/20 border border-primary/10 rounded-xl flex items-start gap-4 shadow-inner">
            <ShieldCheck className="size-5 text-primary shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground leading-relaxed">
               <strong className="text-primary font-bold block mb-1">Keep Your Account Secure</strong>
               Use a unique password for each account. If you suspect unauthorized access, 
               revoke active sessions in the{' '}
               <a href="/settings/sessions" className="text-primary underline hover:text-primary">
                  Sessions
               </a>{' '}
               tab and change your password immediately.
            </div>
         </div>
      </div>
   );
}
