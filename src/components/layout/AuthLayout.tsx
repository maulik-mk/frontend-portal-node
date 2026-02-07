import { AnimatedGridPattern } from '@/components/index';
import { cn } from '@/lib/utils';

interface AuthLayoutProps {
   children: React.ReactNode;
   title?: string;
   description?: string;
   visualTitle?: React.ReactNode;
}

export function AuthLayout({ children, title, description, visualTitle }: AuthLayoutProps) {
   return (
      <div className="flex min-h-screen w-full bg-background">
         <div className="relative hidden lg:w-[60%] items-center justify-center overflow-hidden border-r border-white/5 lg:flex">
            <AnimatedGridPattern
               width={70}
               height={70}
               numSquares={30}
               maxOpacity={0.1}
               duration={3}
               repeatDelay={1}
               className={cn(
                  '[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]',
                  'inset-x-0 inset-y-[-40%] h-[200%] skew-y-12',
                  'text-primary fill-primary/10 stroke-primary/10',
               )}
            />
            {visualTitle && <div className="relative z-10 text-center">{visualTitle}</div>}
         </div>

         <div className="flex lg:w-[40%] flex-1 flex-col items-center justify-center bg-background p-8 lg:p-12">
            <div className="w-full max-w-sm space-y-8">
               {(title || description) && (
                  <div className="text-center lg:text-left">
                     {title && (
                        <h2 className="text-4xl font-bold tracking-tight text-foreground">{title}</h2>
                     )}
                     {description && <p className="mt-4 text-lg text-muted-foreground">{description}</p>}
                  </div>
               )}

               <div className="mt-8">{children}</div>
            </div>
         </div>
      </div>
   );
}
