import { Link } from 'react-router-dom';
import { Button, AnimatedGridPattern, DottedMap } from '@/components/index';
import { 
   Shield, 
   Zap, 
   ArrowRight, 
   Github, 
   Cloud, 
   Database, 
   Hexagon, 
   Server,
   ShieldCheck,
   Globe
} from 'lucide-react';
import { motion } from 'motion/react';

const TECH_STACK = [
   { name: 'Azure', icon: Cloud, description: 'Enterprise Cloud' },
   { name: 'Fastify', icon: Zap, description: 'High Performance' },
   { name: 'PostgreSQL', icon: Database, description: 'Reliable Storage' },
   { name: 'GraphQL', icon: Hexagon, description: 'Flexible API' },
   { name: 'Redis', icon: Server, description: 'Fast Caching' },
];

const FEATURES = [
   {
      title: 'Enterprise Security',
      description: 'Bank-grade security with multi-factor authentication and encrypted sessions.',
      icon: ShieldCheck,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
   },
   {
      title: 'Lightning Fast',
      description: 'Built on Fastify for sub-millisecond response times and high throughput.',
      icon: Zap,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
   },
   {
      title: 'Global Scale',
      description: 'Deploy across regions with Azure integration and edge-ready infrastructure.',
      icon: Globe,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
   }
];

