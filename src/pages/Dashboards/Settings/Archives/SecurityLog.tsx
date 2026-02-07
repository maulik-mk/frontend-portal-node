import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAuditLogs } from '@/lib/api';
import { Button } from '@/components/index';
import {
   Loader2,
   ShieldAlert,
   KeyRound,
   User,
   LogOut,
   LogIn,
   ShieldCheck,
   Globe,
   Activity,
   Clock,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { SecurityLogSkeleton } from '@/components/skeleton';

interface AuditLog {
   id: string;
   action: string;
   operationType: string;
   ipHash: string;
   metadata: string;
   timestamp: number;
}

const LIMIT = 10;

export function SecurityLog() {
   const [logs, setLogs] = useState<AuditLog[]>([]);
   const [page, setPage] = useState(0);
   const [hasMore, setHasMore] = useState(true);
   const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

   const {
      data: fetchedLogs,
      isLoading,
      isFetching,
   } = useQuery({
      queryKey: ['security-logs', page],
      queryFn: async () => {
         const res = await getAuditLogs(LIMIT, page * LIMIT);
         return res.success ? (res.data as AuditLog[]) : [];
      },
   });

   useEffect(() => {
      if (fetchedLogs) {
         if (fetchedLogs.length < LIMIT) {
            setHasMore(false);
         }

         setLogs((prev) => {
            const newLogs = fetchedLogs.filter((f) => !prev.some((p) => p.id === f.id));
            return [...prev, ...newLogs];
         });
      }
   }, [fetchedLogs]);

   const getActionConfig = (action: string) => {
      switch (action) {
         case 'auth.login_success':
         case 'auth.login_success_2fa':
            return {
               icon: <LogIn className="size-4 text-primary" />,
               color: 'text-primary',
               bg: 'bg-primary/10',
               border: 'border-l-primary',
            };
         case 'auth.login_failed':
            return {
               icon: <ShieldAlert className="size-4 text-destructive" />,
               color: 'text-destructive',
               bg: 'bg-destructive/10',
               border: 'border-l-destructive',
            };
         case 'auth.logout':
         case 'auth.logout_all':
         case 'auth.revoke_session':
            return {
               icon: <LogOut className="size-4 text-warning" />,
               color: 'text-warning',
               bg: 'bg-warning/10',
               border: 'border-l-warning',
            };
         case 'user.password_changed':
         case 'user.password_reset_completed':
         case 'user.password_reset_requested':
         case 'user.password_change_otp_sent':
            return {
               icon: <KeyRound className="size-4 text-secondary" />,
               color: 'text-secondary',
               bg: 'bg-secondary/10',
               border: 'border-l-secondary',
            };
         case 'user.update_profile':
            return {
               icon: <User className="size-4 text-info" />,
               color: 'text-info',
               bg: 'bg-info/10',
               border: 'border-l-info',
            };
         case 'user.enable_2fa':
            return {
               icon: <ShieldCheck className="size-4 text-primary" />,
               color: 'text-primary',
               bg: 'bg-primary/10',
               border: 'border-l-primary',
            };
         case 'user.disable_2fa':
            return {
               icon: <ShieldAlert className="size-4 text-destructive" />,
               color: 'text-destructive',
               bg: 'bg-destructive/10',
               border: 'border-l-destructive',
            };
         case 'user.account_locked':
            return {
               icon: <ShieldAlert className="size-4 text-destructive" />,
               color: 'text-destructive',
               bg: 'bg-destructive/10',
               border: 'border-l-destructive',
            };
         case 'auth.signup_completed':
            return {
               icon: <User className="size-4 text-primary" />,
               color: 'text-primary',
               bg: 'bg-primary/10',
               border: 'border-l-primary',
            };
         default:
            return {
               icon: <Activity className="size-4 text-muted-foreground" />,
               color: 'text-muted-foreground',
               bg: 'bg-surface-container-high',
               border: 'border-l-border',
            };
      }
   };

   const formatActionName = (action: string) => {
      const parts = action.split('.');
      const actionPart = parts.length > 1 ? parts[1] : parts[0];
      return actionPart
         .split('_')
         .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
         .join(' ');
   };


   const renderMetadata = (metadataStr: string) => {
      if (!metadataStr || metadataStr === '{}') return null;
      try {
         const data = JSON.parse(metadataStr);
         const keys = Object.keys(data);
         if (keys.length === 0) return null;

         return (
            <div className="mt-3 flex flex-wrap gap-2">
               {keys.map((key) => {
                  if (key.toLowerCase() === 'status') return null;
                  
                  return (
                     <div
                        key={key}
                        className="flex items-center bg-surface-container-high/50 border border-border/40 rounded-lg px-2.5 py-1"
                     >
                        <span className="text-[9px] uppercase font-black text-muted-foreground/70 tracking-widest mr-2">
                           {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span
                           className="text-[11px] text-foreground font-bold truncate max-w-[200px]"
                           title={String(data[key])}
                        >
                           {String(data[key])}
                        </span>
                     </div>
                  );
               })}
            </div>
         );
      } catch (e) {
         return null;
      }
   };   const [searchQuery, setSearchQuery] = useState('');
   const [activeFilter, setActiveFilter] = useState<'all' | 'success' | 'failure'>('all');

   const filteredLogs = logs.filter(log => {
      const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           log.ipHash.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeFilter === 'all') return matchesSearch;
      if (activeFilter === 'success') return matchesSearch && log.action.includes('success');
      if (activeFilter === 'failure') return matchesSearch && (log.action.includes('failed') || log.action.includes('locked'));
      return matchesSearch;
   });

   const groupedLogs: { [key: string]: AuditLog[] } = filteredLogs.reduce((acc: any, log) => {
      const date = format(new Date(log.timestamp), 'MMMM d, yyyy');
      if (!acc[date]) acc[date] = [];
      acc[date].push(log);
      return acc;
   }, {});

   return (
      <div className="space-y-6 animate-in fade-in duration-200">
         <div className="border-b border-border pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
               <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="size-5 text-primary" />
                  Security Log
               </h2>
               <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed">
                  Review a chronological history of security events and sensitive activity associated with your account.
               </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
               <div className="relative group">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input 
                     type="text"
                     placeholder="Filter by action or IP..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="pl-9 pr-4 py-2 bg-surface-container border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-full md:w-64 text-foreground placeholder:text-muted-foreground/50"
                  />
               </div>
               <div className="flex bg-surface-container border border-border rounded-xl p-1">
                  {(['all', 'success', 'failure'] as const).map((f) => (
                     <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                           activeFilter === f 
                           ? 'bg-background text-foreground shadow-sm' 
                           : 'text-muted-foreground hover:text-foreground'
                        }`}
                     >
                        {f}
                     </button>
                  ))}
               </div>
            </div>
         </div>

         {isLoading && page === 0 ? (
            <div className="space-y-4">
               {[...Array(6)].map((_, i) => (
                  <SecurityLogSkeleton key={i} />
               ))}
            </div>
         ) : (
            <div className="space-y-8">
               {Object.keys(groupedLogs).length === 0 ? (
                  <div className="p-16 text-center border border-dashed border-border rounded-3xl bg-surface/30">
                     <div className="p-4 bg-surface-container w-fit mx-auto rounded-full mb-4">
                        <Activity className="size-8 text-muted-foreground/50" />
                     </div>
                     <h3 className="text-foreground font-bold text-lg">No security events found</h3>
                     <p className="text-sm text-muted-foreground mt-1.5 max-w-xs mx-auto">
                        {searchQuery 
                           ? `We couldn't find any logs matching "${searchQuery}".`
                           : "We haven't recorded any security events for this period."}
                     </p>
                     {searchQuery && (
                        <Button 
                           variant="ghost" 
                           onClick={() => setSearchQuery('')}
                           className="mt-4 text-primary text-xs font-bold"
                        >
                           Clear search query
                        </Button>
                     )}
                  </div>
               ) : (
                  Object.entries(groupedLogs).map(([date, logsInGroup]) => (
                     <div key={date} className="space-y-4">
                        <div className="flex items-center gap-4">
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 whitespace-nowrap">
                              {date}
                           </span>
                           <div className="h-px w-full bg-border/40" />
                        </div>
                        
                         <div className="bg-surface border border-border rounded-2xl overflow-hidden divide-y divide-border/50 shadow-sm">
                            {logsInGroup.map((log) => {
                               const config = getActionConfig(log.action);
                               return (
                                  <div key={log.id} className="group flex flex-col transition-colors hover:bg-surface-container/30">
                                     <div 
                                        className="flex items-center gap-4 px-4 py-3 cursor-pointer"
                                        onClick={() => setSelectedLogId(selectedLogId === log.id ? null : log.id)}
                                     >
                                        <div className={`p-2 rounded-lg shrink-0 ${config.bg} border border-current/5`}>
                                           {config.icon}
                                        </div>
                                        
                                        <div className="flex-1 flex items-center justify-between min-w-0">
                                           <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-6">
                                              <h4 className="text-sm font-bold text-foreground w-full md:w-48 truncate">
                                                 {formatActionName(log.action)}
                                              </h4>
                                              
                                              <div className="flex items-center gap-4 text-[11px] text-muted-foreground font-medium">
                                                 <span className="flex items-center gap-1.5 w-24">
                                                    <Globe className="size-3 opacity-50" />
                                                    <span className="font-mono lowercase truncate">{log.ipHash}</span>
                                                 </span>
                                                 <span className="flex items-center gap-1.5 whitespace-nowrap">
                                                    <Clock className="size-3 opacity-50" />
                                                    <span className="text-foreground/80">{format(new Date(log.timestamp), 'HH:mm:ss')}</span>
                                                    <span className="opacity-30">•</span>
                                                    <span className="text-muted-foreground/60">
                                                       {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                                                    </span>
                                                 </span>
                                              </div>
                                           </div>
                                           
                                           <div className="flex items-center gap-3">
                                              {log.metadata && log.metadata !== '{}' && (
                                                 <span className="text-[10px] bg-surface-container-high px-2 py-0.5 rounded text-muted-foreground font-bold">
                                                    {Object.keys(JSON.parse(log.metadata)).length} metadata
                                                 </span>
                                              )}
                                              <div className="text-[10px] font-mono text-muted-foreground/20 uppercase tracking-widest hidden sm:block">
                                                 {log.id.substring(0, 6)}
                                              </div>
                                           </div>
                                        </div>
                                     </div>
                                     
                                     {selectedLogId === log.id && (
                                        <div className="px-16 pb-4 animate-in slide-in-from-top-1 duration-200">
                                           {renderMetadata(log.metadata)}
                                        </div>
                                     )}
                                  </div>
                               );
                            })}
                         </div>
                     </div>
                  ))
               )}
            </div>
         )}

         {logs.length > 0 && (
            <div className="flex flex-col items-center gap-4 pt-6 border-t border-border/50">
               {hasMore ? (
                  <Button
                     variant="outline"
                     className="bg-surface border-border hover:bg-surface-container-high text-surface-variant-foreground rounded-full px-6 shadow-sm"
                     onClick={() => setPage((p) => p + 1)}
                     disabled={isFetching}
                  >
                     {isFetching ? <Loader2 className="animate-spin size-4 mr-2" /> : null}
                     {isFetching ? 'Loading older events...' : 'Load older events'}
                  </Button>
               ) : (
                  <p className="text-xs text-muted-foreground italic">You've reached the end of the log.</p>
               )}

               <p className="text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="size-3" />
                  Detailed metadata is stored securely for the last 90 days.
               </p>
            </div>
         )}
      </div>
   );
}
