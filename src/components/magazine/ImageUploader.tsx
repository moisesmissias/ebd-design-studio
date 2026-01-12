import React, { useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  imageUrl: string | null;
  onImageChange: (url: string | null) => void;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'wide' | 'auto';
  className?: string;
  placeholder?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageUrl,
  onImageChange,
  aspectRatio = 'auto',
  className,
  placeholder = 'Adicionar imagem'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange(null);
  };

  const aspectClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    wide: 'aspect-[16/9]',
    auto: '' // No aspect ratio - fills container
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'relative cursor-pointer overflow-hidden bg-muted/50 border-2 border-dashed border-muted-foreground/30 hover:border-gold/50 transition-all group',
        aspectRatio !== 'auto' && aspectClasses[aspectRatio],
        aspectRatio === 'auto' && 'h-full w-full',
        className
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt="Uploaded"
            className="w-full h-full object-cover"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
              Trocar imagem
            </span>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/60 group-hover:text-gold/70 transition-colors p-2">
          <ImagePlus className="w-8 h-8 mb-2 flex-shrink-0" />
          <span className="text-[10px] uppercase tracking-wider text-center leading-tight">
            {placeholder}
          </span>
        </div>
      )}
    </div>
  );
};
// Mini version for inline use
export const MiniImageUploader: React.FC<{
  imageUrl: string | null;
  onImageChange: (url: string | null) => void;
  size?: 'sm' | 'md' | 'lg';
}> = ({ imageUrl, onImageChange, size = 'md' }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => inputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => onImageChange(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "rounded-full cursor-pointer overflow-hidden bg-cover bg-center border-2 transition-all group",
        sizeClasses[size],
        imageUrl 
          ? "border-gold hover:border-burgundy" 
          : "border-dashed border-muted-foreground/30 hover:border-burgundy bg-muted/30"
      )}
      style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {!imageUrl && (
        <div className="w-full h-full flex items-center justify-center">
          <ImagePlus className="w-4 h-4 text-muted-foreground/50" />
        </div>
      )}
    </div>
  );
};
