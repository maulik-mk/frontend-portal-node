export const SessionsSkeleton = () => (
   <div className="flex items-center justify-between p-4 bg-surface/60 animate-pulse border-b border-border last:border-0">
      <div className="flex items-center gap-4">
         <div className="p-3 rounded-lg bg-surface-container-high/50 border border-border w-11 h-11" />

         <div className="flex flex-col space-y-2.5">
            <div className="h-4 bg-surface-container-high rounded w-48" />
            
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-surface-container-high" />
               <div className="h-3 bg-surface-container rounded w-32" />
               <div className="w-1.5 h-1.5 rounded-full bg-surface-container-high opacity-50" />
               <div className="h-3 bg-surface-container rounded w-24" />
            </div>
         </div>
      </div>

      <div className="h-9 w-20 bg-surface-container rounded-md border border-border" />
   </div>
);
