import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

/**
 * Extract raw text from PDF File ArrayBuffer with proper line break reconstruction
 * @param {File} file - PDF File object
 * @returns {Promise<string>} - Extracted text string with line breaks
 */
export async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;

    let fullText = '';
    const numPages = pdfDoc.numPages;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();

      let pageLines = [];
      let currentLine = '';
      let lastY = null;

      for (const item of textContent.items) {
        const str = item.str;
        const transform = item.transform;
        const currentY = transform ? transform[5] : null;

        // Check if Y coordinate shifted significantly or item has EOL flag
        const isNewYLine = lastY !== null && currentY !== null && Math.abs(lastY - currentY) > 4;

        if (isNewYLine || item.hasEOL) {
          if (currentLine.trim()) {
            pageLines.push(currentLine.trim());
          }
          currentLine = str;
        } else {
          currentLine += (currentLine ? ' ' : '') + str;
        }

        if (currentY !== null) {
          lastY = currentY;
        }
      }

      if (currentLine.trim()) {
        pageLines.push(currentLine.trim());
      }

      const pageText = pageLines.join('\n');
      if (pageText.trim()) {
        fullText += pageText + '\n\n';
      }
    }

    return fullText.trim();
  } catch (error) {
    console.error('Error extracting text via PDF.js:', error);
    throw new Error('We couldn\'t read this PDF file. It might be corrupted or password protected.');
  }
}
