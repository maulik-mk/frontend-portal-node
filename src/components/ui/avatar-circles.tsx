import { cn, getAvatarUrl } from '@/lib/utils';

interface Avatar {
   imageUrl?: string;
   avatarId?: string | null;
   profileUrl?: string;
}
interface AvatarCirclesProps {
   className?: string;
   numPeople?: number;
   avatarUrls: Avatar[];
   size?: number;
}

export const AvatarCircles = ({ numPeople, className, avatarUrls, size = 40 }: AvatarCirclesProps) => {
   return (
      <div className={cn('z-10 flex -space-x-4 rtl:space-x-reverse', className)}>
         {avatarUrls.map((url, index) => {
            const src = getAvatarUrl(url.avatarId, { w: size, h: size, q: 100 }) || url.imageUrl || '';
            return (
               <a key={index} href={url.profileUrl} target="_blank" rel="noopener noreferrer">
                  <img
                     className="rounded-full border-2 border-border object-cover"
                     src={src}
                     style={{ width: size, height: size }}
                     alt={`Avatar ${index + 1}`}
                  />
               </a>
            );
         })}
         {(numPeople ?? 0) > 0 && (
            <a
               className="flex items-center justify-center rounded-full border-2 border-border bg-surface text-center text-xs font-medium text-foreground"
               href=""
               style={{ width: size, height: size }}
            >
               +{numPeople}
            </a>
         )}
      </div>
   );
};
