import React, { useState, useRef } from 'react';
import { MagazineContent, defaultContent, PageImage } from '@/types/magazine';
import { ContentEditor } from '@/components/magazine/ContentEditor';
import { MagazinePreview } from '@/components/magazine/MagazinePreview';
import { usePdfExport } from '@/hooks/usePdfExport';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Edit3, Eye, BookOpen, Loader2, Image, FileText } from 'lucide-react';

const Index = () => {
  const [content, setContent] = useState<MagazineContent>(defaultContent);
  const [activeTab, setActiveTab] = useState('editor');
  const previewRef = useRef<HTMLDivElement>(null);
  const { exportToPdf, isExporting } = usePdfExport();

  const handleExportPdf = () => {
    const filename = `revista-ebd-${content.lessonNumber.toLowerCase().replace(/\s+/g, '-')}.pdf`;
    exportToPdf(previewRef.current, filename);
  };

  const handlePageImagesChange = (pageId: string, images: PageImage[]) => {
    setContent(prev => ({
      ...prev,
      pageImages: prev.pageImages.map(page => 
        page.id === pageId ? { ...page, images } : page
      )
    }));
  };

  // Count total images with content
  const imagesWithContent = content.pageImages?.reduce((total, page) => 
    total + page.images.filter(img => img.url).length, 0) || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-burgundy text-primary-foreground py-4 px-6 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            <div>
              <h1 className="font-display text-xl font-bold tracking-wide">
                Diagramação de Revista EBD
              </h1>
              <p className="text-xs text-primary-foreground/70">
                Layout Profissional • Clique em + para adicionar imagens
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full">
              <Image className="w-4 h-4 text-gold" />
              <span className="text-xs">
                {imagesWithContent} imagens
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Botão de PDF Fixo - Sempre visível */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={handleExportPdf}
          disabled={isExporting}
          size="lg"
          className="bg-gold hover:bg-gold/90 text-foreground font-semibold gap-2 shadow-2xl h-14 px-6 rounded-full"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="hidden sm:inline">Gerando...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Baixar PDF</span>
            </>
          )}
        </Button>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 pb-24">
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
                <div className="transform scale-[0.4] origin-top-left w-[250%]">
                  <MagazinePreview 
                    ref={previewRef} 
                    content={content} 
                    onPageImagesChange={handlePageImagesChange}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-[380px_1fr] gap-6">
          {/* Editor Panel */}
          <div className="bg-card rounded-lg border p-4 h-fit sticky top-24">
            <h2 className="font-display text-lg font-semibold text-burgundy mb-2 flex items-center gap-2">
              <Edit3 className="w-5 h-5" />
              Editor de Conteúdo
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Edite os campos abaixo. Clique em <strong>+</strong> no preview para adicionar imagens.
            </p>
            <ContentEditor content={content} onChange={setContent} />
          </div>

          {/* Preview Panel */}
          <div className="overflow-x-auto">
            <div className="flex items-center justify-between mb-4 sticky top-24 bg-background py-2 z-10">
              <h2 className="font-display text-lg font-semibold text-burgundy flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Preview da Revista
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full flex items-center gap-2">
                  <FileText className="w-3 h-3" />
                  9 páginas • Formato A4
                </span>
              </div>
            </div>
            <div className="transform scale-[0.55] origin-top-left w-[181.82%]">
              <MagazinePreview 
                ref={previewRef} 
                content={content} 
                onPageImagesChange={handlePageImagesChange}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-4 px-6 mt-12 border-t">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            Ferramenta de diagramação para revistas de Escola Bíblica Dominical • Layout profissional com 9 páginas incluindo capa e contracapa
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
