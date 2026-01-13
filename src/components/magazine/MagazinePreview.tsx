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
import { 
  AdaptiveImage, 
  AdaptiveSidebar, 
  AdaptiveGrid,
  AutoFillPageWrapper
} from './AdaptiveLayout';

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

    // Helper para adicionar imagem
    const addImage = (pageId: string, caption: string = 'Imagem') => {
      const currentImages = getPageImages(parseInt(pageId.replace('page-', '')));
      const newImage: PageImage = {
        id: `${pageId}-${Date.now()}`,
        url: null,
        caption,
        size: 'fill',
        position: 'inline'
      };
      handlePageImagesChange(pageId, [...currentImages, newImage]);
    };

    const updateImage = (pageId: string, imageId: string, url: string | null) => {
      const pageNum = parseInt(pageId.replace('page-', ''));
      const currentImages = getPageImages(pageNum);
      const updated = currentImages.map(img => 
        img.id === imageId ? { ...img, url } : img
      );
      handlePageImagesChange(pageId, updated);
    };

    const removeImage = (pageId: string, imageId: string) => {
      const pageNum = parseInt(pageId.replace('page-', ''));
      const currentImages = getPageImages(pageNum);
      handlePageImagesChange(pageId, currentImages.filter(img => img.id !== imageId));
    };

    // Get cover images
    const coverImages = getPageImages(1);
    const hasCoverImage = coverImages.some(img => img.url);

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

            {/* Cover image area - preenche todo o espaço restante */}
            <div className="flex-1 relative min-h-0 flex flex-col">
              {coverImages.length === 0 ? (
                <div 
                  onClick={() => addImage('page-1', 'Imagem de Capa')}
                  className="flex-1 flex flex-col items-center justify-center cursor-pointer bg-gradient-to-b from-burgundy/5 to-burgundy/20 group"
                >
                  <div className="text-center p-8">
                    <span className="font-sans text-xs uppercase tracking-[0.2em] text-gold mb-4 block">
                      {content.lessonNumber}
                    </span>
                    <h1 className="font-display text-3xl font-bold text-burgundy leading-tight mb-4">
                      {content.lessonTitle}
                    </h1>
                    <div className="w-24 h-1 bg-gold mx-auto mb-6" />
                    <div className="mt-8 opacity-50 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 rounded-full border-2 border-dashed border-gold/50 mx-auto flex items-center justify-center">
                        <span className="text-2xl text-gold/50">+</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Adicionar imagem de capa</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 relative">
                  {coverImages.map((img, idx) => (
                    <AdaptiveImage
                      key={img.id}
                      image={img}
                      onImageChange={(url) => updateImage('page-1', img.id, url)}
                      onRemove={() => removeImage('page-1', img.id)}
                      fillMode="cover"
                      className="absolute inset-0"
                    />
                  ))}
                  
                  {/* Overlay content */}
                  {hasCoverImage && (
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
            <div className="grid grid-cols-[1fr_160px] gap-6 flex-1">
              {/* Main content */}
              <div className="flex flex-col flex-shrink-0">
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

              {/* Sidebar adaptável - preenche o espaço vertical */}
              <AdaptiveSidebar
                pageId="page-2"
                images={getPageImages(2)}
                onImagesChange={(images) => handlePageImagesChange('page-2', images)}
                maxImages={3}
              >
                <div className="bg-burgundy/10 p-3 flex-shrink-0 mt-auto">
                  <p className="font-body text-xs italic text-burgundy text-center leading-relaxed">
                    "A quem muito foi dado, muito será exigido"
                  </p>
                  <p className="font-sans text-[9px] text-burgundy/70 text-center mt-1">
                    Lucas 12.48
                  </p>
                </div>
              </AdaptiveSidebar>
            </div>
          </div>
        </MagazinePage>

        {/* ========== PÁGINA 3: LEITURA BÍBLICA + TÓPICO I (parte 1) ========== */}
        <MagazinePage pageNumber={3}>
          <div className="h-full flex flex-col">
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
                    
                    {/* Sidebar adaptável */}
                    <AdaptiveSidebar
                      pageId="page-3"
                      images={getPageImages(3)}
                      onImagesChange={(images) => handlePageImagesChange('page-3', images)}
                      width={150}
                      maxImages={2}
                    />
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
                
                {/* Grid adaptável de imagem + citação */}
                <div className="grid grid-cols-2 gap-4 my-4 flex-1 min-h-[120px]">
                  <AdaptiveGrid
                    pageId="page-4"
                    images={getPageImages(4)}
                    onImagesChange={(images) => handlePageImagesChange('page-4', images)}
                    columns={1}
                    maxImages={2}
                    minImageHeight={100}
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
                  {/* Sidebar adaptável à esquerda */}
                  <AdaptiveSidebar
                    pageId="page-5"
                    images={getPageImages(5)}
                    onImagesChange={(images) => handlePageImagesChange('page-5', images)}
                    width={150}
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

                {/* Sidebar adaptável */}
                <AdaptiveSidebar
                  pageId="page-6"
                  images={getPageImages(6)}
                  onImagesChange={(images) => handlePageImagesChange('page-6', images)}
                  maxImages={3}
                />
              </div>
            </div>
          </div>
        </MagazinePage>

        {/* ========== PÁGINA 7: SUBSÍDIOS TEOLÓGICOS ========== */}
        <MagazinePage pageNumber={7} variant="default">
          <div className="h-full flex flex-col">
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

              {/* Stats + área de imagem adaptável */}
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
                
                {/* Sidebar adaptável */}
                <AdaptiveSidebar
                  pageId="page-7"
                  images={getPageImages(7)}
                  onImagesChange={(images) => handlePageImagesChange('page-7', images)}
                  width={180}
                  maxImages={2}
                />
              </div>
            </div>
          </div>
        </MagazinePage>

        {/* ========== PÁGINA 8: PERGUNTAS PARA REFLEXÃO ========== */}
        <MagazinePage pageNumber={8}>
          <div className="h-full flex flex-col">
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

              {/* Área adaptável de imagem + citação */}
              <div className="flex-1 grid grid-cols-[1fr_1fr] gap-4 min-h-[100px]">
                <AdaptiveGrid
                  pageId="page-8"
                  images={getPageImages(8)}
                  onImagesChange={(images) => handlePageImagesChange('page-8', images)}
                  columns={1}
                  maxImages={2}
                  minImageHeight={100}
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

        {/* ========== PÁGINA 9: CONTRACAPA ========== */}
        <MagazinePage pageNumber={9} showBorder={false}>
          <div className="h-full flex flex-col bg-gradient-to-b from-navy via-navy to-burgundy">
            {/* Área de imagem da contracapa */}
            <div className="flex-1 relative">
              {getPageImages(9).length === 0 ? (
                <div 
                  onClick={() => addImage('page-9', 'Arte da Contracapa')}
                  className="h-full flex flex-col items-center justify-center cursor-pointer group p-8"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-gold/30 mx-auto flex items-center justify-center group-hover:border-gold/60 transition-colors">
                      <span className="text-3xl text-gold/30 group-hover:text-gold/60 transition-colors">+</span>
                    </div>
                    <p className="text-sm text-primary-foreground/40 mt-4 group-hover:text-primary-foreground/70 transition-colors">
                      Adicionar arte da contracapa
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col gap-2 p-4">
                  {getPageImages(9).map((img) => (
                    <AdaptiveImage
                      key={img.id}
                      image={img}
                      onImageChange={(url) => updateImage('page-9', img.id, url)}
                      onRemove={() => removeImage('page-9', img.id)}
                      fillMode="contain"
                      minHeight={100}
                    />
                  ))}
                  
                  {getPageImages(9).length < 2 && (
                    <button
                      onClick={() => addImage('page-9', 'Imagem adicional')}
                      className="flex items-center justify-center gap-2 py-2 text-xs text-primary-foreground/40 hover:text-gold transition-colors"
                    >
                      <span>+</span>
                      Mais imagem
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Footer da contracapa */}
            <div className="flex-shrink-0 p-8 text-center">
              <div className="w-16 h-1 bg-gold mx-auto mb-6" />
              <h2 className="font-display text-2xl font-bold text-primary-foreground mb-2">
                {content.lessonTitle}
              </h2>
              <p className="font-sans text-sm text-gold uppercase tracking-widest mb-6">
                {content.lessonNumber}
              </p>
              <p className="font-body text-xs text-primary-foreground/60 max-w-sm mx-auto leading-relaxed">
                Material didático para Escola Bíblica Dominical. 
                Reprodução permitida para fins educativos.
              </p>
              <div className="mt-6 pt-4 border-t border-primary-foreground/20">
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-primary-foreground/40">
                  Escola Bíblica Dominical
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
