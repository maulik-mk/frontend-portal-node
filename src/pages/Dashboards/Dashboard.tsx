import {
   Avatar,
   AvatarFallback,
   AvatarCircles,
   DropdownMenu,
   DropdownMenuTrigger,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   Button
} from '@/components/index';
import { User, Settings as SettingsIcon, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
   const { user, logout } = useAuth();
   const navigate = useNavigate();
   const [isLoggingOut, setIsLoggingOut] = useState(false);

   const handleLogout = async () => {
      setIsLoggingOut(true);
      await logout();
      setIsLoggingOut(false);
   };

   // Get initials from username
   const initials = user?.username ? user.username.substring(0, 2).toUpperCase() : 'MK';

   return (
      <div className="bg-background min-h-screen flex flex-col">
         <header className="fixed top-0 left-0 w-full flex items-center justify-end px-4 md:px-8 py-4 border-b border-border bg-background/80 backdrop-blur-md z-50">
            <div className="flex gap-4">
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <div className="focus:outline-none cursor-pointer">
                        <AvatarCircles
                           avatarUrls={[{ avatarId: user?.avatarId }]}
                           size={40}
                        />
                     </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                     align="end"
                     className="w-64 bg-surface-container text-foreground shadow-2xl animate-in fade-in-0 border-none rounded-xl"
                  >
                     <DropdownMenuLabel className="p-4 flex items-center gap-3">
                        <Avatar className="size-10">
                           <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                           <span className="text-sm font-semibold">
                              {user?.username || 'Guest'}
                           </span>
                           <span className="text-xs text-muted-foreground">
                              {user?.email || 'No email provided'}
                           </span>
                        </div>
                     </DropdownMenuLabel>

                     <DropdownMenuSeparator className="bg-surface-container-high" />

                     <div className="py-1">
                        <DropdownMenuItem
                           onClick={() => navigate('/settings/profile')}
                           className="flex items-center gap-3 px-4 py-2 hover:bg-surface-container-high transition-colors cursor-pointer focus:bg-surface-container-high"
                        >
                           <User className="size-4 text-muted-foreground" />
                           <span className="text-sm">Profile</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                           onClick={() => navigate('/settings/profile')}
                           className="flex items-center gap-3 px-4 py-2 hover:bg-surface-container-high transition-colors cursor-pointer focus:bg-surface-container-high"
                        >
                           <SettingsIcon className="size-4 text-muted-foreground" />
                           <span className="text-sm">Settings</span>
                        </DropdownMenuItem>
                     </div>

                     <DropdownMenuSeparator className="bg-surface-container-high" />

                     <DropdownMenuItem
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center gap-3 px-4 py-2 text-destructive hover:text-destructive hover:bg-surface-container-high transition-colors cursor-pointer focus:bg-surface-container-high group disabled:opacity-50"
                     >
                        {isLoggingOut ? (
                           <Loader2 className="animate-spin size-4" />
                        ) : (
                           <LogOut className="size-4" />
                        )}
                        <span className="text-sm">Sign out</span>
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </header>
         <main className="flex-1 max-w-7xl mx-auto w-full pt-24 pb-12 px-6">
            <div className="flex flex-col gap-10">
               {/* Hero Section */}
               <section className="flex flex-col md:flex-row items-center justify-between gap-8 py-10">
                  <div className="space-y-4 max-w-2xl">
                     <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
                        Welcome back,<br/>
                        <span className="text-secondary">{user?.username}</span>
                     </h1>
                     <p className="text-lg text-muted-foreground leading-relaxed">
                        Your central hub for account management. Monitor security events, manage active sessions, and update your public identity.
                     </p>
                     <div className="flex flex-wrap gap-4 pt-2">
                        <Button 
                           onClick={() => navigate('/settings/profile')}
                           className="px-8 py-6 text-base"
                        >
                           Manage Profile
                        </Button>
                        <Button 
                           variant="outline"
                           onClick={() => navigate('/settings/security')}
                           className="px-8 py-6 text-base bg-surface-container-high border-border"
                        >
                           Security Settings
                        </Button>
                     </div>
                  </div>
                  <div className="relative hidden lg:block">
                     <div className="absolute inset-0 bg-secondary/20 blur-[100px] rounded-full" />
                     <AvatarCircles
                        avatarUrls={[{ avatarId: user?.avatarId }]}
                        size={200}
                        className="relative z-10 border-8 border-background shadow-2xl"
                     />
                  </div>
               </section>

               {/* Quick Stats / Access */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                  <div 
                     onClick={() => navigate('/settings/security')}
                     className="group p-6 bg-surface-container/30 border border-border rounded-2xl hover:bg-surface-container/50 transition-all cursor-pointer"
                  >
                     <div className="p-3 bg-primary/10 text-primary w-fit rounded-xl group-hover:scale-110 transition-transform">
                        <User className="size-6" />
                     </div>
                     <h3 className="text-xl font-bold text-foreground mt-4">Profile</h3>
                     <p className="text-sm text-muted-foreground mt-2">Update your personal information and public profile.</p>
                  </div>

                  <div 
                     onClick={() => navigate('/settings/security')}
                     className="group p-6 bg-surface-container/30 border border-border rounded-2xl hover:bg-surface-container/50 transition-all cursor-pointer"
                  >
                     <div className="p-3 bg-secondary/10 text-secondary w-fit rounded-xl group-hover:scale-110 transition-transform">
                        <LogOut className="size-6 rotate-180" />
                     </div>
                     <h3 className="text-xl font-bold text-foreground mt-4">Security</h3>
                     <p className="text-sm text-muted-foreground mt-2">Manage passwords and two-factor authentication.</p>
                  </div>

                  <div 
                     onClick={() => navigate('/settings/sessions')}
                     className="group p-6 bg-surface-container/30 border border-border rounded-2xl hover:bg-surface-container/50 transition-all cursor-pointer"
                  >
                     <div className="p-3 bg-warning/10 text-warning w-fit rounded-xl group-hover:scale-110 transition-transform">
                        <SettingsIcon className="size-6" />
                     </div>
                     <h3 className="text-xl font-bold text-foreground mt-4">Sessions</h3>
                     <p className="text-sm text-muted-foreground mt-2">View and manage all your active web sessions.</p>
                  </div>
               </div>
            </div>
         </main>
      </div>
   );
}

export default Dashboard;
