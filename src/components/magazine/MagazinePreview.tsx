import React, { forwardRef } from 'react';
import { MagazineContent, PageImage } from '@/types/magazine';
import {
  MagazinePage,
  GoldenTextBox,
  SectionTitle,
  TopicHeader,
  SubtopicHeader,
  BodyText,
  HighlightBox,
  ObjectivesList,
  QuestionItem,
  BiblicalReadingBox,
  Ornament,
  PullQuote
} from './MagazinePage';
import { FlexibleImageContainer, InlineImageSlot } from './PageImageManager';

interface MagazinePreviewProps {
  content: MagazineContent;
  onPageImagesChange?: (pageId: string, images: PageImage[]) => void;
}

export const MagazinePreview = forwardRef<HTMLDivElement, MagazinePreviewProps>(
  ({ content, onPageImagesChange }, ref) => {
    
    const getPageImages = (pageNumber: number) => {
      const page = content.pageImages?.find(p => p.pageNumber === pageNumber);
      return page?.images || [];
    };

    const handlePageImagesChange = (pageId: string, images: PageImage[]) => {
      onPageImagesChange?.(pageId, images);
    };

    // Get cover image for page 1
    const coverImage = getPageImages(1)[0]?.url;

    return (
      <div ref={ref} className="space-y-6 bg-muted/30 p-8 rounded-lg">
        
        {/* ========== PÁGINA 1: CAPA ========== */}
        <MagazinePage pageNumber={1} showBorder={false}>
          <div className="h-full flex flex-col">
            {/* Header bar */}
            <div className="bg-burgundy px-6 py-3 flex justify-between items-center flex-shrink-0">
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-primary-foreground/70">
                Escola Bíblica Dominical
              </span>
              <span className="font-sans text-[10px] uppercase tracking-widest text-gold">
                {content.lessonNumber}
              </span>
            </div>

            {/* Cover image area - fills remaining space */}
            <div className="flex-1 relative min-h-0">
              <FlexibleImageContainer
                pageId="page-1"
                images={getPageImages(1)}
                onImagesChange={(images) => handlePageImagesChange('page-1', images)}
                minHeight="100%"
                maxImages={1}
              />
              
              {/* Overlay content - only show when there's an image */}
              {coverImage && (
                <div className="absolute inset-0 bg-gradient-to-t from-burgundy via-burgundy/60 to-transparent flex flex-col justify-end p-8 pointer-events-none">
                  <span className="font-sans text-xs uppercase tracking-[0.2em] text-gold mb-2">
                    {content.lessonNumber}
                  </span>
                  <h1 className="font-display text-4xl font-bold text-primary-foreground leading-tight mb-4">
                    {content.lessonTitle}
                  </h1>
                  <div className="w-24 h-1 bg-gold mb-4" />
                  <p className="font-body text-sm text-primary-foreground/80 max-w-md leading-relaxed">
                    {content.introduction.split('\n')[0].substring(0, 150)}...
                  </p>
                </div>
              )}
              
              {/* Text overlay when no image */}
              {!coverImage && (
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 pointer-events-none">
                  <span className="font-sans text-xs uppercase tracking-[0.2em] text-gold mb-4">
                    {content.lessonNumber}
                  </span>
                  <h1 className="font-display text-3xl font-bold text-burgundy leading-tight mb-4">
                    {content.lessonTitle}
                  </h1>
                  <div className="w-24 h-1 bg-gold mb-4" />
                </div>
              )}
            </div>

            {/* Bottom summary bar */}
            <div className="bg-navy p-4 flex-shrink-0">
              <div className="grid grid-cols-3 gap-4 text-center">
                {content.topics.map((topic) => (
                  <div key={topic.id} className="border-l border-primary-foreground/20 first:border-l-0 pl-3 first:pl-0">
                    <span className="font-display text-xs text-gold">{topic.number}</span>
                    <p className="font-sans text-[9px] text-primary-foreground/70 uppercase tracking-wider mt-1 line-clamp-2">
                      {topic.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </MagazinePage>

        {/* ========== PÁGINA 2: INTRODUÇÃO + TEXTO ÁUREO ========== */}
        <MagazinePage pageNumber={2}>
          <div className="p-8 pb-12 h-full flex flex-col">
            {/* Two column layout */}
            <div className="grid grid-cols-[1fr_160px] gap-6 flex-1">
              {/* Main content */}
              <div className="flex flex-col">
                <SectionTitle>Introdução</SectionTitle>
                <BodyText className="mb-6">
                  {content.introduction}
                </BodyText>

                <GoldenTextBox 
                  text={content.goldenText} 
                  reference={content.goldenTextReference} 
                />

                <ObjectivesList objectives={content.objectives} />
              </div>

              {/* Sidebar with flexible images */}
              <div className="flex flex-col gap-4">
                <FlexibleImageContainer
                  pageId="page-2"
                  images={getPageImages(2)}
                  onImagesChange={(images) => handlePageImagesChange('page-2', images)}
                  minHeight="200px"
                  maxImages={2}
                />
                
                <div className="bg-burgundy/10 p-3 flex-shrink-0">
                  <p className="font-body text-xs italic text-burgundy text-center leading-relaxed">
                    "A quem muito foi dado, muito será exigido"
                  </p>
                  <p className="font-sans text-[9px] text-burgundy/70 text-center mt-1">
                    Lucas 12.48
                  </p>
                </div>
              </div>
            </div>
          </div>
        </MagazinePage>

        {/* ========== PÁGINA 3: LEITURA BÍBLICA + TÓPICO I (parte 1) ========== */}
        <MagazinePage pageNumber={3}>
          <div className="h-full flex flex-col">
            {/* Header accent */}
            <div className="bg-burgundy h-2 flex-shrink-0" />
            
            <div className="p-8 pb-12 flex-1 flex flex-col">
              <BiblicalReadingBox 
                text={content.biblicalReading} 
                reference={content.biblicalReadingReference} 
              />

              {content.topics[0] && (
                <div className="mt-6 flex-1 flex flex-col">
                  <TopicHeader 
                    number={content.topics[0].number} 
                    title={content.topics[0].title}
                    variant="featured"
                  />
                  
                  <div className="grid grid-cols-[1fr_150px] gap-5 mt-4 flex-1">
                    <div className="flex-shrink-0">
                      {content.topics[0].subtopics.slice(0, 2).map((sub) => (
                        <div key={sub.id}>
                          <SubtopicHeader number={sub.number} title={sub.title} />
                          <BodyText>{sub.content}</BodyText>
                        </div>
                      ))}
                    </div>
                    
                    {/* Flexible image container */}
                    <div className="flex flex-col">
                      <FlexibleImageContainer
                        pageId="page-3"
                        images={getPageImages(3)}
                        onImagesChange={(images) => handlePageImagesChange('page-3', images)}
                        minHeight="180px"
                        maxImages={2}
                      />
                      <p className="font-sans text-[9px] text-muted-foreground text-center italic mt-2 flex-shrink-0">
                        Ilustração do Tópico I
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </MagazinePage>

        {/* ========== PÁGINA 4: TÓPICO I (parte 2) + TÓPICO II ========== */}
        <MagazinePage pageNumber={4}>
          <div className="p-8 pb-12 h-full flex flex-col">
            {/* Continue Topic I if there's a 3rd subtopic */}
            {content.topics[0]?.subtopics[2] && (
              <div className="mb-6 pb-6 border-b border-gold/30 flex-shrink-0">
                <SubtopicHeader 
                  number={content.topics[0].subtopics[2].number} 
                  title={content.topics[0].subtopics[2].title} 
                />
                <BodyText>{content.topics[0].subtopics[2].content}</BodyText>
              </div>
            )}

            {/* Topic II */}
            {content.topics[1] && (
              <div className="flex-1 flex flex-col">
                <TopicHeader 
                  number={content.topics[1].number} 
                  title={content.topics[1].title} 
                />
                
                {/* Flexible image + quote section */}
                <div className="grid grid-cols-2 gap-4 my-4 flex-1 min-h-[120px]">
                  <FlexibleImageContainer
                    pageId="page-4"
                    images={getPageImages(4)}
                    onImagesChange={(images) => handlePageImagesChange('page-4', images)}
                    minHeight="100%"
                    maxImages={2}
                  />
                  <div className="bg-burgundy p-4 flex flex-col justify-center">
                    <p className="font-body text-sm italic text-primary-foreground/90 leading-relaxed">
                      "Ora, a fé é o firme fundamento das coisas que se esperam e a prova das coisas que se não veem"
                    </p>
                    <p className="font-sans text-xs text-gold mt-2">— Hebreus 11.1</p>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {content.topics[1].subtopics.map((sub) => (
                    <div key={sub.id}>
                      <SubtopicHeader number={sub.number} title={sub.title} />
                      <BodyText>{sub.content}</BodyText>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </MagazinePage>

        {/* ========== PÁGINA 5: CONHECENDO UM POUCO MAIS + TÓPICO III ========== */}
        <MagazinePage pageNumber={5} variant="accent">
          <div className="p-8 pb-12 h-full flex flex-col">
            <HighlightBox title="Conhecendo um pouco mais" variant="info">
              <p>
                No Novo Testamento, o verbo pisteuõ ('creio, confio') e o substantivo pistis ('fé') 
                ocorrem cerca de 480 vezes. A fé não é 'um salto no escuro', mas a atitude da nossa 
                dependência confiante e obediente em Deus e na sua fidelidade. Essa fé caracteriza 
                todo filho de Deus fiel.
              </p>
            </HighlightBox>

            <Ornament />

            {content.topics[2] && (
              <div className="flex-1 flex flex-col">
                <TopicHeader 
                  number={content.topics[2].number} 
                  title={content.topics[2].title}
                  variant="featured"
                />
                
                <div className="grid grid-cols-[150px_1fr] gap-5 flex-1">
                  {/* Flexible image fills vertical space */}
                  <FlexibleImageContainer
                    pageId="page-5"
                    images={getPageImages(5)}
                    onImagesChange={(images) => handlePageImagesChange('page-5', images)}
                    minHeight="200px"
                    maxImages={2}
                  />
                  
                  <div className="flex-shrink-0">
                    {content.topics[2].subtopics.map((sub) => (
                      <div key={sub.id}>
                        <SubtopicHeader number={sub.number} title={sub.title} />
                        <BodyText>{sub.content}</BodyText>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </MagazinePage>

        {/* ========== PÁGINA 6: INTERAGINDO + CONCLUSÃO ========== */}
        <MagazinePage pageNumber={6}>
          <div className="h-full flex flex-col">
            {/* Full-width highlight section */}
            <div className="bg-burgundy p-6 flex-shrink-0">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-2xl text-gold">?</span>
                </div>
                <div>
                  <h4 className="font-display text-lg font-semibold text-primary-foreground uppercase tracking-wide mb-2">
                    Interagindo
                  </h4>
                  <p className="font-body text-sm text-primary-foreground/85 leading-relaxed">
                    Pergunte a si mesmo com sinceridade, à luz da Palavra de Deus: Como administro 
                    meu tempo? Minha vida espiritual resiste ao estresse diário? Examine-se como o 
                    mordomo fiel que presta contas ao Senhor (Lc 16.2).
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 pb-12 flex-1 flex flex-col">
              <div className="grid grid-cols-[1fr_160px] gap-6 flex-1">
                <div className="flex flex-col">
                  <SectionTitle>Conclusão</SectionTitle>
                  <BodyText className="mb-6">{content.conclusion}</BodyText>
                  
                  <PullQuote 
                    quote="Usemos os recursos que Deus nos concedeu como verdadeiros mordomos de Nosso Senhor Jesus Cristo."
                  />
                </div>

                {/* Flexible image sidebar */}
                <FlexibleImageContainer
                  pageId="page-6"
                  images={getPageImages(6)}
                  onImagesChange={(images) => handlePageImagesChange('page-6', images)}
                  minHeight="180px"
                  maxImages={2}
                />
              </div>
            </div>
          </div>
        </MagazinePage>

        {/* ========== PÁGINA 7: SUBSÍDIOS TEOLÓGICOS ========== */}
        <MagazinePage pageNumber={7} variant="default">
          <div className="h-full flex flex-col">
            {/* Decorative header */}
            <div className="bg-navy py-4 px-8 flex-shrink-0">
              <SectionTitle variant="light">Subsídios Teológicos</SectionTitle>
            </div>

            <div className="p-8 pb-12 flex-1 flex flex-col">
              <div className="bg-cream/50 p-6 border-l-4 border-gold flex-shrink-0">
                <div className="columns-2 gap-8">
                  {content.theologicalSubsidies.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="font-body text-sm leading-relaxed text-foreground/85 mb-4 text-justify break-inside-avoid">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <Ornament className="my-6 flex-shrink-0" />

              {/* Stats + flexible image section fills remaining space */}
              <div className="flex-1 grid grid-cols-[1fr_180px] gap-4 min-h-[100px]">
                <div className="grid grid-cols-3 gap-3 content-start">
                  <div className="bg-burgundy/10 p-4 text-center">
                    <span className="font-display text-2xl font-bold text-burgundy">480+</span>
                    <p className="font-sans text-[9px] text-muted-foreground uppercase tracking-wider mt-1">
                      vezes "fé" no NT
                    </p>
                  </div>
                  <div className="bg-navy/10 p-4 text-center">
                    <span className="font-display text-lg font-bold text-navy">1Co 4.2</span>
                    <p className="font-sans text-[9px] text-muted-foreground uppercase tracking-wider mt-1">
                      Fidelidade requerida
                    </p>
                  </div>
                  <div className="bg-gold/20 p-4 text-center">
                    <span className="font-display text-lg font-bold text-burgundy">Lc 16.10</span>
                    <p className="font-sans text-[9px] text-muted-foreground uppercase tracking-wider mt-1">
                      Fiel no pouco
                    </p>
                  </div>
                </div>
                
                {/* Flexible image */}
                <FlexibleImageContainer
                  pageId="page-7"
                  images={getPageImages(7)}
                  onImagesChange={(images) => handlePageImagesChange('page-7', images)}
                  minHeight="100px"
                  maxImages={2}
                />
              </div>
            </div>
          </div>
        </MagazinePage>

        {/* ========== PÁGINA 8: PERGUNTAS PARA REFLEXÃO ========== */}
        <MagazinePage pageNumber={8}>
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-burgundy px-8 py-6 flex-shrink-0">
              <SectionTitle variant="light">Perguntas para Reflexão</SectionTitle>
              <p className="font-body text-sm text-primary-foreground/70 italic -mt-2">
                Medite nestas questões para aprofundar sua compreensão da lição
              </p>
            </div>

            <div className="p-8 pb-12 flex-1 flex flex-col">
              <div className="grid grid-cols-2 gap-x-6 flex-shrink-0">
                {content.reflectionQuestions.map((q) => (
                  <QuestionItem key={q.id} number={q.number} question={q.question} />
                ))}
              </div>

              <Ornament className="my-6 flex-shrink-0" />

              {/* Flexible image + quote section fills remaining space */}
              <div className="flex-1 grid grid-cols-[1fr_1fr] gap-4 min-h-[100px]">
                <FlexibleImageContainer
                  pageId="page-8"
                  images={getPageImages(8)}
                  onImagesChange={(images) => handlePageImagesChange('page-8', images)}
                  minHeight="100%"
                  maxImages={2}
                />
                
                <div className="bg-cream/50 p-6 border border-gold/30 flex flex-col justify-center">
                  <p className="font-display text-xl italic text-burgundy text-center">
                    "A quem muito foi dado, muito será exigido"
                  </p>
                  <p className="font-sans text-sm text-gold font-semibold mt-2 text-center">— Lucas 12.48</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gold/30 text-center flex-shrink-0">
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Revista de Escola Bíblica Dominical • Edição Especial
                </span>
              </div>
            </div>
          </div>
        </MagazinePage>
      </div>
    );
  }
);

MagazinePreview.displayName = 'MagazinePreview';
