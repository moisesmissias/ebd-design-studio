import React, { useState, useRef, useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Maximize2, Minimize2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ElementSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface DraggableElementData {
  id: string;
  type: 'image' | 'text' | 'card' | 'quote' | 'box';
  content: any;
  size: ElementSize;
  width?: number; // percentage 0-100
  height?: number; // pixels
}

interface DraggableElementProps {
  element: DraggableElementData;
  onResize: (id: string, size: ElementSize, width?: number, height?: number) => void;
  onRemove: (id: string) => void;
  children: React.ReactNode;
  className?: string;
  minHeight?: number;
  canResize?: boolean;
  canRemove?: boolean;
}

export const DraggableElement: React.FC<DraggableElementProps> = ({
  element,
  onResize,
  onRemove,
  children,
  className,
  minHeight = 60,
  canResize = true,
  canRemove = true,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.8 : 1,
    height: element.height ? `${element.height}px` : undefined,
    width: element.width ? `${element.width}%` : undefined,
    minHeight: `${minHeight}px`,
  };

  const sizeClasses: Record<ElementSize, string> = {
    xs: 'flex-shrink-0',
    sm: 'flex-shrink-0',
    md: 'flex-1',
    lg: 'flex-[2]',
    xl: 'flex-[3]',
    full: 'w-full flex-1',
  };

  // Handle resize start
  const handleResizeStart = useCallback((e: React.MouseEvent, direction: 'se' | 's' | 'e') => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!elementRef.current) return;
    
    const rect = elementRef.current.getBoundingClientRect();
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: rect.width,
      height: rect.height,
    });
    setIsResizing(true);

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      let newWidth = element.width;
      let newHeight = element.height;
      
      if (direction === 'e' || direction === 'se') {
        const parentWidth = elementRef.current?.parentElement?.clientWidth || 500;
        newWidth = Math.max(20, Math.min(100, ((resizeStart.width + deltaX) / parentWidth) * 100));
      }
      
      if (direction === 's' || direction === 'se') {
        newHeight = Math.max(minHeight, resizeStart.height + deltaY);
      }
      
      onResize(element.id, element.size, newWidth, newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [element, minHeight, onResize, resizeStart]);

  const cycleSizes: ElementSize[] = ['sm', 'md', 'lg', 'full'];
  
  const handleCycleSize = () => {
    const currentIndex = cycleSizes.indexOf(element.size);
    const nextIndex = (currentIndex + 1) % cycleSizes.length;
    onResize(element.id, cycleSizes[nextIndex]);
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        (elementRef as any).current = node;
      }}
      style={style}
      className={cn(
        "relative group rounded-sm transition-shadow",
        isDragging && "shadow-xl ring-2 ring-gold/50",
        isResizing && "ring-2 ring-blue-500/50",
        sizeClasses[element.size],
        className
      )}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-0 left-0 w-8 h-8 cursor-grab active:cursor-grabbing z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-burgundy/90 rounded-br-sm"
      >
        <GripVertical className="w-4 h-4 text-white" />
      </div>

      {/* Controls */}
      <div className="absolute top-0 right-0 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        {canResize && (
          <button
            onClick={handleCycleSize}
            className="w-6 h-6 bg-white/90 hover:bg-white text-foreground rounded-bl-sm flex items-center justify-center shadow-sm"
            title="Alterar tamanho"
          >
            {element.size === 'full' || element.size === 'lg' ? (
              <Minimize2 className="w-3 h-3" />
            ) : (
              <Maximize2 className="w-3 h-3" />
            )}
          </button>
        )}
        {canRemove && (
          <button
            onClick={() => onRemove(element.id)}
            className="w-6 h-6 bg-destructive text-destructive-foreground flex items-center justify-center shadow-sm"
            title="Remover"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="w-full h-full overflow-hidden">
        {children}
      </div>

      {/* Resize handles */}
      {canResize && (
        <>
          {/* Right edge */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'e')}
            className="absolute top-0 right-0 w-2 h-full cursor-ew-resize opacity-0 group-hover:opacity-100 hover:bg-blue-500/30 transition-opacity"
          />
          
          {/* Bottom edge */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 's')}
            className="absolute bottom-0 left-0 w-full h-2 cursor-ns-resize opacity-0 group-hover:opacity-100 hover:bg-blue-500/30 transition-opacity"
          />
          
          {/* Corner */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'se')}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize opacity-0 group-hover:opacity-100 bg-gold/50 hover:bg-gold/80 transition-opacity rounded-tl-sm"
          />
        </>
      )}
    </div>
  );
};
