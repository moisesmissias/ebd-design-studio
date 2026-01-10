import React, { forwardRef } from 'react';
import { MagazineContent } from '@/types/magazine';
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
  Ornament
} from './MagazinePage';

interface MagazinePreviewProps {
  content: MagazineContent;
}

export const MagazinePreview = forwardRef<HTMLDivElement, MagazinePreviewProps>(
  ({ content }, ref) => {
    return (
      <div ref={ref} className="space-y-4 bg-muted/30 p-6 rounded-lg">
        {/* Página 1: Capa + Introdução + Texto Áureo */}
        <MagazinePage pageNumber={1}>
          {/* Cabeçalho decorativo */}
          <div className="text-center mb-6">
            <div className="inline-block">
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Escola Bíblica Dominical
              </span>
            </div>
            <Ornament />
            <div className="bg-burgundy py-4 px-6 -mx-8 mb-4">
              <span className="font-sans text-xs uppercase tracking-widest text-primary-foreground/80">
                {content.lessonNumber}
              </span>
              <h1 className="font-display text-2xl font-bold text-primary-foreground mt-1 tracking-wide">
                {content.lessonTitle}
              </h1>
            </div>
          </div>

          <GoldenTextBox text={content.goldenText} reference={content.goldenTextReference} />
          
          <ObjectivesList objectives={content.objectives} />
          
          <SectionTitle>Introdução</SectionTitle>
          <BodyText>{content.introduction}</BodyText>
          
          <Ornament className="mt-6" />
        </MagazinePage>

        {/* Página 2: Leitura Bíblica + Tópico I */}
        <MagazinePage pageNumber={2}>
          <BiblicalReadingBox 
            text={content.biblicalReading} 
            reference={content.biblicalReadingReference} 
          />
          
          {content.topics[0] && (
            <>
              <TopicHeader 
                number={content.topics[0].number} 
                title={content.topics[0].title} 
              />
              {content.topics[0].subtopics.map((sub) => (
                <div key={sub.id}>
                  <SubtopicHeader number={sub.number} title={sub.title} />
                  <BodyText>{sub.content}</BodyText>
                </div>
              ))}
            </>
          )}
        </MagazinePage>

        {/* Página 3: Tópico II */}
        <MagazinePage pageNumber={3}>
          {content.topics[1] && (
            <>
              <TopicHeader 
                number={content.topics[1].number} 
                title={content.topics[1].title} 
              />
              {content.topics[1].subtopics.map((sub) => (
                <div key={sub.id}>
                  <SubtopicHeader number={sub.number} title={sub.title} />
                  <BodyText>{sub.content}</BodyText>
                </div>
              ))}
            </>
          )}
          
          <HighlightBox title="Conhecendo um pouco mais" variant="info">
            <p>
              No Novo Testamento, o verbo pisteuõ ('creio, confio') e o substantivo pistis ('fé') 
              ocorrem cerca de 480 vezes. A fé não é 'um salto no escuro', mas a atitude da nossa 
              dependência confiante e obediente em Deus e na sua fidelidade.
            </p>
          </HighlightBox>
        </MagazinePage>

        {/* Página 4: Tópico III */}
        <MagazinePage pageNumber={4}>
          {content.topics[2] && (
            <>
              <TopicHeader 
                number={content.topics[2].number} 
                title={content.topics[2].title} 
              />
              {content.topics[2].subtopics.map((sub) => (
                <div key={sub.id}>
                  <SubtopicHeader number={sub.number} title={sub.title} />
                  <BodyText>{sub.content}</BodyText>
                </div>
              ))}
            </>
          )}
          
          <HighlightBox title="Interagindo" variant="info">
            <p>
              Pergunte a si mesmo com sinceridade, à luz da Palavra de Deus: Como administro 
              meu tempo? Minha vida espiritual resiste ao estresse diário? Examine-se como o 
              mordomo fiel que presta contas ao Senhor (Lc 16.2).
            </p>
          </HighlightBox>
        </MagazinePage>

        {/* Página 5: Conclusão + Subsídios Teológicos */}
        <MagazinePage pageNumber={5}>
          <SectionTitle>Conclusão</SectionTitle>
          <BodyText>{content.conclusion}</BodyText>
          
          <Ornament />
          
          <HighlightBox title="Subsídios Teológicos" variant="theological">
            <div className="space-y-3">
              {content.theologicalSubsidies.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </HighlightBox>
        </MagazinePage>

        {/* Página 6: Perguntas para Reflexão */}
        <MagazinePage pageNumber={6}>
          <SectionTitle>Perguntas para Reflexão</SectionTitle>
          <p className="font-body text-sm text-muted-foreground italic mb-4">
            Medite nestas questões para aprofundar sua compreensão da lição:
          </p>
          
          <div className="bg-cream/30 p-4 rounded border border-border/50">
            {content.reflectionQuestions.map((q) => (
              <QuestionItem key={q.id} number={q.number} question={q.question} />
            ))}
          </div>
          
          <Ornament className="mt-8" />
          
          <div className="text-center mt-auto pt-8">
            <p className="font-body text-sm italic text-muted-foreground">
              "A quem muito foi dado, muito será exigido"
            </p>
            <p className="font-sans text-xs text-burgundy mt-1">— Lucas 12.48</p>
          </div>
          
          <div className="mt-8 pt-4 border-t border-gold/30 text-center">
            <span className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground">
              Revista de Escola Bíblica Dominical
            </span>
          </div>
        </MagazinePage>
      </div>
    );
  }
);

MagazinePreview.displayName = 'MagazinePreview';
