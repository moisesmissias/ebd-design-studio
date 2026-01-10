import React from 'react';
import { cn } from '@/lib/utils';

interface MagazinePageProps {
  pageNumber: number;
  children: React.ReactNode;
  className?: string;
}

export const MagazinePage: React.FC<MagazinePageProps> = ({
  pageNumber,
  children,
  className
}) => {
  return (
    <div 
      className={cn(
        "magazine-page bg-ivory w-[210mm] min-h-[297mm] mx-auto shadow-editorial relative overflow-hidden",
        "p-8 print:p-6",
        className
      )}
      style={{
        aspectRatio: '210 / 297',
      }}
    >
      {/* Borda decorativa */}
      <div className="absolute inset-4 border border-gold/30 pointer-events-none" />
      
      {/* Conteúdo */}
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
      
      {/* Número da página */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <div className="w-8 h-px bg-gradient-to-r from-transparent to-burgundy/40" />
        <span className="font-display text-sm text-burgundy/70">{pageNumber}</span>
        <div className="w-8 h-px bg-gradient-to-l from-transparent to-burgundy/40" />
      </div>
    </div>
  );
};

// Componentes auxiliares para elementos da revista
export const GoldenTextBox: React.FC<{ text: string; reference: string }> = ({ text, reference }) => (
  <div className="bg-gradient-to-br from-gold/10 to-gold/5 border-l-4 border-gold p-5 my-4 relative">
    <div className="absolute -top-2 left-4 bg-ivory px-3">
      <span className="font-display text-xs uppercase tracking-widest text-gold font-semibold">
        Texto Áureo
      </span>
    </div>
    <p className="font-body text-base italic text-foreground/90 leading-relaxed mt-2">
      "{text}"
    </p>
    <p className="font-sans text-sm text-burgundy font-medium mt-2 text-right">
      — {reference}
    </p>
  </div>
);

export const SectionTitle: React.FC<{ children: React.ReactNode; variant?: 'primary' | 'secondary' }> = ({ 
  children, 
  variant = 'primary' 
}) => (
  <div className="mb-4">
    <h2 className={cn(
      "font-display font-bold tracking-wide",
      variant === 'primary' 
        ? "text-xl text-burgundy" 
        : "text-lg text-navy"
    )}>
      {children}
    </h2>
    <div className={cn(
      "h-0.5 mt-1",
      variant === 'primary'
        ? "w-20 bg-gradient-to-r from-gold to-transparent"
        : "w-16 bg-gradient-to-r from-burgundy/40 to-transparent"
    )} />
  </div>
);

export const TopicHeader: React.FC<{ number: string; title: string }> = ({ number, title }) => (
  <div className="flex items-start gap-3 mb-3 mt-6 first:mt-0">
    <div className="w-8 h-8 rounded-full bg-burgundy flex items-center justify-center flex-shrink-0">
      <span className="font-display text-sm font-bold text-primary-foreground">{number}</span>
    </div>
    <h3 className="font-display text-lg font-bold text-burgundy uppercase tracking-wide pt-1">
      {title}
    </h3>
  </div>
);

export const SubtopicHeader: React.FC<{ number: string; title: string }> = ({ number, title }) => (
  <div className="flex items-baseline gap-2 mb-2 mt-4">
    <span className="font-display text-base font-bold text-gold">{number}.</span>
    <h4 className="font-display text-base font-semibold text-foreground">
      {title}
    </h4>
  </div>
);

export const BodyText: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <p className={cn("font-body text-sm leading-relaxed text-foreground/85 text-justify", className)}>
    {children}
  </p>
);

export const HighlightBox: React.FC<{ title: string; children: React.ReactNode; variant?: 'info' | 'theological' }> = ({ 
  title, 
  children,
  variant = 'info'
}) => (
  <div className={cn(
    "p-4 my-4 rounded relative",
    variant === 'info' 
      ? "bg-muted/50 border border-border" 
      : "bg-burgundy/5 border-l-4 border-burgundy"
  )}>
    <div className={cn(
      "absolute -top-2 left-4 px-2",
      variant === 'info' ? "bg-muted" : "bg-ivory"
    )}>
      <span className={cn(
        "font-sans text-xs uppercase tracking-widest font-semibold",
        variant === 'info' ? "text-muted-foreground" : "text-burgundy"
      )}>
        {title}
      </span>
    </div>
    <div className="mt-2 font-body text-sm leading-relaxed text-foreground/80">
      {children}
    </div>
  </div>
);

export const ObjectivesList: React.FC<{ objectives: string[] }> = ({ objectives }) => (
  <div className="bg-navy/5 p-4 rounded my-4">
    <h4 className="font-sans text-xs uppercase tracking-widest font-semibold text-navy mb-3">
      Objetivos da Lição
    </h4>
    <ul className="space-y-2">
      {objectives.map((obj, index) => (
        <li key={index} className="flex items-start gap-2">
          <span className="font-display text-sm font-bold text-gold">{['I', 'II', 'III', 'IV', 'V'][index]}.</span>
          <span className="font-body text-sm text-foreground/85">{obj}</span>
        </li>
      ))}
    </ul>
  </div>
);

export const QuestionItem: React.FC<{ number: number; question: string }> = ({ number, question }) => (
  <div className="flex gap-3 py-3 border-b border-border/50 last:border-b-0">
    <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
      <span className="font-display text-xs font-bold text-gold">{number}</span>
    </div>
    <p className="font-body text-sm text-foreground/85 leading-relaxed">{question}</p>
  </div>
);

export const BiblicalReadingBox: React.FC<{ text: string; reference: string }> = ({ text, reference }) => (
  <div className="bg-cream/50 border border-border p-4 my-4 rounded">
    <h4 className="font-sans text-xs uppercase tracking-widest font-semibold text-burgundy mb-3">
      Leitura Bíblica em Classe
    </h4>
    <p className="font-body text-sm leading-relaxed text-foreground/80 whitespace-pre-line">
      {text}
    </p>
    <p className="font-sans text-xs text-burgundy font-medium mt-3 text-right">
      — {reference}
    </p>
  </div>
);

export const Ornament: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("flex items-center justify-center gap-2 my-4", className)}>
    <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold/60" />
    <div className="w-2 h-2 rotate-45 border border-gold/60" />
    <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold/60" />
  </div>
);
