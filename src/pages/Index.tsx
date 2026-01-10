import React, { useState, useRef } from 'react';
import { MagazineContent, defaultContent, MagazineImage } from '@/types/magazine';
import { ContentEditor } from '@/components/magazine/ContentEditor';
import { MagazinePreview } from '@/components/magazine/MagazinePreview';
import { usePdfExport } from '@/hooks/usePdfExport';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Edit3, Eye, BookOpen, Loader2, Image } from 'lucide-react';

const Index = () => {
  const [content, setContent] = useState<MagazineContent>(defaultContent);
  const [activeTab, setActiveTab] = useState('editor');
  const previewRef = useRef<HTMLDivElement>(null);
  const { exportToPdf, isExporting } = usePdfExport();

  const handleExportPdf = () => {
    const filename = `revista-ebd-${content.lessonNumber.toLowerCase().replace(/\s+/g, '-')}.pdf`;
    exportToPdf(previewRef.current, filename);
  };

  const handleImageChange = (imageId: string, url: string | null) => {
    setContent(prev => ({
      ...prev,
      images: prev.images.map(img => 
        img.id === imageId ? { ...img, url } : img
      )
    }));
  };

  const imagesWithContent = content.images?.filter(img => img.url).length || 0;
  const totalImageSlots = content.images?.length || 0;

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
                Layout Profissional • 8 páginas • Clique nas áreas para adicionar imagens
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full">
              <Image className="w-4 h-4 text-gold" />
              <span className="text-xs">
                {imagesWithContent}/{totalImageSlots} imagens
              </span>
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
                <div className="transform scale-[0.4] origin-top-left w-[250%]">
                  <MagazinePreview 
                    ref={previewRef} 
                    content={content} 
                    onImageChange={handleImageChange}
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
              Edite os campos abaixo. Clique nas áreas de imagem no preview para adicionar ilustrações.
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
              <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                8 páginas • Formato A4
              </span>
            </div>
            <div className="transform scale-[0.55] origin-top-left w-[181.82%]">
              <MagazinePreview 
                ref={previewRef} 
                content={content} 
                onImageChange={handleImageChange}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-4 px-6 mt-12 border-t">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            Ferramenta de diagramação para revistas de Escola Bíblica Dominical • Layout profissional estilo CPAD
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
