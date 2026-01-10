import React from 'react';
import { cn } from '@/lib/utils';

interface MagazinePageProps {
  pageNumber: number;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'dark' | 'accent';
  showBorder?: boolean;
}

export const MagazinePage: React.FC<MagazinePageProps> = ({
  pageNumber,
  children,
  className,
  variant = 'default',
  showBorder = true
}) => {
  const bgClasses = {
    default: 'bg-ivory',
    dark: 'bg-burgundy text-primary-foreground',
    accent: 'bg-gradient-to-br from-cream to-ivory'
  };

  return (
    <div 
      className={cn(
        "magazine-page w-[210mm] min-h-[297mm] mx-auto shadow-2xl relative overflow-hidden",
        bgClasses[variant],
        className
      )}
      style={{
        aspectRatio: '210 / 297',
      }}
    >
      {/* Border decoration */}
      {showBorder && variant === 'default' && (
        <div className="absolute inset-3 border border-gold/20 pointer-events-none" />
      )}
      
      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
      
      {/* Page number footer */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-8 flex items-center justify-between px-6",
        variant === 'dark' ? 'bg-black/20' : 'bg-burgundy'
      )}>
        <span className="font-sans text-[10px] uppercase tracking-widest text-primary-foreground/70">
          Escola Bíblica Dominical
        </span>
        <span className="font-display text-sm text-primary-foreground font-semibold">
          {pageNumber}
        </span>
      </div>
    </div>
  );
};

// Golden Text Box - Featured quote styling
export const GoldenTextBox: React.FC<{ text: string; reference: string }> = ({ text, reference }) => (
  <div className="relative bg-gradient-to-br from-gold/15 via-gold/10 to-gold/5 p-6 my-4">
    <div className="absolute -top-4 left-6 bg-burgundy px-4 py-1">
      <span className="font-display text-xs uppercase tracking-widest text-primary-foreground font-semibold">
        Texto Áureo
      </span>
    </div>
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold" />
    <p className="font-body text-base italic text-foreground leading-relaxed mt-2 pl-4">
      "{text}"
    </p>
    <p className="font-display text-sm text-burgundy font-semibold mt-3 text-right">
      — {reference}
    </p>
  </div>
);

// Section Title with decorative line
export const SectionTitle: React.FC<{ children: React.ReactNode; variant?: 'primary' | 'secondary' | 'light' }> = ({ 
  children, 
  variant = 'primary' 
}) => (
  <div className="mb-4 relative">
    <h2 className={cn(
      "font-display font-bold tracking-wide uppercase",
      variant === 'primary' && "text-2xl text-burgundy",
      variant === 'secondary' && "text-xl text-navy",
      variant === 'light' && "text-2xl text-primary-foreground"
    )}>
      {children}
    </h2>
    <div className={cn(
      "h-1 mt-2",
      variant === 'light'
        ? "w-24 bg-gold"
        : "w-20 bg-gradient-to-r from-gold via-gold to-transparent"
    )} />
  </div>
);

// Topic Header with number badge
export const TopicHeader: React.FC<{ number: string; title: string; variant?: 'default' | 'featured' }> = ({ 
  number, 
  title,
  variant = 'default'
}) => (
  <div className={cn(
    "flex items-center gap-4 mb-4 py-3",
    variant === 'featured' && "bg-burgundy/10 px-4 -mx-4"
  )}>
    <div className="w-12 h-12 rounded-full bg-burgundy flex items-center justify-center flex-shrink-0 shadow-lg">
      <span className="font-display text-lg font-bold text-primary-foreground">{number}</span>
    </div>
    <div>
      <span className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground block">
        Tópico
      </span>
      <h3 className="font-display text-lg font-bold text-burgundy uppercase tracking-wide">
        {title}
      </h3>
    </div>
  </div>
);

// Subtopic header with gold accent
export const SubtopicHeader: React.FC<{ number: string; title: string }> = ({ number, title }) => (
  <div className="flex items-baseline gap-3 mb-2 mt-5 border-l-2 border-gold pl-3">
    <span className="font-display text-lg font-bold text-gold">{number}.</span>
    <h4 className="font-display text-base font-semibold text-foreground">
      {title}
    </h4>
  </div>
);

// Body text with proper typography
export const BodyText: React.FC<{ children: React.ReactNode; className?: string; columns?: 1 | 2 }> = ({ 
  children, 
  className,
  columns = 1
}) => (
  <p className={cn(
    "font-body text-sm leading-relaxed text-foreground/90 text-justify",
    columns === 2 && "columns-2 gap-6",
    className
  )}>
    {children}
  </p>
);

// Highlight Box for special content
export const HighlightBox: React.FC<{ 
  title: string; 
  children: React.ReactNode; 
  variant?: 'info' | 'theological' | 'warning'
}> = ({ 
  title, 
  children,
  variant = 'info'
}) => (
  <div className={cn(
    "relative my-6 overflow-hidden",
    variant === 'info' && "bg-navy/5 border-l-4 border-navy",
    variant === 'theological' && "bg-burgundy/5 border-l-4 border-burgundy",
    variant === 'warning' && "bg-gold/10 border-l-4 border-gold"
  )}>
    <div className={cn(
      "px-4 py-1.5",
      variant === 'info' && "bg-navy",
      variant === 'theological' && "bg-burgundy",
      variant === 'warning' && "bg-gold"
    )}>
      <span className="font-sans text-xs uppercase tracking-widest font-semibold text-primary-foreground">
        {title}
      </span>
    </div>
    <div className="p-4 font-body text-sm leading-relaxed text-foreground/85">
      {children}
    </div>
  </div>
);

