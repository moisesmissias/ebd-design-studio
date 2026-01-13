import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Plus, X, ImagePlus, GripVertical, Maximize2, Minimize2, Move } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { PageImage, ElementSize } from '@/types/magazine';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Sortable Adaptive Image with resize capability
interface SortableAdaptiveImageProps {
  image: PageImage;
  onImageChange: (url: string | null) => void;
  onSizeChange: (size: ElementSize) => void;
  onHeightChange: (height: number) => void;
  onRemove: () => void;
  fillMode?: 'contain' | 'cover' | 'fill';
  minHeight?: number;
}

const SortableAdaptiveImage: React.FC<SortableAdaptiveImageProps> = ({
  image,
  onImageChange,
  onSizeChange,
  onHeightChange,
  onRemove,
  fillMode = 'cover',
  minHeight = 80,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.8 : 1,
  };

  const handleClick = () => {
    if (!image.url && !isDragging && !isResizing) {
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

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const startY = e.clientY;
    const startHeight = elementRef.current?.clientHeight || 150;
    setIsResizing(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const newHeight = Math.max(minHeight, startHeight + deltaY);
      onHeightChange(newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [minHeight, onHeightChange]);

  const isFillSize = image.size === 'full' || image.size === 'fill';
  const currentHeight = image.height ? `${image.height}px` : isFillSize ? undefined : `${minHeight}px`;

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        (elementRef as any).current = node;
      }}
      onClick={handleClick}
      style={{
        ...style,
        height: currentHeight,
        minHeight: `${minHeight}px`,
      }}
      className={cn(
        "relative group cursor-pointer overflow-hidden bg-muted/20 border-2 border-dashed border-muted-foreground/15 hover:border-gold/40 transition-all rounded-sm",
        isFillSize && "flex-1",
        isDragging && "shadow-xl ring-2 ring-gold/50",
        isResizing && "ring-2 ring-blue-500/50"
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-0 left-0 w-8 h-8 cursor-grab active:cursor-grabbing z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-burgundy/90 rounded-br-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="w-4 h-4 text-white" />
      </div>

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
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors pointer-events-none">
            <div className="absolute top-0 right-0 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <button className="w-7 h-7 bg-white/90 hover:bg-white text-foreground flex items-center justify-center shadow-md">
                    <Move className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuItem onClick={() => onSizeChange('sm')}>
                    <Minimize2 className="w-4 h-4 mr-2" /> Pequena
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSizeChange('md')}>
                    <Move className="w-4 h-4 mr-2" /> Média
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSizeChange('lg')}>
                    <Maximize2 className="w-4 h-4 mr-2" /> Grande
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSizeChange('full')}>
                    <Maximize2 className="w-4 h-4 mr-2" /> Preencher
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="w-7 h-7 bg-white/90 hover:bg-white text-foreground flex items-center justify-center shadow-md"
              >
                <ImagePlus className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="w-7 h-7 bg-destructive text-destructive-foreground flex items-center justify-center shadow-md"
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

      {/* Resize handle */}
      <div
        onMouseDown={handleResizeStart}
        className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize opacity-0 group-hover:opacity-100 bg-gradient-to-t from-gold/40 to-transparent hover:from-gold/60 transition-opacity flex items-end justify-center pb-0.5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1 bg-gold/60 rounded-full" />
      </div>
    </div>
  );
};

// Non-sortable Adaptive Image (for backwards compatibility)
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

// Adaptive Sidebar with drag-and-drop
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
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      onImagesChange(arrayMove(images, oldIndex, newIndex));
    }
  };

  const handleAddImage = () => {
    if (images.length >= maxImages) return;
    
    const newImage: PageImage = {
      id: `${pageId}-sidebar-${Date.now()}`,
      url: null,
      caption: 'Imagem lateral',
      size: 'full',
      position: 'sidebar'
    };
    onImagesChange([...images, newImage]);
  };

  const handleImageChange = (imageId: string, url: string | null) => {
    onImagesChange(images.map(img => 
      img.id === imageId ? { ...img, url } : img
    ));
  };

  const handleSizeChange = (imageId: string, size: ElementSize) => {
    onImagesChange(images.map(img => 
      img.id === imageId ? { ...img, size, height: undefined } : img
    ));
  };

  const handleHeightChange = (imageId: string, height: number) => {
    onImagesChange(images.map(img => 
      img.id === imageId ? { ...img, height } : img
    ));
  };

  const handleRemoveImage = (imageId: string) => {
    onImagesChange(images.filter(img => img.id !== imageId));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
            <SortableContext items={images.map(img => img.id)} strategy={verticalListSortingStrategy}>
              <div className="flex-1 flex flex-col gap-2">
                {images.map((image) => (
                  <SortableAdaptiveImage
                    key={image.id}
                    image={image}
                    onImageChange={(url) => handleImageChange(image.id, url)}
                    onSizeChange={(size) => handleSizeChange(image.id, size)}
                    onHeightChange={(height) => handleHeightChange(image.id, height)}
                    onRemove={() => handleRemoveImage(image.id)}
                    minHeight={80}
                  />
                ))}
              </div>
            </SortableContext>
            
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
    </DndContext>
  );
};

