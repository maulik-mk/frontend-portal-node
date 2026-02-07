import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSessions, signoutAll, signoutSession } from '@/lib/api';
import { toast } from 'sonner';
import {
   Monitor,
   Smartphone,
   Laptop,
   Loader2,
   LogOut,
   ArrowLeft,
   MapPin,
   Globe,
   ShieldCheck,
   X,
   Check,
} from 'lucide-react';
import { Button, DottedMap, SessionsSkeleton } from '@/components/index';

interface Session {
   sessionId: string;
   publicId: string;
   email: string;
   username: string;
   browser: string;
   os: string;
   deviceType: string;
   ip: string;
   location: string;
   latitude?: number;
   longitude?: number;
   createdAt: number;
   lastAccessedAt: number;
   isCurrent: boolean;
   isOnline: boolean;
}

export function Sessions() {
   const queryClient = useQueryClient();
   const [selectedSession, setSelectedSession] = useState<Session | null>(null);

   const [showConfirmAll, setShowConfirmAll] = useState(false);
   const [showConfirmSpecific, setShowConfirmSpecific] = useState(false);
   const [mapType, setMapType] = useState<'live' | 'dotted'>('dotted');

   const { data: sessionData, isLoading: loading } = useQuery({
      queryKey: ['sessions'],
      queryFn: async () => {
         const res = await getSessions();
         return res.success ? (res.data as Session[]) : [];
      },
      staleTime: 0, 
   });

   const sessions = sessionData || [];

   const revokeAllMutation = useMutation({
      mutationFn: signoutAll,
      onSuccess: () => {
         toast.success('Successfully signed out of all other devices');
         setSelectedSession(null);
         setShowConfirmAll(false);
         queryClient.invalidateQueries({ queryKey: ['sessions'] });
      },
      onError: () => toast.error('Failed to revoke sessions'),
   });

   const revokeSpecificMutation = useMutation({
      mutationFn: (sessionId: string) => signoutSession(sessionId),
      onSuccess: () => {
         toast.success('Session revoked successfully');
         setSelectedSession(null);
         setShowConfirmSpecific(false);
         queryClient.invalidateQueries({ queryKey: ['sessions'] });
      },
      onError: () => toast.error('Failed to revoke session'),
   });

   const revoking = revokeAllMutation.isPending;
   const revokingSpecific = revokeSpecificMutation.isPending;

   const handleRevokeAll = () => revokeAllMutation.mutate();
   const handleRevokeSpecific = (sessionId: string) => revokeSpecificMutation.mutate(sessionId);

   const getDeviceIcon = (deviceType: string, size = 'size-5') => {
      switch (deviceType.toLowerCase()) {
         case 'mobile':
            return <Smartphone className={size} />;
         case 'tablet':
            return <Smartphone className={size} />;
         case 'desktop':
            return <Monitor className={size} />;
         default:
            return <Laptop className={size} />;
      }
   };

   const formatDate = (timestamp: number) => {
      return new Intl.DateTimeFormat('en-US', {
         month: 'long',
         day: 'numeric',
         year: 'numeric',
         hour: '2-digit',
         minute: '2-digit',
      }).format(new Date(timestamp));
   };

   const getCountryCode = (locationStr: string) => {
      const parts = locationStr.split(',');
      return parts.length > 0 ? parts[parts.length - 1].trim() : 'Unknown';
   };

   if (loading) {
      return (
         <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-border pb-4">
               <h2 className="text-xl font-semibold text-foreground">Web Sessions</h2>
               <p className="text-sm text-muted-foreground mt-1">
                  Active web sessions and devices currently logged into your account.
               </p>
            </div>
            <div className="border border-border rounded-xl overflow-hidden bg-background/50 flex flex-col divide-y divide-border">
               {[...Array(3)].map((_, i) => (
                  <SessionsSkeleton key={i} />
               ))}
            </div>
         </div>
      );
   }

   if (selectedSession) {
      return (
         <div className="space-y-6 animate-in fade-in duration-200 ease-out fill-mode-both">
            <div className="flex items-center gap-3">
               <button
                  onClick={() => {
                     setSelectedSession(null);
                     setShowConfirmSpecific(false);
                  }}
                  className="p-1.5 hover:bg-surface rounded-md transition-colors text-muted-foreground hover:text-foreground"
               >
                  <ArrowLeft className="size-5" />
               </button>
               <h2 className="text-xl font-semibold text-foreground">Session details</h2>
            </div>

            <div className="border border-border rounded-xl overflow-hidden bg-surface p-6 space-y-8">
               <div className="flex items-start gap-5">
                  <div className="p-4 rounded-xl bg-surface border border-border text-surface-variant-foreground">
                     {getDeviceIcon(selectedSession.deviceType, 'size-8')}
                  </div>
                  <div className="space-y-1">
                     <h3 className="text-lg font-semibold text-foreground">
                        {selectedSession.location.split(',')[0]} {selectedSession.ip}
                     </h3>
                     <div className="flex items-center gap-2 text-sm">
                        <div className="relative">
                           <div
                              className={`w-2 h-2 rounded-full ${selectedSession.isOnline ? 'bg-green-500' : 'bg-surface-variant'}`}
                           />
                        </div>
                        <span className="text-muted-foreground capitalize">
                           {selectedSession.isOnline
                              ? 'Active'
                              : selectedSession.isCurrent
                                ? 'Current Session'
                                : 'Unactive'}
                        </span>
                        <span className="text-muted-foreground mx-1">•</span>
                        <span className="text-muted-foreground">
                           Seen in {getCountryCode(selectedSession.location)}
                        </span>
                     </div>
                  </div>
               </div>

               <div className="space-y-8 pt-6 border-t border-border">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                     <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                           <Monitor className="size-3.5" />
                           Device
                        </div>
                        <div className="text-sm text-surface-variant-foreground">
                           {selectedSession.browser} on {selectedSession.os}
                        </div>
                     </div>
                     <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                           <MapPin className="size-3.5" />
                           Last location
                        </div>
                        <div className="text-sm text-surface-variant-foreground">{selectedSession.location}</div>
                     </div>
                     <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                           <Globe className="size-3.5" />
                           IP Address
                        </div>
                        <div className="text-sm text-muted-foreground font-mono">{selectedSession.ip}</div>
                     </div>
                     <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                           <ShieldCheck className="size-3.5" />
                           Last Activity
                        </div>
                        <div className="text-sm text-surface-variant-foreground">
                           {formatDate(selectedSession.lastAccessedAt)}
                        </div>
                     </div>
                  </div>

                  <div className="p-4 bg-surface-container border border-border rounded-lg">
                     <p className="text-xs text-muted-foreground leading-relaxed italic">
                        This session was originally created on{' '}
                        <span className="text-foreground">
                           {formatDate(selectedSession.createdAt)}
                        </span>
                        . If you do not recognize this activity, revoke the session and update your password immediately.
                     </p>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center justify-between px-1">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                           Approximate Location
                        </div>
                        <div className="flex bg-surface border border-border rounded-lg p-1 gap-1">
                           <button
                              onClick={() => setMapType('dotted')}
                              className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
                                 mapType === 'dotted'
                                    ? 'bg-surface-container-high text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-muted-foreground'
                              }`}
                           >
                              Stylized
                           </button>
                           <button
                              onClick={() => setMapType('live')}
                              className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
                                 mapType === 'live'
                                    ? 'bg-surface-container-high text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-muted-foreground'
                              }`}
                           >
                              Map
                           </button>
                        </div>
                     </div>
                     <div className="rounded-xl overflow-hidden border border-border bg-surface h-80 relative shadow-2xl">
                        {selectedSession.latitude && selectedSession.longitude ? (
                           mapType === 'live' ? (
                              <iframe
                                 width="100%"
                                 height="100%"
                                 frameBorder="0"
                                 scrolling="no"
                                 src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(selectedSession.longitude) - 0.05},${Number(selectedSession.latitude) - 0.05},${Number(selectedSession.longitude) + 0.05},${Number(selectedSession.latitude) + 0.05}&layer=mapnik&marker=${selectedSession.latitude},${selectedSession.longitude}`}
                                 style={{
                                    filter:
                                       'invert(90%) hue-rotate(180deg) brightness(85%) contrast(85%)',
                                 }}
                              />
                           ) : (
                              <div className="relative h-full w-full overflow-hidden">
                                 <div className="absolute inset-0 bg-radial from-transparent to-background/20" />
                                 <DottedMap
                                    markers={[
                                       {
                                          lat: selectedSession.latitude,
                                          lng: selectedSession.longitude,
                                          size: 0.5,
                                       },
                                    ]}
                                    dotRadius={0.2}
                                    dotColor="#3F3F46"
                                    markerColor="#FF6B00"
                                    className="p-4"
                                 />
                                 <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-background/80 border border-border rounded-full text-[10px] text-foreground font-mono backdrop-blur-sm">
                                    <MapPin className="size-3 text-primary" />
                                    {selectedSession.latitude.toFixed(4)},{' '}
                                    {selectedSession.longitude.toFixed(4)}
                                 </div>
                              </div>
                           )
                        ) : (
                           <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2">
                              <Globe className="size-8 text-muted-foreground" />
                              <span>Real-time location data unavailable</span>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex justify-end pt-4">
               {!selectedSession.isCurrent && (
                  <div className="flex items-center gap-3">
                     {showConfirmSpecific ? (
                        <div className="flex items-center gap-2 animate-in fade-in duration-200">
                           <span className="text-sm text-muted-foreground mr-2">Are you sure?</span>
                           <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setShowConfirmSpecific(false)}
                              className="text-muted-foreground hover:text-foreground"
                           >
                              <X className="size-4 mr-1" /> Cancel
                           </Button>
                           <Button
                              size="sm"
                              className="bg-destructive/20 text-destructive hover:bg-destructive/30 border border-destructive/50"
                              onClick={() => handleRevokeSpecific(selectedSession.sessionId)}
                              disabled={revokingSpecific}
                           >
                              {revokingSpecific ? (
                                 <Loader2 className="animate-spin size-4 mr-1" />
                              ) : (
                                 <Check className="size-4 mr-1" />
                              )}
                              Confirm Revoke
                           </Button>
                        </div>
                     ) : (
                        <Button
                           variant="outline"
                           className="border-border text-destructive hover:bg-surface-container hover:text-destructive px-8 py-5 text-sm font-semibold transition-all"
                           onClick={() => setShowConfirmSpecific(true)}
                        >
                           <LogOut className="size-4 mr-2" />
                           Revoke session
                        </Button>
                     )}
                  </div>
               )}
            </div>
         </div>
      );
   }

   return (
      <div className="space-y-6 animate-in fade-in duration-200">
         <div className="border-b border-border pb-4 flex items-center justify-between">
            <div>
               <h2 className="text-xl font-semibold text-foreground">Web Sessions</h2>
               <p className="text-sm text-muted-foreground mt-1">
                  Active web sessions and devices currently logged into your account.
               </p>
            </div>

            <div className="flex items-center gap-3">
               {showConfirmAll ? (
                  <div className="flex items-center gap-2 animate-in duration-200">
                     <span className="text-xs text-muted-foreground">Sign out elsewhere?</span>
                     <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => setShowConfirmAll(false)}
                        className="text-muted-foreground"
                     >
                        Cancel
                     </Button>
                     <Button
                        size="sm"
                        variant="destructive"
                        className="px-4"
                        onClick={handleRevokeAll}
                        disabled={revoking}
                     >
                        {revoking && <Loader2 className="animate-spin size-3 mr-1" />}
                        Yes, Revoke
                     </Button>
                  </div>
               ) : (
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={() => setShowConfirmAll(true)}
                     disabled={revoking || sessions.length <= 1}
                     className="border-border text-destructive hover:bg-surface hover:text-destructive font-medium"
                  >
                     <LogOut className="size-4 mr-2" />
                     Revoke all others
                  </Button>
               )}
            </div>
         </div>

         <div className="border border-border rounded-xl overflow-hidden bg-background/50 flex flex-col divide-y divide-border animate-in fade-in duration-200 ease-out fill-mode-both">
            {sessions.map((session: Session, index: number) => (
               <div
                  key={index}
                  className="flex items-center justify-between p-5 bg-surface/40 hover:bg-surface-container/30 transition-all group cursor-pointer"
                  onClick={() => setSelectedSession(session)}
               >
                  <div className="flex items-center gap-5">
                     <div className="p-3.5 rounded-xl bg-surface border border-border text-muted-foreground transition-all shadow-sm group-hover:shadow-md">
                        {getDeviceIcon(session.deviceType, 'size-6')}
                     </div>
                     <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                           <span className="text-base font-bold text-foreground transition-colors">
                              {session.location.split(',')[0]} {session.ip}
                           </span>
                           {session.isCurrent && (
                              <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 rounded-full">
                                 Current
                              </span>
                           )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                           <div className="flex items-center gap-1.5">
                              <div
                                 className={`w-1.5 h-1.5 rounded-full ${session.isOnline ? 'bg-primary' : 'bg-muted'}`}
                              />
                              <span className={session.isOnline ? 'text-primary' : ''}>
                                 {session.isOnline ? 'Active Now' : 'Last Active'}
                              </span>
                           </div>
                           <span className="text-muted-foreground/30">•</span>
                           <span>
                              {session.browser} on {session.os}
                           </span>
                        </div>
                     </div>
                  </div>

                  <Button
                     variant="outline"
                     size="sm"
                     className="border-border bg-surface-container text-foreground hover:bg-surface-container-high hover:text-foreground hover:border-border transition-all px-5 font-bold shadow-sm"
                  >
                     Details
                  </Button>
               </div>
            ))}
         </div>
      </div>
   );
}
