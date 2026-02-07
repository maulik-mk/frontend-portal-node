import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMe, requestDeliveryEmailChange, confirmDeliveryEmailChange } from '@/lib/api';
import { toast } from 'sonner';
import { Button, Input, OTPInput } from '@/components/index';
import { Mail, ShieldCheck, Loader2 } from 'lucide-react';

export function Emails() {
   const queryClient = useQueryClient();

   const [isEditingEmail, setIsEditingEmail] = useState(false);
   const [newEmail, setNewEmail] = useState('');
   const [otpSent, setOtpSent] = useState(false);
   const [otp, setOtp] = useState('');

   // Fetch User Profile
   const { data: user, isLoading } = useQuery({
      queryKey: ['me'],
      queryFn: async () => {
         const res = await getMe();
         return res.success ? res.data : null;
      },
   });

   const requestEmailMutation = useMutation({
      mutationFn: () => requestDeliveryEmailChange(newEmail),
      onSuccess: () => {
         toast.success('Verification code sent to your new email');
         setOtpSent(true);
      },
      onError: (err: any) => {
         toast.error(err?.response?.data?.message || 'Failed to request email change');
      },
   });

   const confirmEmailMutation = useMutation({
      mutationFn: () => confirmDeliveryEmailChange(otp),
      onSuccess: () => {
         toast.success('Delivery email updated successfully');
         setIsEditingEmail(false);
         setOtpSent(false);
         setNewEmail('');
         setOtp('');
         queryClient.invalidateQueries({ queryKey: ['me'] });
      },
      onError: (err: any) => {
         toast.error(err?.response?.data?.message || 'Invalid verification code');
      },
   });

   if (isLoading) {
      return (
         <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin size-8 text-primary" />
         </div>
      );
   }

   return (
      <div className="space-y-6 animate-in fade-in duration-200">
         <div className="border-b border-border pb-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">Emails</h2>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed">
               Manage your account's email addresses and notification settings.
            </p>
         </div>

         <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
               <Mail className="size-5 text-muted-foreground" /> Primary & Delivery
            </h3>

            <div className="grid grid-cols-1 gap-4">
               {/* Primary Email (Read-Only) */}
               <div className="p-5 bg-surface border border-border rounded-xl flex items-center justify-between">
                  <div>
                     <div className="flex items-center gap-3">
                        <span className="text-foreground font-medium">{user?.email}</span>
                        <div className="flex gap-2">
                           <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider bg-surface-container-high text-muted-foreground border border-border rounded-full">
                              Primary
                           </span>
                           <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 rounded-full flex items-center gap-1">
                              <ShieldCheck className="size-3" /> Verified
                           </span>
                        </div>
                     </div>
                     <p className="text-xs text-muted-foreground mt-1">
                        Used for account login and recovery. Cannot be changed.
                     </p>
                  </div>
               </div>

               {/* Delivery Email */}
               <div className="p-5 bg-surface border border-border rounded-xl">
                  {isEditingEmail ? (
                     <div className="space-y-4 max-w-md">
                        {!otpSent ? (
                           <>
                              <div className="space-y-2">
                                 <label className="text-sm text-muted-foreground">New delivery email</label>
                                 <Input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="Enter new email"
                                 />
                                 <p className="text-xs text-muted-foreground">
                                    We will send a verification code to this address.
                                 </p>
                              </div>
                              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                                 <Button
                                    onClick={() => requestEmailMutation.mutate()}
                                    disabled={requestEmailMutation.isPending || !newEmail}
                                    className="w-full sm:w-auto"
                                 >
                                    {requestEmailMutation.isPending ? (
                                       <Loader2 className="animate-spin size-4 mr-2" />
                                    ) : null}
                                    Send validation code
                                 </Button>
                                 <Button
                                    variant="ghost"
                                    onClick={() => setIsEditingEmail(false)}
                                    className="w-full sm:w-auto text-muted-foreground hover:text-foreground hover:bg-surface-container h-12"
                                 >
                                    Cancel
                                 </Button>
                              </div>
                           </>
                        ) : (
                           <div className="space-y-4 animate-in fade-in duration-200">
                              <div className="space-y-2">
                                 <label className="text-sm text-muted-foreground">Verification code</label>
                                 <OTPInput
                                    value={otp}
                                    onChange={(val) => setOtp(val)}
                                    disabled={confirmEmailMutation.isPending}
                                 />
                                 <p className="text-xs text-muted-foreground">
                                    Enter the code sent to {newEmail}
                                 </p>
                              </div>
                              <div className="flex items-center gap-3">
                                 <Button
                                    onClick={() => confirmEmailMutation.mutate()}
                                    disabled={confirmEmailMutation.isPending || otp.length < 6}
                                 >
                                    {confirmEmailMutation.isPending ? (
                                       <Loader2 className="animate-spin size-4 mr-2" />
                                    ) : null}
                                    Verify & Save
                                 </Button>
                                 <Button
                                    variant="ghost"
                                    onClick={() => {
                                       setOtpSent(false);
                                       setIsEditingEmail(false);
                                    }}
                                    className="text-muted-foreground"
                                 >
                                    Cancel
                                 </Button>
                              </div>
                           </div>
                        )}
                     </div>
                  ) : (
                     <div className="flex items-center justify-between">
                        <div>
                           <div className="flex items-center gap-3">
                              <span className="text-foreground font-medium">
                                 {user?.deliveryEmail || 'Not set'}
                              </span>
                              <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider bg-surface-container-high text-muted-foreground border border-border rounded-full">
                                 Delivery
                              </span>
                           </div>
                           <p className="text-xs text-muted-foreground mt-1">
                              Where we send you notifications and communication.
                           </p>
                        </div>
                        <Button
                           variant="outline"
                           size="sm"
                           onClick={() => setIsEditingEmail(true)}
                           className="border-border bg-surface-container"
                        >
                           Change
                        </Button>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
