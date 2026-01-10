import React, { useState, useRef } from 'react';
import { MagazineContent, defaultContent } from '@/types/magazine';
import { ContentEditor } from '@/components/magazine/ContentEditor';
import { MagazinePreview } from '@/components/magazine/MagazinePreview';
import { usePdfExport } from '@/hooks/usePdfExport';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Edit3, Eye, BookOpen, Loader2 } from 'lucide-react';

const Index = () => {
  const [content, setContent] = useState<MagazineContent>(defaultContent);
  const [activeTab, setActiveTab] = useState('editor');
  const previewRef = useRef<HTMLDivElement>(null);
  const { exportToPdf, isExporting } = usePdfExport();

  const handleExportPdf = () => {
    const filename = `revista-ebd-${content.lessonNumber.toLowerCase().replace(/\s+/g, '-')}.pdf`;
    exportToPdf(previewRef.current, filename);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-burgundy text-primary-foreground py-4 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            <div>
              <h1 className="font-display text-xl font-bold tracking-wide">
                Diagramação de Revista EBD
              </h1>
              <p className="text-xs text-primary-foreground/70">
                Estilo CPAD • Layout Profissional
              </p>
            </div>
          </div>
          
          <Button 
            onClick={handleExportPdf}
            disabled={isExporting}
            className="bg-gold hover:bg-gold/90 text-foreground font-semibold gap-2"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Gerando PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Baixar PDF
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Mobile Tabs */}
        <div className="lg:hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="editor" className="flex-1 gap-2">
                <Edit3 className="w-4 h-4" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex-1 gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="mt-0">
              <div className="bg-card rounded-lg border p-4">
                <h2 className="font-display text-lg font-semibold text-burgundy mb-4 flex items-center gap-2">
                  <Edit3 className="w-5 h-5" />
                  Editor de Conteúdo
                </h2>
                <ContentEditor content={content} onChange={setContent} />
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="mt-0">
              <div className="overflow-x-auto pb-4">
                <div className="transform scale-[0.45] origin-top-left w-[222%]">
                  <MagazinePreview ref={previewRef} content={content} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-[400px_1fr] gap-6">
          {/* Editor Panel */}
          <div className="bg-card rounded-lg border p-4 h-fit sticky top-6">
            <h2 className="font-display text-lg font-semibold text-burgundy mb-4 flex items-center gap-2">
              <Edit3 className="w-5 h-5" />
              Editor de Conteúdo
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Edite os campos abaixo. A diagramação será atualizada automaticamente no preview.
            </p>
            <ContentEditor content={content} onChange={setContent} />
          </div>

          {/* Preview Panel */}
          <div className="overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-burgundy flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Preview da Revista
              </h2>
              <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                6 páginas • Formato A4
              </span>
            </div>
            <div className="transform scale-[0.6] origin-top-left w-[166.67%]">
              <MagazinePreview ref={previewRef} content={content} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-4 px-6 mt-12 border-t">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            Ferramenta de diagramação para revistas de Escola Bíblica Dominical
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
