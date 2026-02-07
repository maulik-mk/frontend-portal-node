import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
   User,
   Settings as SettingsIcon,
   Shield,
   Monitor,
   Palette,
   Accessibility,
   ArrowLeft,
   ChevronRight,
   Mail,
   Activity,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

import { Profile } from './Profile/Profile';
import { Emails } from './Access/Emails';
import { Sessions } from './Access/Sessions';
import { Security } from './Access/Security';
import { SecurityLog } from './Archives/SecurityLog';
import { AvatarCircles } from '@/components/index';

interface SidebarItem {
   id: string;
   label: string;
   icon: React.ReactNode;
   active?: boolean;
   disabled?: boolean;
}

interface SidebarGroup {
   title: string | null;
   items: SidebarItem[];
}

const sidebarGroups: SidebarGroup[] = [
   {
      title: null,
      items: [
         {
            id: 'profile',
            label: 'Public profile',
            icon: <User className="size-4" />,
            active: true,
         },
         {
            id: 'account',
            label: 'Account',
            icon: <SettingsIcon className="size-4" />,
            disabled: true,
         },
         {
            id: 'appearance',
            label: 'Appearance',
            icon: <Palette className="size-4" />,
            disabled: true,
         },
         {
            id: 'accessibility',
            label: 'Accessibility',
            icon: <Accessibility className="size-4" />,
            disabled: true,
         },
      ],
   },
   {
      title: 'Access',
      items: [
         { id: 'emails', label: 'Emails', icon: <Mail className="size-4" />, active: true },
         {
            id: 'security',
            label: 'Password and authentication',
            icon: <Shield className="size-4" />,
            active: true,
         },
         { id: 'sessions', label: 'Sessions', icon: <Monitor className="size-4" />, active: true },
      ],
   },
   {
      title: 'Archives',
      items: [
         {
            id: 'security-log',
            label: 'Security log',
            icon: <Activity className="size-4" />,
            active: true,
         },
      ],
   },
];

export default function Settings() {
   const { user } = useAuth();
   const location = useLocation();
   const navigate = useNavigate();

   const tab = location.pathname.split('/').pop() || 'sessions';
   const isSessions = tab === 'sessions' || location.pathname.endsWith('/settings');
   const isSecurity = tab === 'security';
   const isProfile = tab === 'profile';
   const isEmails = tab === 'emails';
   const isSecurityLog = tab === 'security-log';

   return (
      <div className="bg-background min-h-screen text-foreground flex flex-col">
         <header className="border-b border-border bg-background sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <button
                     onClick={() => navigate('/')}
                     className="p-1.5 hover:bg-surface-container-high rounded-md transition-colors text-muted-foreground hover:text-foreground"
                  >
                     <ArrowLeft className="size-4" />
                  </button>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                     <span
                        className="hover:text-foreground cursor-pointer"
                        onClick={() => navigate('/')}
                     >
                        Dashboard
                     </span>
                     <ChevronRight className="size-3 opacity-50" />
                     <span className="text-foreground font-medium capitalize">
                        {tab.replace('-', ' ')}
                     </span>
                  </div>
               </div>
            </div>
         </header>

         <main className="max-w-7xl mx-auto px-4 py-6 w-full flex-1 flex flex-col gap-6 animate-in fade-in duration-200">
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5">
               <div className="flex items-center gap-4">
                  <AvatarCircles
                     numPeople={0}
                     size={55}
                     avatarUrls={[
                        {
                           avatarId: user?.avatarId,
                        },
                     ]}
                  />
                  <div className="flex flex-col">
                     <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                        {user?.username?.toUpperCase() || 'MAULIK MK'}
                        <span className="text-muted-foreground font-normal text-lg">
                           ({user?.username || 'maulik-mk'})
                        </span>
                     </h1>
                     <p className="text-sm text-muted-foreground">Your personal account</p>
                  </div>
               </div>
               <button className="px-3 py-1.5 border border-border rounded-md text-xs font-medium text-surface-variant-foreground hover:bg-surface-container-high transition-colors shadow-sm">
                  Go to your personal profile
               </button>
            </header>

            <div className="flex flex-col md:flex-row gap-8">
               <aside className="w-full md:w-64 shrink-0">
                  <nav className="flex flex-col gap-0.5">
                     {sidebarGroups.map((group, index) => (
                        <div key={index} className="flex flex-col">
                           {group.title && (
                              <div className={`${index === 0 ? 'mb-2' : 'mt-6 pt-4 border-t border-border/60 mb-2'}`}>
                                 <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider pl-1">
                                    {group.title}
                                 </h3>
                              </div>
                           )}

                           <div className="space-y-0.5">
                              {group.items.map((item) => {
                                 const isItemActive =
                                    item.id === tab || (item.id === 'sessions' && isSessions);

                                 return (
                                    <Link
                                       key={item.id}
                                       to={item.disabled ? '#' : `/settings/${item.id}`}
                                       className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all relative ${
                                          isItemActive
                                             ? 'bg-surface border-l-[3px] border-secondary rounded-l-none text-foreground font-medium'
                                             : 'text-muted-foreground hover:bg-surface-container-high/40 hover:text-foreground'
                                       } ${item.disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}`}
                                    >
                                       <span
                                          className={`${isItemActive ? 'text-secondary' : 'text-muted-foreground'} size-4 flex items-center justify-center`}
                                       >
                                          {item.icon}
                                       </span>
                                       {item.label}
                                    </Link>
                                 );
                              })}
                           </div>
                        </div>
                     ))}
                  </nav>
               </aside>

               <section className="flex-1 min-w-0">
                  {isProfile && <Profile />}
                  {isEmails && <Emails />}
                  {isSessions && <Sessions />}
                  {isSecurity && <Security />}
                  {isSecurityLog && <SecurityLog />}

                  {!isProfile && !isEmails && !isSessions && !isSecurity && !isSecurityLog && (
                     <div className="flex flex-col items-center justify-center p-20 text-center space-y-4 border border-border rounded-xl bg-surface">
                        <div className="p-4 rounded-full bg-background border border-border">
                           <SettingsIcon className="size-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">Under Construction</h3>
                        <p className="text-muted-foreground max-w-xs">
                           This settings page is currently being built. Please check the active tabs
                           for available management options.
                        </p>
                     </div>
                  )}
               </section>
            </div>
         </main>
      </div>
   );
}
