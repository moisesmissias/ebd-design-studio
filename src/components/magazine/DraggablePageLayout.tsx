import React, { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, ImagePlus, Type, Square, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DraggableElement, DraggableElementData, ElementSize } from './DraggableElement';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DraggablePageLayoutProps {
  pageId: string;
  elements: DraggableElementData[];
  onElementsChange: (elements: DraggableElementData[]) => void;
  direction?: 'vertical' | 'horizontal' | 'grid';
  className?: string;
  renderElement: (element: DraggableElementData) => React.ReactNode;
  showAddButton?: boolean;
  allowedTypes?: Array<'image' | 'text' | 'card' | 'quote' | 'box'>;
}

export const DraggablePageLayout: React.FC<DraggablePageLayoutProps> = ({
  pageId,
  elements,
  onElementsChange,
  direction = 'vertical',
  className,
  renderElement,
  showAddButton = true,
  allowedTypes = ['image'],
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = elements.findIndex((e) => e.id === active.id);
      const newIndex = elements.findIndex((e) => e.id === over.id);
      onElementsChange(arrayMove(elements, oldIndex, newIndex));
    }
  };

  const handleResize = useCallback((id: string, size: ElementSize, width?: number, height?: number) => {
    onElementsChange(
      elements.map((el) =>
        el.id === id
          ? { ...el, size, width: width ?? el.width, height: height ?? el.height }
          : el
      )
    );
  }, [elements, onElementsChange]);

  const handleRemove = useCallback((id: string) => {
    onElementsChange(elements.filter((el) => el.id !== id));
  }, [elements, onElementsChange]);

  const handleAddElement = (type: 'image' | 'text' | 'card' | 'quote' | 'box') => {
    const newElement: DraggableElementData = {
      id: `${pageId}-${type}-${Date.now()}`,
      type,
      content: type === 'image' ? null : '',
      size: 'md',
      height: type === 'image' ? 150 : undefined,
    };
    onElementsChange([...elements, newElement]);
  };

  const getSortingStrategy = () => {
    switch (direction) {
      case 'horizontal':
        return horizontalListSortingStrategy;
      case 'grid':
        return rectSortingStrategy;
      default:
        return verticalListSortingStrategy;
    }
  };

  const layoutClasses = {
    vertical: 'flex flex-col gap-3',
    horizontal: 'flex flex-row gap-3 flex-wrap',
    grid: 'grid grid-cols-2 gap-3',
  };

  const activeElement = elements.find((e) => e.id === activeId);

  const typeIcons = {
    image: ImagePlus,
    text: Type,
    card: Square,
    quote: Quote,
    box: Square,
  };

  const typeLabels = {
    image: 'Imagem',
    text: 'Texto',
    card: 'Card',
    quote: 'Citação',
    box: 'Caixa',
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={cn(layoutClasses[direction], 'flex-1', className)}>
        <SortableContext
          items={elements.map((e) => e.id)}
          strategy={getSortingStrategy()}
        >
          {elements.map((element) => (
            <DraggableElement
              key={element.id}
              element={element}
              onResize={handleResize}
              onRemove={handleRemove}
            >
              {renderElement(element)}
            </DraggableElement>
          ))}
        </SortableContext>

        {/* Add button area */}
        {showAddButton && (
          <div className={cn(
            "flex items-center justify-center min-h-[60px]",
            elements.length === 0 && "flex-1"
          )}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-dashed border-muted-foreground/30 hover:border-gold hover:bg-gold/5 gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-xs">Adicionar elemento</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {allowedTypes.map((type) => {
                  const Icon = typeIcons[type];
                  return (
                    <DropdownMenuItem key={type} onClick={() => handleAddElement(type)}>
                      <Icon className="w-4 h-4 mr-2" />
                      {typeLabels[type]}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Drag overlay for visual feedback */}
      <DragOverlay>
        {activeElement ? (
          <div className="bg-white/90 shadow-2xl rounded-sm p-2 ring-2 ring-gold/50">
            {renderElement(activeElement)}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

// Simple image element renderer
interface DraggableImageProps {
  url: string | null;
  onImageChange: (url: string | null) => void;
  caption?: string;
  className?: string;
}

export const DraggableImage: React.FC<DraggableImageProps> = ({
  url,
  onImageChange,
  caption,
  className,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  return (
    <div
      onClick={handleClick}
      className={cn(
        "w-full h-full cursor-pointer overflow-hidden bg-muted/20 border-2 border-dashed border-muted-foreground/15 hover:border-gold/40 transition-all rounded-sm flex items-center justify-center",
        url && "border-solid border-transparent",
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

      {url ? (
        <img
          src={url}
          alt={caption || "Imagem"}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-muted-foreground/40 hover:text-gold/60 transition-colors p-4">
          <ImagePlus className="w-8 h-8 mb-2" />
          <span className="text-[10px] uppercase tracking-wider text-center">
            Clique para adicionar
          </span>
          {caption && (
            <span className="text-[9px] text-muted-foreground/30 mt-1">
              {caption}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
