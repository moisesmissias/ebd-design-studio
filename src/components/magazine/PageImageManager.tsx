import React, { useRef, useState, useCallback } from 'react';
import { Plus, X, Maximize2, Minimize2, Move, ImagePlus, GripVertical } from 'lucide-react';
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
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { PageImage, ElementSize } from '@/types/magazine';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Sortable Image Slot with drag-and-drop and resize
interface SortableImageSlotProps {
  image: PageImage;
  onImageChange: (url: string | null) => void;
  onSizeChange: (size: ElementSize) => void;
  onHeightChange: (height: number) => void;
  onRemove: () => void;
}

const SortableImageSlot: React.FC<SortableImageSlotProps> = ({
  image,
  onImageChange,
  onSizeChange,
  onHeightChange,
  onRemove,
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
  const [resizeStartY, setResizeStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.8 : 1,
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging && !isResizing) {
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

  // Resize handler
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const currentHeight = elementRef.current?.clientHeight || 150;
    setResizeStartY(e.clientY);
    setStartHeight(currentHeight);
    setIsResizing(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - e.clientY;
      const newHeight = Math.max(80, startHeight + deltaY);
      onHeightChange(newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [startHeight, onHeightChange]);

  const sizeHeights: Record<ElementSize, string> = {
    xs: '60px',
    sm: '100px',
    small: '100px',
    md: '150px',
    medium: '150px',
    lg: '200px',
    large: '200px',
    xl: '280px',
    full: '100%',
    fill: '100%',
  };

  const currentHeight = image.height 
    ? `${image.height}px` 
    : sizeHeights[image.size] || '150px';

  const isFillSize = image.size === 'full' || image.size === 'fill';

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        (elementRef as any).current = node;
      }}
      style={{
        ...style,
        height: isFillSize ? undefined : currentHeight,
        minHeight: '80px',
      }}
      className={cn(
        "relative group cursor-pointer overflow-hidden bg-muted/30 border-2 border-dashed border-muted-foreground/20 hover:border-gold/50 transition-all rounded-sm",
        isDragging && "shadow-xl ring-2 ring-gold/50",
        isResizing && "ring-2 ring-blue-500/50",
        isFillSize && "flex-1"
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

      {/* Image content */}
      <div className="w-full h-full" onClick={handleClick}>
        {image.url ? (
          <>
            <img
              src={image.url}
              alt={image.caption || "Imagem"}
              className="w-full h-full object-cover"
            />
            
            {/* Controls overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors pointer-events-none">
              <div className="absolute top-0 right-0 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <button className="w-7 h-7 bg-white/90 hover:bg-white text-foreground flex items-center justify-center shadow-md">
                      <Move className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem onClick={() => onSizeChange('sm')}>
                      <Minimize2 className="w-4 h-4 mr-2" /> Pequena (100px)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSizeChange('md')}>
                      <Move className="w-4 h-4 mr-2" /> Média (150px)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSizeChange('lg')}>
                      <Maximize2 className="w-4 h-4 mr-2" /> Grande (200px)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSizeChange('xl')}>
                      <Maximize2 className="w-4 h-4 mr-2" /> Extra Grande (280px)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSizeChange('full')}>
                      <Maximize2 className="w-4 h-4 mr-2" /> Preencher espaço
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
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
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-medium bg-black/50 px-3 py-1.5 rounded pointer-events-none">
                  Clique para trocar • Arraste para mover
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

      {/* Resize handle (bottom) */}
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

// Main Page Image Manager with drag-and-drop
interface PageImageManagerProps {
  pageId: string;
  images: PageImage[];
  onImagesChange: (images: PageImage[]) => void;
  layout?: 'column' | 'row' | 'grid';
  showAddButton?: boolean;
  maxImages?: number;
  className?: string;
}

export const PageImageManager: React.FC<PageImageManagerProps> = ({
  pageId,
  images,
  onImagesChange,
  layout = 'column',
  showAddButton = true,
  maxImages = 5,
  className,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      onImagesChange(arrayMove(images, oldIndex, newIndex));
    }
  };

  const handleAddImage = (size: ElementSize = 'md') => {
    if (images.length >= maxImages) return;
    
    const newImage: PageImage = {
      id: `${pageId}-img-${Date.now()}`,
      url: null,
      caption: 'Nova imagem',
      size,
      position: 'inline',
    };
    onImagesChange([...images, newImage]);
  };

  const handleImageChange = (imageId: string, url: string | null) => {
    onImagesChange(images.map((img) =>
      img.id === imageId ? { ...img, url } : img
    ));
  };

  const handleSizeChange = (imageId: string, size: ElementSize) => {
    onImagesChange(images.map((img) =>
      img.id === imageId ? { ...img, size, height: undefined } : img
    ));
  };

  const handleHeightChange = (imageId: string, height: number) => {
    onImagesChange(images.map((img) =>
      img.id === imageId ? { ...img, height } : img
    ));
  };

  const handleRemoveImage = (imageId: string) => {
    onImagesChange(images.filter((img) => img.id !== imageId));
  };

  const layoutClasses = {
    column: 'flex flex-col gap-3',
    row: 'flex flex-row gap-3 flex-wrap',
    grid: 'grid grid-cols-2 gap-3',
  };

  const sortingStrategy = layout === 'row' 
    ? horizontalListSortingStrategy 
    : verticalListSortingStrategy;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className={cn(layoutClasses[layout], 'flex-1', className)}>
        <SortableContext
          items={images.map((img) => img.id)}
          strategy={sortingStrategy}
        >
          {images.map((image) => (
            <SortableImageSlot
              key={image.id}
              image={image}
              onImageChange={(url) => handleImageChange(image.id, url)}
              onSizeChange={(size) => handleSizeChange(image.id, size)}
              onHeightChange={(height) => handleHeightChange(image.id, height)}
              onRemove={() => handleRemoveImage(image.id)}
            />
          ))}
        </SortableContext>

        {showAddButton && images.length < maxImages && (
          <div className={cn(
            "flex items-center justify-center",
            images.length === 0 ? "flex-1 min-h-[100px]" : "py-2"
          )}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-dashed border-muted-foreground/30 hover:border-gold hover:bg-gold/5 gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-xs">
                    {images.length === 0 ? 'Adicionar imagem' : 'Mais'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleAddImage('sm')}>
                  <Minimize2 className="w-4 h-4 mr-2" /> Pequena
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddImage('md')}>
                  <Move className="w-4 h-4 mr-2" /> Média
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddImage('lg')}>
                  <Maximize2 className="w-4 h-4 mr-2" /> Grande
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddImage('full')}>
                  <Maximize2 className="w-4 h-4 mr-2" /> Preencher espaço
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </DndContext>
  );
};

// Simple inline image slot (no drag-and-drop)
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
  placeholder = 'Adicionar imagem',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onImageChange(reader.result as string);
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

// Flexible image container (simplified)
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
  maxImages = 3,
}) => {
  return (
    <PageImageManager
      pageId={pageId}
      images={images}
      onImagesChange={onImagesChange}
      layout="column"
      showAddButton={true}
      maxImages={maxImages}
      className={`min-h-[${minHeight}]`}
    />
  );
};

// Re-export for backwards compatibility
export { SortableImageSlot as ImageSlot };
export const AddImageButton: React.FC<{ onAdd: (size: ElementSize) => void; compact?: boolean }> = ({ onAdd, compact = false }) => {
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
        <DropdownMenuItem onClick={() => onAdd('sm')}>
          <Minimize2 className="w-4 h-4 mr-2" /> Pequena
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd('md')}>
          <Move className="w-4 h-4 mr-2" /> Média
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd('lg')}>
          <Maximize2 className="w-4 h-4 mr-2" /> Grande
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd('full')}>
          <Maximize2 className="w-4 h-4 mr-2" /> Preencher espaço
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
