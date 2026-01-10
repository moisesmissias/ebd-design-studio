import React from 'react';
import { MagazineContent, Topic, Subtopic, ReflectionQuestion } from '@/types/magazine';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, Target, MessageSquareQuote, FileText, HelpCircle, Lightbulb } from 'lucide-react';

interface ContentEditorProps {
  content: MagazineContent;
  onChange: (content: MagazineContent) => void;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({ content, onChange }) => {
  const updateField = <K extends keyof MagazineContent>(
    field: K, 
    value: MagazineContent[K]
  ) => {
    onChange({ ...content, [field]: value });
  };

  const updateTopic = (topicIndex: number, updates: Partial<Topic>) => {
    const newTopics = [...content.topics];
    newTopics[topicIndex] = { ...newTopics[topicIndex], ...updates };
    updateField('topics', newTopics);
  };

  const updateSubtopic = (topicIndex: number, subtopicIndex: number, updates: Partial<Subtopic>) => {
    const newTopics = [...content.topics];
    const newSubtopics = [...newTopics[topicIndex].subtopics];
    newSubtopics[subtopicIndex] = { ...newSubtopics[subtopicIndex], ...updates };
    newTopics[topicIndex] = { ...newTopics[topicIndex], subtopics: newSubtopics };
    updateField('topics', newTopics);
  };

  const updateQuestion = (index: number, updates: Partial<ReflectionQuestion>) => {
    const newQuestions = [...content.reflectionQuestions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    updateField('reflectionQuestions', newQuestions);
  };

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...content.objectives];
    newObjectives[index] = value;
    updateField('objectives', newObjectives);
  };

  return (
    <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
      <Accordion type="multiple" defaultValue={["info", "golden", "intro"]} className="space-y-2">
        {/* Informações Básicas */}
        <AccordionItem value="info" className="border rounded-lg bg-card">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-burgundy" />
              <span className="font-sans font-medium">Informações da Lição</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Número da Lição</Label>
                  <Input 
                    value={content.lessonNumber}
                    onChange={(e) => updateField('lessonNumber', e.target.value)}
                    placeholder="Ex: Lição 1"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Título da Lição</Label>
                  <Input 
                    value={content.lessonTitle}
                    onChange={(e) => updateField('lessonTitle', e.target.value)}
                    placeholder="Título principal"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Texto Áureo */}
        <AccordionItem value="golden" className="border rounded-lg bg-card">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <MessageSquareQuote className="w-4 h-4 text-gold" />
              <span className="font-sans font-medium">Texto Áureo</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Versículo</Label>
                <Textarea 
                  value={content.goldenText}
                  onChange={(e) => updateField('goldenText', e.target.value)}
                  placeholder="Digite o texto áureo"
                  className="mt-1 min-h-[80px]"
                />
              </div>
              <div>
                <Label className="text-xs">Referência</Label>
                <Input 
                  value={content.goldenTextReference}
                  onChange={(e) => updateField('goldenTextReference', e.target.value)}
                  placeholder="Ex: Lucas 12.42,43"
                  className="mt-1"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Objetivos */}
        <AccordionItem value="objectives" className="border rounded-lg bg-card">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-navy" />
              <span className="font-sans font-medium">Objetivos</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-2">
              {content.objectives.map((obj, index) => (
                <div key={index}>
                  <Label className="text-xs">Objetivo {['I', 'II', 'III'][index]}</Label>
                  <Input 
                    value={obj}
                    onChange={(e) => updateObjective(index, e.target.value)}
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Leitura Bíblica */}
        <AccordionItem value="reading" className="border rounded-lg bg-card">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-burgundy" />
              <span className="font-sans font-medium">Leitura Bíblica</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Texto</Label>
                <Textarea 
                  value={content.biblicalReading}
                  onChange={(e) => updateField('biblicalReading', e.target.value)}
                  className="mt-1 min-h-[150px] font-body text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Referência</Label>
                <Input 
                  value={content.biblicalReadingReference}
                  onChange={(e) => updateField('biblicalReadingReference', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Introdução */}
        <AccordionItem value="intro" className="border rounded-lg bg-card">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="font-sans font-medium">Introdução</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <Textarea 
              value={content.introduction}
              onChange={(e) => updateField('introduction', e.target.value)}
              className="min-h-[120px] font-body text-sm"
            />
          </AccordionContent>
        </AccordionItem>

        {/* Tópicos */}
        {content.topics.map((topic, topicIndex) => (
          <AccordionItem 
            key={topic.id} 
            value={`topic-${topicIndex}`}
            className="border rounded-lg bg-card"
          >
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-burgundy flex items-center justify-center">
                  <span className="text-[10px] font-bold text-primary-foreground">{topic.number}</span>
                </div>
                <span className="font-sans font-medium text-sm">{topic.title || `Tópico ${topic.number}`}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-xs">Título do Tópico</Label>
                  <Input 
                    value={topic.title}
                    onChange={(e) => updateTopic(topicIndex, { title: e.target.value })}
                    className="mt-1"
                  />
                </div>
                
                {topic.subtopics.map((sub, subIndex) => (
                  <Card key={sub.id} className="border-l-2 border-l-gold/50">
                    <CardHeader className="py-2 px-3">
                      <CardTitle className="text-xs font-sans flex items-center gap-2">
                        <span className="text-gold font-bold">{sub.number}.</span>
                        Subtópico
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 px-3 space-y-2">
                      <div>
                        <Label className="text-xs">Título</Label>
                        <Input 
                          value={sub.title}
                          onChange={(e) => updateSubtopic(topicIndex, subIndex, { title: e.target.value })}
                          className="mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Conteúdo</Label>
                        <Textarea 
                          value={sub.content}
                          onChange={(e) => updateSubtopic(topicIndex, subIndex, { content: e.target.value })}
                          className="mt-1 min-h-[80px] text-sm font-body"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}

        {/* Conclusão */}
        <AccordionItem value="conclusion" className="border rounded-lg bg-card">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-burgundy" />
              <span className="font-sans font-medium">Conclusão</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <Textarea 
              value={content.conclusion}
              onChange={(e) => updateField('conclusion', e.target.value)}
              className="min-h-[100px] font-body text-sm"
            />
          </AccordionContent>
        </AccordionItem>

        {/* Subsídios Teológicos */}
        <AccordionItem value="subsidies" className="border rounded-lg bg-card">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-gold" />
              <span className="font-sans font-medium">Subsídios Teológicos</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <Textarea 
              value={content.theologicalSubsidies}
              onChange={(e) => updateField('theologicalSubsidies', e.target.value)}
              className="min-h-[150px] font-body text-sm"
            />
          </AccordionContent>
        </AccordionItem>

        {/* Perguntas para Reflexão */}
        <AccordionItem value="questions" className="border rounded-lg bg-card">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-navy" />
              <span className="font-sans font-medium">Perguntas para Reflexão</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-3">
              {content.reflectionQuestions.map((q, index) => (
                <div key={q.id}>
                  <Label className="text-xs">Pergunta {q.number}</Label>
                  <Textarea 
                    value={q.question}
                    onChange={(e) => updateQuestion(index, { question: e.target.value })}
                    className="mt-1 min-h-[60px] text-sm"
                  />
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