// Adaptive Grid with drag-and-drop
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
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      onImagesChange(arrayMove(images, oldIndex, newIndex));
    }
  };

  const handleAddImage = () => {
    if (images.length >= maxImages) return;
    
    const newImage: PageImage = {
      id: `${pageId}-grid-${Date.now()}`,
      url: null,
      caption: 'Imagem',
      size: 'md',
      position: 'inline'
    };
    onImagesChange([...images, newImage]);
  };

  const handleImageChange = (imageId: string, url: string | null) => {
    onImagesChange(images.map(img => 
      img.id === imageId ? { ...img, url } : img
    ));
  };

  const handleSizeChange = (imageId: string, size: ElementSize) => {
    onImagesChange(images.map(img => 
      img.id === imageId ? { ...img, size, height: undefined } : img
    ));
  };

  const handleHeightChange = (imageId: string, height: number) => {
    onImagesChange(images.map(img => 
      img.id === imageId ? { ...img, height } : img
    ));
  };

  const handleRemoveImage = (imageId: string) => {
    onImagesChange(images.filter(img => img.id !== imageId));
  };

  const getGridTemplate = () => {
    if (images.length === 1) return 'grid-cols-1';
    if (images.length === 2) return 'grid-cols-2';
    if (images.length === 3) return 'grid-cols-3';
    return `grid-cols-${columns}`;
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div 
        className={cn("grid flex-1", getGridTemplate(), className)}
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
          <SortableContext items={images.map(img => img.id)} strategy={verticalListSortingStrategy}>
            {images.map((image) => (
              <SortableAdaptiveImage
                key={image.id}
                image={image}
                onImageChange={(url) => handleImageChange(image.id, url)}
                onSizeChange={(size) => handleSizeChange(image.id, size)}
                onHeightChange={(height) => handleHeightChange(image.id, height)}
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
          </SortableContext>
        )}
      </div>
    </DndContext>
  );
};

// Auto-fill page wrapper
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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;
    
    const checkSpace = () => {
      const container = containerRef.current;
      const content = contentRef.current;
      if (!container || !content) return;
      
      const containerHeight = container.clientHeight;
      const contentHeight = content.offsetHeight;
      const remainingSpace = containerHeight - contentHeight - 32;
      
      setShowFiller(remainingSpace > 80);
      setFillerHeight(Math.max(0, remainingSpace));
    };

    checkSpace();
    const observer = new ResizeObserver(checkSpace);
    observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, [children]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      onImagesChange(arrayMove(images, oldIndex, newIndex));
    }
  };

  const handleAddImage = () => {
    const newImage: PageImage = {
      id: `${pageId}-filler-${Date.now()}`,
      url: null,
      caption: 'Preencher espaço',
      size: 'full',
      position: 'inline'
    };
    onImagesChange([...images, newImage]);
  };

  const handleImageChange = (imageId: string, url: string | null) => {
    onImagesChange(images.map(img => 
      img.id === imageId ? { ...img, url } : img
    ));
  };

  const handleSizeChange = (imageId: string, size: ElementSize) => {
    onImagesChange(images.map(img => 
      img.id === imageId ? { ...img, size, height: undefined } : img
    ));
  };

  const handleHeightChange = (imageId: string, height: number) => {
    onImagesChange(images.map(img => 
      img.id === imageId ? { ...img, height } : img
    ));
  };

  const handleRemoveImage = (imageId: string) => {
    onImagesChange(images.filter(img => img.id !== imageId));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div 
        ref={containerRef}
        className={cn("h-full flex flex-col", className)}
      >
        <div ref={contentRef} className="flex-shrink-0">
          {children}
        </div>
        
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
              <SortableContext items={images.map(img => img.id)} strategy={verticalListSortingStrategy}>
                <div className="flex-1 flex flex-col gap-2">
                  {images.map((image) => (
                    <SortableAdaptiveImage
                      key={image.id}
                      image={image}
                      onImageChange={(url) => handleImageChange(image.id, url)}
                      onSizeChange={(size) => handleSizeChange(image.id, size)}
                      onHeightChange={(height) => handleHeightChange(image.id, height)}
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
              </SortableContext>
            )}
          </div>
        )}
      </div>
    </DndContext>
  );
};

// Re-export FlexLayoutContainer for backwards compatibility
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
  return (
    <div className={cn("flex gap-4 h-full", direction === 'column' ? 'flex-col' : 'flex-row', className)}>
      {imagePosition === 'start' && (
        <AdaptiveSidebar
          pageId={pageId}
          images={images}
          onImagesChange={onImagesChange}
          maxImages={maxImages}
          width={minImageHeight}
        />
      )}
      
      <div className="flex-shrink-0">
        {children}
      </div>
      
      {imagePosition === 'end' && (
        <AdaptiveSidebar
          pageId={pageId}
          images={images}
          onImagesChange={onImagesChange}
          maxImages={maxImages}
          width={minImageHeight}
        />
      )}
    </div>
  );
};