function Home() {
   return (
      <div className="bg-background min-h-screen flex flex-col relative overflow-hidden selection:bg-primary/30 selection:text-primary-foreground">
         {/* Background Decoration */}
         <div className="absolute inset-0 z-0 pointer-events-none">
            <AnimatedGridPattern
               numSquares={35}
               maxOpacity={0.06}
               duration={3}
               repeatDelay={1}
               className="[mask-image:radial-gradient(600px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[200%] skew-y-6"
            />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-primary/5 blur-[120px] rounded-full opacity-50" />
         </div>

         {/* Navigation */}
         <header className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 bg-background/40 backdrop-blur-md border-b border-border/10 z-50">
            <div className="flex items-center gap-2.5">
               <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Shield className="text-primary size-4.5" />
               </div>
               <span className="text-lg font-bold tracking-tight text-foreground">Identity</span>
            </div>
            
            <nav className="hidden lg:flex items-center gap-8 px-8 py-1.5 rounded-full border border-border/20 bg-surface-container-low/20">
               <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
               <a href="#infrastructure" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Infrastructure</a>
               <a href="#github" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Documentation</a>
            </nav>

            <div className="flex items-center gap-3">
               <Button
                  variant="ghost"
                  className="text-foreground hover:text-primary text-sm font-medium px-4 h-9"
                  asChild
               >
                  <Link to="/signin">Sign In</Link>
               </Button>
               <Button
                  className="bg-primary text-primary-foreground hover:opacity-90 text-sm font-bold px-6 rounded-full h-9 shadow-lg shadow-primary/20"
                  asChild
               >
                  <Link to="/signup">Get Started</Link>
               </Button>
            </div>
         </header>

         <main className="flex-1 relative z-10">
            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6 flex flex-col items-center text-center">
               <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[11px] font-black uppercase tracking-wider mb-8"
               >
                  <span className="relative flex h-2 w-2">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Enterprise Ready
               </motion.div>

               <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-6xl md:text-8xl font-black text-foreground tracking-tight leading-[0.9] mb-8"
               >
                  Modern Identity <br />
                  <span className="bg-gradient-to-r from-primary via-blue-400 to-indigo-500 bg-clip-text text-transparent">
                     Infrastructure.
                  </span>
               </motion.h1>

               <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12"
               >
                  Secure authentication, unified session management, and granular security logs. 
                  Simple to integrate, impossible to outgrow.
               </motion.p>

               <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
               >
                  <Button size="lg" className="h-12 px-10 text-sm font-bold rounded-full group shadow-xl shadow-primary/20" asChild>
                     <Link to="/signup">
                        Start building
                        <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                     </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="h-12 px-10 text-sm font-bold rounded-full border-border bg-surface-container-low/10 hover:bg-surface-container-low/30 transition-all text-muted-foreground hover:text-foreground" asChild>
                     <a href="https://github.com/maulik-mk" target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 size-4" />
                        View on GitHub
                     </a>
                  </Button>
               </motion.div>

               {/* Dashboard Preview Mockup */}
               <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="mt-24 w-full max-w-5xl aspect-[16/10] bg-surface-container-lowest/50 border border-border/20 rounded-3xl p-3 shadow-2xl relative group"
               >
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
                  <div className="w-full h-full bg-background/60 rounded-2xl overflow-hidden border border-border/10 flex flex-col backdrop-blur-sm">
                     <div className="h-10 border-b border-border/10 bg-surface-container/30 flex items-center px-4 gap-1.5">
                        <div className="size-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                        <div className="size-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
                        <div className="size-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                     </div>
                     <div className="flex-1 p-8 flex items-center justify-center">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full opacity-40">
                           {[1, 2, 3, 4].map(i => (
                              <div key={i} className="h-24 rounded-xl bg-surface-container-high/40 border border-border/5" />
                           ))}
                           <div className="col-span-full h-48 rounded-xl bg-surface-container-high/40 border border-border/5" />
                        </div>
                     </div>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-indigo-500/20 rounded-3xl blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               </motion.div>
            </section>

            {/* Tech Stack Section */}
            <section id="infrastructure" className="py-24 border-y border-border/10 bg-surface-container-lowest/10 relative">
               <div className="max-w-7xl mx-auto px-6">
                  <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 mb-16">
                     Engineered with the best stack
                  </p>
                  <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
                     {TECH_STACK.map((tech) => (
                        <div key={tech.name} className="flex flex-col items-center gap-3 group cursor-default">
                           <div className="size-14 rounded-2xl bg-surface-container-high/20 border border-border/5 flex items-center justify-center group-hover:scale-110 group-hover:border-primary/40 group-hover:text-primary group-hover:bg-primary/5 transition-all duration-500 shadow-sm">
                              <tech.icon className="size-6 opacity-60 group-hover:opacity-100 transition-opacity" />
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 group-hover:text-foreground transition-colors">{tech.name}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {FEATURES.map((feature, idx) => (
                     <motion.div 
                        key={idx}
                        whileHover={{ y: -8 }}
                        className="group p-10 rounded-[2.5rem] bg-surface-container-low/10 border border-border/10 hover:border-primary/30 hover:bg-surface-container-low/20 transition-all duration-500 flex flex-col gap-8 relative overflow-hidden"
                     >
                        <div className={`size-14 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center shadow-inner`}>
                           <feature.icon className="size-7" />
                        </div>
                        <div className="space-y-4">
                           <h3 className="text-2xl font-black text-foreground tracking-tight">{feature.title}</h3>
                           <p className="text-muted-foreground leading-relaxed text-md">
                              {feature.description}
                           </p>
                        </div>
                        <div className="mt-auto pt-4 flex items-center text-xs font-black uppercase tracking-wider text-primary gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                           Explore module 
                           <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                           <feature.icon className="size-24" />
                        </div>
                     </motion.div>
                  ))}
               </div>
            </section>

            {/* Global Reach Section */}
            <section className="py-32 px-6 overflow-hidden relative">
               <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
                  <div className="flex-1 space-y-10 text-center lg:text-left">
                     <div className="space-y-4">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tight text-foreground leading-tight">
                           Global speed, <br />
                           <span className="text-primary">Edge safety.</span>
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-md mx-auto lg:mx-0 font-medium">
                           Our infrastructure is distributed across the globe, ensuring sub-millisecond latency for every user.
                        </p>
                     </div>
                     <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-4 justify-center lg:justify-start text-sm text-foreground font-bold">
                           <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
                           99.99% Guaranteed Uptime
                        </div>
                        <div className="flex items-center gap-4 justify-center lg:justify-start text-sm text-foreground font-bold">
                           <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
                           Multi-Region Data Residency
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex-1 w-full max-w-2xl aspect-[4/3] relative">
                     <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full scale-75" />
                     <DottedMap 
                        className="w-full h-full opacity-30 hover:opacity-100 transition-opacity duration-1000" 
                        dotColor="var(--color-primary)"
                        markerColor="var(--color-primary)"
                        markers={[
                           { lat: 40.7128, lng: -74.0060, size: 1.2, pulse: true }, // NY
                           { lat: 51.5074, lng: -0.1278, size: 1.2, pulse: true },  // London
                           { lat: 35.6762, lng: 139.6503, size: 1.2, pulse: true }, // Tokyo
                           { lat: 1.3521, lng: 103.8198, size: 1.2, pulse: true },  // Singapore
                        ]}
                        dotRadius={0.12}
                        mapSamples={8000}
                     />
                  </div>
               </div>
            </section>

            {/* CTA Section */}
            <section className="py-40 px-6">
               <div className="max-w-6xl mx-auto rounded-[4rem] bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-px">
                  <div className="bg-surface-container-lowest/40 backdrop-blur-2xl rounded-[3.9rem] py-24 px-8 flex flex-col items-center text-center space-y-12">
                     <h2 className="text-5xl md:text-7xl font-black text-foreground tracking-tight leading-tight">
                        Start building the <br /> future of identity.
                     </h2>
                     <div className="flex flex-col sm:flex-row gap-5">
                        <Button size="lg" className="h-16 px-14 text-md font-black uppercase tracking-wider rounded-full shadow-2xl shadow-primary/40" asChild>
                           <Link to="/signup">Get Started Free</Link>
                        </Button>
                        <Button variant="outline" size="lg" className="h-16 px-14 text-md font-bold rounded-full border-border bg-surface-container-lowest/50 hover:bg-surface-container-low transition-all" asChild>
                           <Link to="/signin">Book a demo</Link>
                        </Button>
                     </div>
                  </div>
               </div>
            </section>
         </main>

         {/* Footer */}
         <footer className="w-full py-20 px-8 border-t border-border/10 bg-background relative z-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
               <div className="col-span-1 md:col-span-2 space-y-8">
                  <div className="flex items-center gap-3">
                     <Shield className="text-primary size-8" />
                     <span className="text-2xl font-black tracking-tighter text-foreground">Identity</span>
                  </div>
                  <p className="text-muted-foreground text-md max-w-sm leading-relaxed font-medium">
                     Enterprise-grade identity infrastructure for modern web applications. 
                     Secure, scalable, and developer-first.
                  </p>
               </div>
               
               <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">Platform</h4>
                  <ul className="space-y-4">
                     <li><a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</a></li>
                     <li><a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Infrastructure</a></li>
                     <li><a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Security</a></li>
                     <li><a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">API Docs</a></li>
                  </ul>
               </div>

               <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">Company</h4>
                  <ul className="space-y-4">
                     <li><a href="https://github.com/maulik-mk" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">GitHub</a></li>
                     <li><a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Support</a></li>
                     <li><a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Privacy</a></li>
                     <li><a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Terms</a></li>
                  </ul>
               </div>
            </div>

            <div className="max-w-7xl mx-auto pt-10 border-t border-border/10 flex flex-col md:flex-row justify-between items-center gap-8">
               <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  © 2026 Identity Engine. Precision Built.
               </p>
               <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Developed by</span>
                  <a href="https://github.com/maulik-mk" target="_blank" rel="noopener noreferrer" className="font-black text-foreground hover:text-primary transition-all text-[11px] uppercase tracking-widest">maulik-mk</a>
               </div>
            </div>
         </footer>
      </div>
   );
}

export default Home;
;
