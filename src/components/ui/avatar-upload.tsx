import React, { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import type { Point, Area } from 'react-easy-crop';
import { Camera, Loader2, X, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from './button';
import { toast } from 'sonner';
import { uploadAvatar } from '@/lib/api';
import { getAvatarUrl } from '@/lib/utils';

interface AvatarUploadProps {
   currentAvatarId?: string | null;
   onSuccess?: (newAvatarId: string) => void;
   size?: number;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ 
   currentAvatarId, 
   onSuccess,
   size = 120 
}) => {
   const [image, setImage] = useState<string | null>(null);
   const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
   const [zoom, setZoom] = useState(1);
   const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
   const [isUploading, setIsUploading] = useState(false);
   const fileInputRef = useRef<HTMLInputElement>(null);

   const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
   }, []);

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
         const file = e.target.files[0];
         
         if (file.size > 5 * 1024 * 1024) {
            toast.error('File is too large. Maximum size is 5MB.');
            return;
         }

         const reader = new FileReader();
         reader.addEventListener('load', () => setImage(reader.result as string));
         reader.readAsDataURL(file);
      }
   };

   const getCroppedImg = async (): Promise<Blob | null> => {
      if (!image || !croppedAreaPixels) return null;

      const canvas = document.createElement('canvas');
      const img = new Image();
      img.src = image;

      return new Promise((resolve) => {
         img.onload = () => {
            const ctx = canvas.getContext('2d');
            if (!ctx) return resolve(null);

            canvas.width = 400;
            canvas.height = 400;

            ctx.drawImage(
               img,
               croppedAreaPixels.x,
               croppedAreaPixels.y,
               croppedAreaPixels.width,
               croppedAreaPixels.height,
               0,
               0,
               400,
               400
            );

            canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.8);
         };
      });
   };

   const handleUpload = async () => {
      const blob = await getCroppedImg();
      if (!blob) return;

      setIsUploading(true);
      try {
         const res = await uploadAvatar(blob);
         if (res.success) {
            toast.success('Avatar updated successfully');
            setImage(null);
            if (onSuccess) onSuccess(res.avatarId);
         }
      } catch (err: any) {
         toast.error(err?.response?.data?.message || 'Failed to upload avatar');
      } finally {
         setIsUploading(false);
      }
   };

   const avatarSrc = getAvatarUrl(currentAvatarId, { w: size * 1.5, h: size * 1.5, q: 90 });

   return (
      <div className="flex flex-col items-center gap-4">
         <div 
            className="group relative cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            style={{ width: size, height: size }}
         >
            {/* Avatar Circle */}
            <div className="w-full h-full rounded-full border-4 border-border overflow-hidden bg-surface transition-all group-hover:border-primary/50">
               {avatarSrc ? (
                  <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                     <Camera size={size * 0.4} />
                  </div>
               )}
            </div>

            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
               <Camera className="text-white" size={24} />
            </div>
            
            <input 
               type="file" 
               ref={fileInputRef} 
               onChange={handleFileChange} 
               accept="image/*" 
               className="hidden" 
            />
         </div>

         {image && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
               <div className="bg-background border border-border rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-border">
                     <h3 className="text-lg font-semibold text-foreground">Setup your profile photo</h3>
                     <button 
                        onClick={() => setImage(null)}
                        className="p-1 hover:bg-surface rounded-lg text-muted-foreground transition-colors"
                     >
                        <X size={20} />
                     </button>
                  </div>

                  {/* Crop Area */}
                  <div className="relative h-80 bg-surface">
                     <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        cropShape="round"
                        showGrid={false}
                     />
                  </div>

                  {/* Controls */}
                  <div className="p-6 space-y-6">
                     <div className="flex items-center gap-4">
                        <ZoomOut size={18} className="text-muted-foreground" />
                        <input
                           type="range"
                           value={zoom}
                           min={1}
                           max={3}
                           step={0.1}
                           aria-labelledby="Zoom"
                           onChange={(e) => setZoom(Number(e.target.value))}
                           className="flex-1 accent-primary h-1.5 bg-surface-container-high rounded-full cursor-pointer appearance-none"
                        />
                        <ZoomIn size={18} className="text-muted-foreground" />
                     </div>

                     <div className="flex items-center justify-end gap-3">
                        <Button 
                           variant="ghost" 
                           onClick={() => setImage(null)}
                           className="text-muted-foreground hover:text-foreground"
                        >
                           Cancel
                        </Button>
                        <Button 
                           onClick={handleUpload}
                           disabled={isUploading}
                           className="bg-primary hover:bg-primary text-white px-8"
                        >
                           {isUploading ? (
                              <Loader2 className="animate-spin size-4 mr-2" />
                           ) : null}
                           Set new profile picture
                        </Button>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};
