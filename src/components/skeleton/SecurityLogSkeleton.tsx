export const SecurityLogSkeleton = () => (
   <div className="bg-surface/40 border border-border border-l-[3px] border-l-border/50 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-4 animate-pulse">
      <div className="p-2.5 rounded-lg shrink-0 w-10 h-10 bg-surface-container-high hidden sm:block" />

      <div className="flex-1 space-y-4">
         <div className="flex justify-between items-start">
            <div className="space-y-2 w-full">
               <div className="h-4 bg-surface-container-high rounded w-1/4" />
               <div className="flex gap-2">
                  <div className="h-5 bg-surface-container rounded w-20" />
                  <div className="h-5 bg-surface-container rounded w-24" />
               </div>
            </div>
            <div className="h-3 bg-surface-container-high rounded w-16 hidden sm:block" />
         </div>
      </div>
   </div>
);
