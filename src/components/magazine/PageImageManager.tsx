import React, { useRef, useState } from 'react';
import { Plus, X, Maximize2, Minimize2, Move, ImagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageImage } from '@/types/magazine';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ImageSlotProps {
  image: PageImage;
  onImageChange: (url: string | null) => void;
  onSizeChange: (size: PageImage['size']) => void;
  onRemove: () => void;
  fillSpace?: boolean;
}

export const ImageSlot: React.FC<ImageSlotProps> = ({
  image,
  onImageChange,
  onSizeChange,
  onRemove,
  fillSpace = false
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

  const sizeClasses = {
    small: 'h-24',
    medium: 'h-40',
    large: 'h-56',
    fill: 'flex-1 min-h-[120px]'
  };

  const aspectClasses = {
    small: 'aspect-[4/3]',
    medium: 'aspect-[3/2]',
    large: 'aspect-[16/10]',
    fill: ''
  };

  return (
    <div 
      className={cn(
        "relative group cursor-pointer overflow-hidden bg-muted/30 border-2 border-dashed border-muted-foreground/20 hover:border-gold/50 transition-all rounded-sm",
        fillSpace ? 'flex-1 min-h-[100px]' : sizeClasses[image.size],
        !fillSpace && image.size !== 'fill' && aspectClasses[image.size]
      )}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {image.url ? (
        <>
          <img
            src={image.url}
            alt={image.caption || "Imagem"}
            className="w-full h-full object-cover"
          />
          
          {/* Controls overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors">
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <button className="w-7 h-7 bg-white/90 hover:bg-white text-foreground rounded flex items-center justify-center shadow-md">
                    <Move className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuItem onClick={() => onSizeChange('small')}>
                    <Minimize2 className="w-4 h-4 mr-2" /> Pequena
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSizeChange('medium')}>
                    <Move className="w-4 h-4 mr-2" /> Média
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSizeChange('large')}>
                    <Maximize2 className="w-4 h-4 mr-2" /> Grande
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSizeChange('fill')}>
                    <Maximize2 className="w-4 h-4 mr-2" /> Preencher espaço
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="w-7 h-7 bg-destructive text-destructive-foreground rounded flex items-center justify-center shadow-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <span className="text-white text-xs font-medium bg-black/50 px-3 py-1.5 rounded">
                Trocar imagem
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50 group-hover:text-gold/70 transition-colors p-4">
          <ImagePlus className="w-8 h-8 mb-2 flex-shrink-0" />
          <span className="text-[10px] uppercase tracking-wider text-center">
            Clique para adicionar
          </span>
          {image.caption && (
            <span className="text-[9px] text-muted-foreground/40 mt-1">
              {image.caption}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

interface AddImageButtonProps {
  onAdd: (size: PageImage['size']) => void;
  compact?: boolean;
}

export const AddImageButton: React.FC<AddImageButtonProps> = ({ onAdd, compact = false }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={compact ? "sm" : "default"}
          className={cn(
            "border-dashed border-muted-foreground/30 hover:border-gold hover:bg-gold/5",
            compact ? "h-8 px-2" : "gap-2"
          )}
        >
          <Plus className={cn(compact ? "w-3 h-3" : "w-4 h-4")} />
          {!compact && <span className="text-xs">Adicionar Imagem</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onAdd('small')}>
          <Minimize2 className="w-4 h-4 mr-2" /> Imagem pequena
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd('medium')}>
          <Move className="w-4 h-4 mr-2" /> Imagem média
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd('large')}>
          <Maximize2 className="w-4 h-4 mr-2" /> Imagem grande
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd('fill')}>
          <Maximize2 className="w-4 h-4 mr-2" /> Preencher espaço
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface PageImageManagerProps {
  pageId: string;
  images: PageImage[];
  onImagesChange: (images: PageImage[]) => void;
  layout?: 'column' | 'row' | 'grid' | 'sidebar';
  showAddButton?: boolean;
  fillRemainingSpace?: boolean;
}

export const PageImageManager: React.FC<PageImageManagerProps> = ({
  pageId,
  images,
  onImagesChange,
  layout = 'column',
  showAddButton = true,
  fillRemainingSpace = true
}) => {
  const handleAddImage = (size: PageImage['size']) => {
    const newImage: PageImage = {
      id: `${pageId}-img-${Date.now()}`,
      url: null,
      caption: 'Nova imagem',
      size,
      position: 'inline'
    };
    onImagesChange([...images, newImage]);
  };

  const handleImageChange = (imageId: string, url: string | null) => {
    onImagesChange(images.map(img => 
      img.id === imageId ? { ...img, url } : img
    ));
  };

  const handleSizeChange = (imageId: string, size: PageImage['size']) => {
    onImagesChange(images.map(img => 
      img.id === imageId ? { ...img, size } : img
    ));
  };

  const handleRemoveImage = (imageId: string) => {
    onImagesChange(images.filter(img => img.id !== imageId));
  };

  const layoutClasses = {
    column: 'flex flex-col gap-3',
    row: 'flex flex-row gap-3 flex-wrap',
    grid: 'grid grid-cols-2 gap-3',
    sidebar: 'flex flex-col gap-3'
  };

  // Determine if remaining space should be filled
  const shouldFillSpace = fillRemainingSpace && images.length > 0;
  const lastImageIndex = images.length - 1;

  return (
    <div className={cn(layoutClasses[layout], fillRemainingSpace && 'flex-1')}>
      {images.map((image, index) => (
        <ImageSlot
          key={image.id}
          image={image}
          onImageChange={(url) => handleImageChange(image.id, url)}
          onSizeChange={(size) => handleSizeChange(image.id, size)}
          onRemove={() => handleRemoveImage(image.id)}
          fillSpace={shouldFillSpace && index === lastImageIndex && image.size === 'fill'}
        />
      ))}
      
      {showAddButton && (
        <div className={cn(
          "flex items-center justify-center",
          images.length === 0 ? "flex-1 min-h-[100px]" : ""
        )}>
          <AddImageButton onAdd={handleAddImage} compact={images.length > 0} />
        </div>
      )}
    </div>
  );
};

// Simple inline image component for use within text flows
interface InlineImageSlotProps {
  imageUrl: string | null;
  onImageChange: (url: string | null) => void;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'wide';
  className?: string;
  placeholder?: string;
}

export const InlineImageSlot: React.FC<InlineImageSlotProps> = ({
  imageUrl,
  onImageChange,
  aspectRatio = 'landscape',
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
    wide: 'aspect-[16/9]'
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'relative cursor-pointer overflow-hidden bg-muted/30 border-2 border-dashed border-muted-foreground/20 hover:border-gold/50 transition-all group rounded-sm',
        aspectClasses[aspectRatio],
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
              Trocar
            </span>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50 group-hover:text-gold/70 transition-colors p-2">
          <ImagePlus className="w-6 h-6 mb-1 flex-shrink-0" />
          <span className="text-[9px] uppercase tracking-wider text-center leading-tight">
            {placeholder}
          </span>
        </div>
      )}
    </div>
  );
};

// Flexible image container that fills remaining space
interface FlexibleImageContainerProps {
  images: PageImage[];
  onImagesChange: (images: PageImage[]) => void;
  pageId: string;
  minHeight?: string;
  maxImages?: number;
}

export const FlexibleImageContainer: React.FC<FlexibleImageContainerProps> = ({
  images,
  onImagesChange,
  pageId,
  minHeight = '120px',
  maxImages = 3
}) => {
  const handleAddImage = () => {
    if (images.length >= maxImages) return;
    
    const newImage: PageImage = {
      id: `${pageId}-flex-${Date.now()}`,
      url: null,
      caption: 'Imagem',
      size: images.length === 0 ? 'fill' : 'medium',
      position: 'inline'
    };
    onImagesChange([...images, newImage]);
  };

  const handleImageChange = (imageId: string, url: string | null) => {
    onImagesChange(images.map(img => 
      img.id === imageId ? { ...img, url } : img
    ));
  };

  const handleRemoveImage = (imageId: string) => {
    onImagesChange(images.filter(img => img.id !== imageId));
  };

  // If no images and we want to fill space, show one placeholder
  const showPlaceholder = images.length === 0;

  // Determine grid layout based on number of images
  const getGridClass = () => {
    if (images.length === 1) return 'grid-cols-1';
    if (images.length === 2) return 'grid-cols-2';
    return 'grid-cols-2';
  };

  return (
    <div 
      className="flex-1 flex flex-col gap-2" 
      style={{ minHeight }}
    >
      {showPlaceholder ? (
        <div 
          onClick={handleAddImage}
          className="flex-1 flex flex-col items-center justify-center cursor-pointer bg-muted/20 border-2 border-dashed border-muted-foreground/20 hover:border-gold/50 transition-all rounded-sm group"
        >
          <Plus className="w-8 h-8 mb-2 text-muted-foreground/40 group-hover:text-gold/60" />
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/40 group-hover:text-gold/60">
            Adicionar imagem
          </span>
        </div>
      ) : (
        <>
          <div className={cn("grid gap-2 flex-1", getGridClass())}>
            {images.map((image) => (
              <div key={image.id} className="relative group min-h-[80px]">
                {image.url ? (
                  <>
                    <img
                      src={image.url}
                      alt={image.caption || "Imagem"}
                      className="w-full h-full object-cover rounded-sm"
                    />
                    <button
                      onClick={() => handleRemoveImage(image.id)}
                      className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <div 
                    onClick={() => document.getElementById(`file-${image.id}`)?.click()}
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer bg-muted/30 border border-dashed border-muted-foreground/20 hover:border-gold/50 rounded-sm"
                  >
                    <input
                      id={`file-${image.id}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => handleImageChange(image.id, reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                    <ImagePlus className="w-5 h-5 text-muted-foreground/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {images.length < maxImages && (
            <button
              onClick={handleAddImage}
              className="flex items-center justify-center gap-1 py-1 text-[10px] text-muted-foreground/50 hover:text-gold/70 transition-colors"
            >
              <Plus className="w-3 h-3" />
              Mais imagem
            </button>
          )}
        </>
      )}
    </div>
  );
};