// Objectives List with styled items
export const ObjectivesList: React.FC<{ objectives: string[] }> = ({ objectives }) => (
  <div className="bg-navy text-primary-foreground p-5 my-4">
    <h4 className="font-display text-sm uppercase tracking-widest font-semibold mb-4 flex items-center gap-2">
      <span className="w-6 h-px bg-gold" />
      Objetivos da Lição
      <span className="w-6 h-px bg-gold" />
    </h4>
    <ul className="space-y-3">
      {objectives.map((obj, index) => (
        <li key={index} className="flex items-start gap-3">
          <span className="font-display text-sm font-bold text-gold bg-gold/20 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
            {['I', 'II', 'III', 'IV', 'V'][index]}
          </span>
          <span className="font-body text-sm text-primary-foreground/90">{obj}</span>
        </li>
      ))}
    </ul>
  </div>
);

// Question Item for reflection section
export const QuestionItem: React.FC<{ number: number; question: string }> = ({ number, question }) => (
  <div className="flex gap-4 py-4 border-b border-border/30 last:border-b-0">
    <div className="w-10 h-10 rounded-lg bg-burgundy flex items-center justify-center flex-shrink-0 shadow-md">
      <span className="font-display text-base font-bold text-primary-foreground">{number}</span>
    </div>
    <p className="font-body text-sm text-foreground leading-relaxed pt-1">{question}</p>
  </div>
);

// Biblical Reading Box
export const BiblicalReadingBox: React.FC<{ text: string; reference: string }> = ({ text, reference }) => (
  <div className="relative my-4">
    {/* Vertical label */}
    <div className="absolute -left-1 top-0 bottom-0 w-8 bg-burgundy flex items-center justify-center">
      <span 
        className="font-display text-xs uppercase tracking-widest text-primary-foreground font-semibold whitespace-nowrap"
        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
      >
        Leitura Bíblica
      </span>
    </div>
    
    <div className="ml-10 bg-cream/50 border border-border/50 p-4">
      <p className="font-body text-sm leading-relaxed text-foreground/85 whitespace-pre-line">
        {text}
      </p>
      <p className="font-display text-xs text-burgundy font-semibold mt-3 text-right border-t border-gold/30 pt-2">
        — {reference}
      </p>
    </div>
  </div>
);

// Decorative Ornament
export const Ornament: React.FC<{ className?: string; variant?: 'default' | 'light' }> = ({ className, variant = 'default' }) => (
  <div className={cn("flex items-center justify-center gap-3 my-6", className)}>
    <div className={cn(
      "w-16 h-px",
      variant === 'default' 
        ? "bg-gradient-to-r from-transparent via-gold to-gold/50"
        : "bg-gradient-to-r from-transparent via-primary-foreground/50 to-primary-foreground/30"
    )} />
    <div className={cn(
      "w-2.5 h-2.5 rotate-45",
      variant === 'default' ? "bg-gold" : "bg-primary-foreground/50"
    )} />
    <div className={cn(
      "w-16 h-px",
      variant === 'default'
        ? "bg-gradient-to-l from-transparent via-gold to-gold/50"
        : "bg-gradient-to-l from-transparent via-primary-foreground/50 to-primary-foreground/30"
    )} />
  </div>
);

// Pull Quote for featured quotes
export const PullQuote: React.FC<{ quote: string; author?: string }> = ({ quote, author }) => (
  <div className="my-6 py-4 border-y-2 border-gold/40">
    <p className="font-display text-lg italic text-burgundy text-center leading-relaxed">
      "{quote}"
    </p>
    {author && (
      <p className="font-sans text-xs text-muted-foreground text-center mt-2 uppercase tracking-wider">
        — {author}
      </p>
    )}
  </div>
);

// Image placeholder with overlay text capability
export const ImageWithCaption: React.FC<{
  imageUrl: string | null;
  caption?: string;
  overlay?: boolean;
  children?: React.ReactNode;
  className?: string;
}> = ({ imageUrl, caption, overlay = false, children, className }) => (
  <div className={cn("relative overflow-hidden", className)}>
    {imageUrl ? (
      <img src={imageUrl} alt={caption || ''} className="w-full h-full object-cover" />
    ) : (
      <div className="w-full h-full bg-muted/30 flex items-center justify-center">
        <span className="text-xs text-muted-foreground/50 font-sans">Sem imagem</span>
      </div>
    )}
    {overlay && children && (
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-4">
        {children}
      </div>
    )}
    {caption && !overlay && (
      <div className="bg-burgundy/90 px-3 py-1.5">
        <p className="font-sans text-[10px] text-primary-foreground uppercase tracking-wider">{caption}</p>
      </div>
    )}
  </div>
);
