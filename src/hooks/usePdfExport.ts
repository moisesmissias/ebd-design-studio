import { useCallback, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const usePdfExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPdf = useCallback(async (
    element: HTMLElement | null,
    filename: string = 'revista-ebd.pdf'
  ) => {
    if (!element) {
      console.error('Elemento não encontrado para exportação');
      return;
    }

    setIsExporting(true);

    try {
      // Encontrar todas as páginas da revista
      const pages = element.querySelectorAll('.magazine-page');
      
      if (pages.length === 0) {
        console.error('Nenhuma página encontrada');
        return;
      }

      // Criar PDF em formato A4
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        
        // Capturar a página como canvas
        const canvas = await html2canvas(page, {
          scale: 2, // Maior qualidade
          useCORS: true,
          logging: false,
          backgroundColor: '#FDFCF8', // Cor ivory
          windowWidth: page.scrollWidth,
          windowHeight: page.scrollHeight,
        });

        // Converter canvas para imagem
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        
        // Adicionar nova página (exceto para a primeira)
        if (i > 0) {
          pdf.addPage();
        }

        // Calcular dimensões para manter proporção
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        // Centralizar verticalmente se necessário
        const yOffset = imgHeight < pdfHeight ? (pdfHeight - imgHeight) / 2 : 0;

        pdf.addImage(imgData, 'JPEG', 0, yOffset, imgWidth, imgHeight);
      }

      // Salvar o PDF
      pdf.save(filename);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
    } finally {
      setIsExporting(false);
    }
  }, []);

  return { exportToPdf, isExporting };
};
