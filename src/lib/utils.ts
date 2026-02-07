import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

interface AvatarOptions {
   w?: number;
   h?: number;
   q?: number;
   f?: 'auto' | 'webp' | 'jpeg' | 'avif' | 'png';
   full?: boolean;
   dpr?: number;
}

export function getAvatarUrl(avatarId?: string | null, options: AvatarOptions = {}) {
   if (!avatarId) return undefined;

   const baseUrl = `${import.meta.env.VITE_AVATAR_CDN_URL}/${avatarId}`;
   
   let dpr = options.dpr;
   if (!dpr && typeof window !== 'undefined') {
      dpr = window.devicePixelRatio > 1 ? 2 : 1;
   }

   const params = new URLSearchParams();

   if (options.w) {
      const width = dpr ? Math.round(options.w * dpr) : options.w;
      params.set('w', width.toString());
   }
   if (options.h) {
      const height = dpr ? Math.round(options.h * dpr) : options.h;
      params.set('h', height.toString());
   }
   
   if (options.q) params.set('q', options.q.toString());
   if (options.f) params.set('f', options.f || 'auto');
   if (options.full) params.set('full', 'true');
   if (dpr && dpr > 1) params.set('dpr', dpr.toString());

   const queryString = params.toString();
   return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
