import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import { ImagePlus, X } from 'lucide-react';

interface ImageUploaderProps {
  imageUrl: string | null;
  onImageChange: (url: string | null) => void;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'wide';
  className?: string;
  placeholder?: string;
  showRemove?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageUrl,
  onImageChange,
  aspectRatio = 'landscape',
  className,
  placeholder = 'Clique para adicionar imagem',
  showRemove = true
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageChange(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const aspectRatioClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    wide: 'aspect-[16/9]'
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative cursor-pointer overflow-hidden transition-all group",
        aspectRatioClasses[aspectRatio],
        imageUrl ? "bg-cover bg-center" : "bg-muted/50 border-2 border-dashed border-border hover:border-burgundy/50 hover:bg-muted/70",
        className
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
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-2 p-4">
          <ImagePlus className="w-8 h-8 opacity-50 group-hover:opacity-80 transition-opacity" />
          <span className="text-xs text-center font-sans opacity-70 group-hover:opacity-100 transition-opacity">
            {placeholder}
          </span>
        </div>
      )}

      {imageUrl && showRemove && (
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {imageUrl && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <span className="text-white text-xs font-sans opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-3 py-1 rounded-full">
            Alterar imagem
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
