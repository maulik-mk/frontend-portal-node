import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
   return (
      <input
         type={type}
         data-slot="input"
         className={cn(
            'h-11 w-full min-w-0 rounded-xl border border-border bg-background px-4 py-2 text-base shadow-sm transition-all outline-none placeholder:text-muted-foreground/50 disabled:opacity-50 focus:border-primary focus:ring-4 focus:ring-primary/10 md:text-sm dark:bg-surface-container/50 dark:border-border/60 dark:hover:border-border',
            className,
         )}
         {...props}
      />
   );
}

export { Input };
