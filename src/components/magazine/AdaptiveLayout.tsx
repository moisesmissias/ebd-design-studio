import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Plus, X, ImagePlus, Move, ZoomIn, ZoomOut, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageImage } from '@/types/magazine';

// Hook para calcular espaço disponível
const useAvailableSpace = (containerRef: React.RefObject<HTMLElement>, contentHeight: number) => {
  const [availableHeight, setAvailableHeight] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateSpace = () => {
      const containerHeight = containerRef.current?.clientHeight || 0;
      const available = Math.max(0, containerHeight - contentHeight);
      setAvailableHeight(available);
    };

    updateSpace();
    const observer = new ResizeObserver(updateSpace);
    observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, [containerRef, contentHeight]);

  return availableHeight;
};

// Componente de imagem adaptativa que preenche espaço
interface AdaptiveImageProps {
  image: PageImage;
  onImageChange: (url: string | null) => void;
  onRemove: () => void;
  fillMode?: 'contain' | 'cover' | 'fill';
  minHeight?: number;
  maxHeight?: number;
  className?: string;
}

export const AdaptiveImage: React.FC<AdaptiveImageProps> = ({
  image,
  onImageChange,
  onRemove,
  fillMode = 'cover',
  minHeight = 80,
  maxHeight,
  className
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!image.url) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onImageChange(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative group cursor-pointer overflow-hidden bg-muted/20 border-2 border-dashed border-muted-foreground/15 hover:border-gold/40 transition-all rounded-sm flex-1",
        className
      )}
      style={{ 
        minHeight: `${minHeight}px`,
        maxHeight: maxHeight ? `${maxHeight}px` : undefined
      }}
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
            className={cn(
              "w-full h-full",
              fillMode === 'cover' && "object-cover",
              fillMode === 'contain' && "object-contain",
              fillMode === 'fill' && "object-fill"
            )}
          />
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors">
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="w-7 h-7 bg-white/90 hover:bg-white text-foreground rounded flex items-center justify-center shadow-md"
              >
                <Move className="w-4 h-4" />
              </button>
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
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/40 group-hover:text-gold/60 transition-colors p-2">
          <ImagePlus className="w-8 h-8 mb-2" />
          <span className="text-[10px] uppercase tracking-wider text-center">
            Clique para adicionar
          </span>
          {image.caption && (
            <span className="text-[9px] text-muted-foreground/30 mt-1">
              {image.caption}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Container de layout flexível que distribui espaço automaticamente
interface FlexLayoutContainerProps {
  children: React.ReactNode;
  images: PageImage[];
  onImagesChange: (images: PageImage[]) => void;
  pageId: string;
  direction?: 'row' | 'column';
  imagePosition?: 'start' | 'end' | 'between' | 'around';
  minImageHeight?: number;
  maxImages?: number;
  className?: string;
}

export const FlexLayoutContainer: React.FC<FlexLayoutContainerProps> = ({
  children,
  images,
  onImagesChange,
  pageId,
  direction = 'column',
  imagePosition = 'end',
  minImageHeight = 100,
  maxImages = 3,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  // Calcula se há espaço vazio disponível
  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;
    
    const checkOverflow = () => {
      const container = containerRef.current;
      const content = contentRef.current;
      if (!container || !content) return;
      
      const containerHeight = container.clientHeight;
      const contentHeight = content.scrollHeight;
      setHasOverflow(contentHeight > containerHeight);
    };

    checkOverflow();
    const observer = new ResizeObserver(checkOverflow);
    observer.observe(containerRef.current);
    observer.observe(contentRef.current);
    
    return () => observer.disconnect();
  }, [children]);

  const handleAddImage = () => {
    if (images.length >= maxImages) return;
    
    const newImage: PageImage = {
      id: `${pageId}-adaptive-${Date.now()}`,
      url: null,
      caption: 'Imagem',
      size: 'fill',
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

  // Calcular a altura ideal para cada imagem baseado no espaço disponível
  const imageCount = Math.max(images.length, 1);
  const imageFlex = images.length === 0 ? 0.4 : 1 / imageCount;

  const renderImages = () => {
    if (images.length === 0) {
      return (
        <div 
          onClick={handleAddImage}
          className="flex-1 min-h-[100px] flex flex-col items-center justify-center cursor-pointer bg-muted/10 border-2 border-dashed border-muted-foreground/15 hover:border-gold/40 transition-all rounded-sm group"
        >
          <Plus className="w-8 h-8 mb-2 text-muted-foreground/30 group-hover:text-gold/50" />
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/30 group-hover:text-gold/50">
            Adicionar imagem
          </span>
        </div>
      );
    }

    return (
      <div className={cn(
        "flex-1 flex gap-2",
        direction === 'column' ? 'flex-col' : 'flex-row'
      )}>
        {images.map((image) => (
          <AdaptiveImage
            key={image.id}
            image={image}
            onImageChange={(url) => handleImageChange(image.id, url)}
            onRemove={() => handleRemoveImage(image.id)}
            minHeight={minImageHeight}
          />
        ))}
        
        {images.length < maxImages && (
          <button
            onClick={handleAddImage}
            className="flex items-center justify-center gap-1 py-2 text-[10px] text-muted-foreground/40 hover:text-gold/60 transition-colors border-2 border-dashed border-transparent hover:border-gold/20 rounded-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Mais</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "flex gap-4 h-full",
        direction === 'column' ? 'flex-col' : 'flex-row',
        className
      )}
    >
      {imagePosition === 'start' && renderImages()}
      
      <div ref={contentRef} className="flex-shrink-0">
        {children}
      </div>
      
      {imagePosition === 'end' && renderImages()}
      
      {imagePosition === 'between' && (
        <>
          <div className="flex-1">{renderImages()}</div>
        </>
      )}
    </div>
  );
};

// Container de coluna lateral adaptável
interface AdaptiveSidebarProps {
  images: PageImage[];
  onImagesChange: (images: PageImage[]) => void;
  pageId: string;
  width?: number;
  maxImages?: number;
  children?: React.ReactNode;
}

export const AdaptiveSidebar: React.FC<AdaptiveSidebarProps> = ({
  images,
  onImagesChange,
  pageId,
  width = 160,
  maxImages = 3,
  children
}) => {
  const handleAddImage = () => {
    if (images.length >= maxImages) return;
    
    const newImage: PageImage = {
      id: `${pageId}-sidebar-${Date.now()}`,
      url: null,
      caption: 'Imagem lateral',
      size: 'fill',
      position: 'sidebar'
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

  return (
    <div 
      className="flex flex-col gap-3 flex-shrink-0 h-full"
      style={{ width: `${width}px` }}
    >
      {images.length === 0 ? (
        <div 
          onClick={handleAddImage}
          className="flex-1 flex flex-col items-center justify-center cursor-pointer bg-muted/10 border-2 border-dashed border-muted-foreground/15 hover:border-gold/40 transition-all rounded-sm group min-h-[150px]"
        >
          <Plus className="w-6 h-6 mb-1 text-muted-foreground/30 group-hover:text-gold/50" />
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground/30 group-hover:text-gold/50">
            Adicionar
          </span>
        </div>
      ) : (
        <>
          <div className="flex-1 flex flex-col gap-2">
            {images.map((image) => (
              <AdaptiveImage
                key={image.id}
                image={image}
                onImageChange={(url) => handleImageChange(image.id, url)}
                onRemove={() => handleRemoveImage(image.id)}
                minHeight={80}
              />
            ))}
          </div>
          
          {images.length < maxImages && (
            <button
              onClick={handleAddImage}
              className="flex items-center justify-center gap-1 py-1.5 text-[9px] text-muted-foreground/40 hover:text-gold/60 transition-colors"
            >
              <Plus className="w-3 h-3" />
              Mais
            </button>
          )}
        </>
      )}
      
      {children}
    </div>
  );
};

// Container de grid adaptável
interface AdaptiveGridProps {
  images: PageImage[];
  onImagesChange: (images: PageImage[]) => void;
  pageId: string;
  columns?: number;
  minImageHeight?: number;
  maxImages?: number;
  gap?: number;
  className?: string;
}

export const AdaptiveGrid: React.FC<AdaptiveGridProps> = ({
  images,
  onImagesChange,
  pageId,
  columns = 2,
  minImageHeight = 100,
  maxImages = 4,
  gap = 8,
  className
}) => {
  const handleAddImage = () => {
    if (images.length >= maxImages) return;
    
    const newImage: PageImage = {
      id: `${pageId}-grid-${Date.now()}`,
      url: null,
      caption: 'Imagem',
      size: 'medium',
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

  // Determinar layout do grid baseado no número de imagens
  const getGridTemplate = () => {
    if (images.length === 1) return 'grid-cols-1';
    if (images.length === 2) return 'grid-cols-2';
    if (images.length === 3) return 'grid-cols-3';
    return `grid-cols-${columns}`;
  };

  return (
    <div 
      className={cn(
        "grid flex-1",
        getGridTemplate(),
        className
      )}
      style={{ gap: `${gap}px` }}
    >
      {images.length === 0 ? (
        <div 
          onClick={handleAddImage}
          className="col-span-full flex-1 flex flex-col items-center justify-center cursor-pointer bg-muted/10 border-2 border-dashed border-muted-foreground/15 hover:border-gold/40 transition-all rounded-sm group min-h-[120px]"
        >
          <Plus className="w-8 h-8 mb-2 text-muted-foreground/30 group-hover:text-gold/50" />
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/30 group-hover:text-gold/50">
            Adicionar imagem
          </span>
        </div>
      ) : (
        <>
          {images.map((image) => (
            <AdaptiveImage
              key={image.id}
              image={image}
              onImageChange={(url) => handleImageChange(image.id, url)}
              onRemove={() => handleRemoveImage(image.id)}
              minHeight={minImageHeight}
            />
          ))}
          
          {images.length < maxImages && (
            <div 
              onClick={handleAddImage}
              className="flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-muted-foreground/15 hover:border-gold/40 transition-all rounded-sm group min-h-[80px]"
            >
              <Plus className="w-5 h-5 text-muted-foreground/30 group-hover:text-gold/50" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Wrapper de página com preenchimento automático de espaço
interface AutoFillPageWrapperProps {
  children: React.ReactNode;
  images: PageImage[];
  onImagesChange: (images: PageImage[]) => void;
  pageId: string;
  fillDirection?: 'bottom' | 'right' | 'both';
  className?: string;
}

export const AutoFillPageWrapper: React.FC<AutoFillPageWrapperProps> = ({
  children,
  images,
  onImagesChange,
  pageId,
  fillDirection = 'bottom',
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showFiller, setShowFiller] = useState(false);
  const [fillerHeight, setFillerHeight] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;
    
    const checkSpace = () => {
      const container = containerRef.current;
      const content = contentRef.current;
      if (!container || !content) return;
      
      const containerHeight = container.clientHeight;
      const contentHeight = content.offsetHeight;
      const remainingSpace = containerHeight - contentHeight - 32; // 32px margin
      
      // Mostrar área de imagem se houver mais de 80px de espaço
      setShowFiller(remainingSpace > 80);
      setFillerHeight(Math.max(0, remainingSpace));
    };

    checkSpace();
    const observer = new ResizeObserver(checkSpace);
    observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, [children]);

  const handleAddImage = () => {
    const newImage: PageImage = {
      id: `${pageId}-filler-${Date.now()}`,
      url: null,
      caption: 'Preencher espaço',
      size: 'fill',
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

  return (
    <div 
      ref={containerRef}
      className={cn("h-full flex flex-col", className)}
    >
      <div ref={contentRef} className="flex-shrink-0">
        {children}
      </div>
      
      {/* Área de preenchimento automático */}
      {(showFiller || images.length > 0) && (
        <div 
          className="flex-1 mt-4 flex flex-col gap-2"
          style={{ minHeight: images.length > 0 ? '100px' : `${Math.min(fillerHeight, 300)}px` }}
        >
          {images.length === 0 ? (
            <div 
              onClick={handleAddImage}
              className="flex-1 flex flex-col items-center justify-center cursor-pointer bg-gradient-to-b from-muted/5 to-muted/20 border-2 border-dashed border-muted-foreground/10 hover:border-gold/30 transition-all rounded-sm group"
            >
              <Plus className="w-8 h-8 mb-2 text-muted-foreground/25 group-hover:text-gold/40" />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/25 group-hover:text-gold/40">
                Preencher espaço vazio
              </span>
            </div>
          ) : (
            <div className="flex-1 flex flex-col gap-2">
              {images.map((image) => (
                <AdaptiveImage
                  key={image.id}
                  image={image}
                  onImageChange={(url) => handleImageChange(image.id, url)}
                  onRemove={() => handleRemoveImage(image.id)}
                  minHeight={80}
                />
              ))}
              
              <button
                onClick={handleAddImage}
                className="flex items-center justify-center gap-1 py-1.5 text-[9px] text-muted-foreground/40 hover:text-gold/60 transition-colors"
              >
                <Plus className="w-3 h-3" />
                Mais imagem
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
