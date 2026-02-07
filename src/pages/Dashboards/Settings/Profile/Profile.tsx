import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMe, updateName } from '@/lib/api';
import { toast } from 'sonner';
import { Button, Input, AvatarUpload } from '@/components/index';
import { User, Loader2, Info } from 'lucide-react';

export function Profile() {
   const queryClient = useQueryClient();

   const [isEditingName, setIsEditingName] = useState(false);
   const [firstName, setFirstName] = useState('');
   const [lastName, setLastName] = useState('');

   const { data: user, isLoading } = useQuery({
      queryKey: ['me'],
      queryFn: async () => {
         const res = await getMe();
         if (res.success && !isEditingName) {
            setFirstName(res.data.firstName || '');
            setLastName(res.data.lastName || '');
         }
         return res.success ? res.data : null;
      },
   });

   const updateNameMutation = useMutation({
      mutationFn: () => updateName(firstName, lastName),
      onSuccess: () => {
         toast.success('Profile updated successfully');
         setIsEditingName(false);
         queryClient.invalidateQueries({ queryKey: ['me'] });
      },
      onError: (err: any) => {
         toast.error(err?.response?.data?.message || 'Failed to update name');
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
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
               Public Profile
            </h2>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed">
               Update your public identity and account preferences.
            </p>
         </div>
 
         <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-background/50 border border-border rounded-2xl">
            <AvatarUpload 
               currentAvatarId={user?.avatarId} 
               size={110} 
               onSuccess={() => queryClient.invalidateQueries({ queryKey: ['me'] })}
            />
            <div className="flex-1 space-y-2 text-center md:text-left">
               <h3 className="text-lg font-medium text-foreground">Profile picture</h3>
               <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                  Supports PNG, JPG, or JPEG up to 5MB. Images are automatically squared for consistency.
               </p>
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-[11px] text-primary font-medium">
                  <Info size={14} />
                  Publicly visible avatar
               </div>
            </div>
         </div>

         <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
               <User className="size-5 text-muted-foreground" /> Name
            </h3>

            <div className="p-6 bg-surface border border-border rounded-xl space-y-4">
               {isEditingName ? (
                  <div className="space-y-4 max-w-md">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-sm text-muted-foreground">First name</label>
                           <Input
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              placeholder="First name"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm text-muted-foreground">Last name</label>
                           <Input
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              placeholder="Last name"
                           />
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <Button
                           onClick={() => updateNameMutation.mutate()}
                           disabled={updateNameMutation.isPending || !firstName || !lastName}
                        >
                           {updateNameMutation.isPending ? (
                              <Loader2 className="animate-spin size-4 mr-2" />
                           ) : null}
                           Save changes
                        </Button>
                        <Button
                           variant="ghost"
                           onClick={() => setIsEditingName(false)}
                           className="text-muted-foreground hover:text-foreground"
                        >
                           Cancel
                        </Button>
                     </div>
                  </div>
               ) : (
                  <div className="flex items-center justify-between gap-4">
                     <div className="space-y-1">
                        <p className="text-lg text-foreground font-semibold">
                           {user?.firstName || 'Not set'} {user?.lastName || ''}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                           This name will be displayed publicly on your profile.
                        </p>
                     </div>
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingName(true)}
                        className="border-border bg-surface-container hover:bg-surface-container-high px-6 font-semibold shadow-sm"
                     >
                        Edit
                     </Button>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
