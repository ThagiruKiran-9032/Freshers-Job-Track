import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { parseResumeText } from '../utils/resumeParser/parseResume.js';

// Configure pdfjs-dist worker source for browser execution
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

/**
 * Extract plain text & embedded link annotations from PDF ArrayBuffer
 */
export async function extractTextAndLinksFromPDF(arrayBuffer) {
  try {
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    let fullText = '';
    const embeddedLinks = [];

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      let pageText = '';
      let lastY = null;
      for (const item of textContent.items) {
        if (!item.str) continue;
        const currentY = item.transform ? item.transform[5] : null;
        if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 4) {
          pageText += '\n';
        } else if (pageText.length > 0 && !pageText.endsWith('\n') && !pageText.endsWith(' ')) {
          pageText += ' ';
        }
        pageText += item.str;
        lastY = currentY;
      }
      fullText += pageText + '\n';

      // Extract Link Annotations from PDF Metadata
      try {
        const annotations = await page.getAnnotations();
        annotations.forEach(annot => {
          if (annot.subtype === 'Link') {
            const rawUrl = annot.url || annot.unsafeUrl || (annot.action && annot.action.url);
            if (rawUrl) {
              const url = rawUrl.trim();
              let label = 'Hyperlink';
              if (url.includes('linkedin.com')) label = 'LinkedIn';
              else if (url.includes('github.com')) label = 'GitHub';
              else if (url.startsWith('mailto:')) label = 'Email';
              else label = 'Portfolio / Website';

              // Avoid duplicate URLs on same page
              if (!embeddedLinks.some(l => l.url === url && l.page === pageNum)) {
                embeddedLinks.push({
                  label,
                  url,
                  source: 'embedded_hyperlink',
                  page: pageNum,
                  confidence: 1.0
                });
              }
            }
          }
        });
      } catch (annotErr) {
        console.warn(`Annotation extraction warning on page ${pageNum}:`, annotErr.message);
      }
    }

    // Plain-text regex URL extraction fallback for visible printed links
    const plainLinks = extractPlainTextUrls(fullText);
    plainLinks.forEach(pl => {
      if (!embeddedLinks.some(el => el.url === pl.url)) {
        embeddedLinks.push(pl);
      }
    });

    return { fullText, links: embeddedLinks };
  } catch (error) {
    console.error('PDF Extraction Error:', error.message);
    throw new Error('We couldn\'t extract readable text or link metadata from this PDF. Try uploading a text-based PDF or DOCX file.');
  }
}

/**
 * Extract plain text & embedded relationship hyperlinks from DOCX ArrayBuffer
 */
export async function extractTextAndLinksFromDOCX(arrayBuffer) {
  try {
    const rawResult = await mammoth.extractRawText({ arrayBuffer });
    const fullText = rawResult.value || '';

    const htmlResult = await mammoth.convertToHtml({ arrayBuffer });
    const html = htmlResult.value || '';
    const embeddedLinks = [];

    // Extract anchor tags from HTML output (which converts w:hyperlink relationships)
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi;
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
      const url = match[1] ? match[1].trim() : '';
      const textLabel = match[2] ? match[2].replace(/<[^>]+>/g, '').trim() : '';

      if (url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:'))) {
        let label = textLabel || 'Hyperlink';
        if (url.includes('linkedin.com')) label = 'LinkedIn';
        else if (url.includes('github.com')) label = 'GitHub';
        else if (url.startsWith('mailto:')) label = 'Email';

        if (!embeddedLinks.some(l => l.url === url)) {
          embeddedLinks.push({
            label,
            url,
            source: 'embedded_hyperlink',
            page: 1,
            confidence: 1.0
          });
        }
      }
    }

    // Plain-text regex URL extraction fallback for visible printed links
    const plainLinks = extractPlainTextUrls(fullText);
    plainLinks.forEach(pl => {
      if (!embeddedLinks.some(el => el.url === pl.url)) {
        embeddedLinks.push(pl);
      }
    });

    return { fullText, links: embeddedLinks };
  } catch (error) {
    console.error('DOCX Extraction Error:', error.message);
    throw new Error('We couldn\'t extract readable text or link metadata from this DOCX file.');
  }
}

/**
 * Fallback: Extract plain text URLs using regex
 */
function extractPlainTextUrls(text = '') {
  const links = [];
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const matches = text.match(urlRegex) || [];

  matches.forEach(rawUrl => {
    const url = rawUrl.replace(/[,\.\)]+$/, '').trim();
    let label = 'Hyperlink';
    if (url.includes('linkedin.com')) label = 'LinkedIn';
    else if (url.includes('github.com')) label = 'GitHub';

    if (!links.some(l => l.url === url)) {
      links.push({
        label,
        url,
        source: 'plain_text_regex',
        page: 1,
        confidence: 0.8
      });
    }
  });

  return links;
}

/**
 * Main Resume Service Entry Point
 */
export async function processResumeFile(file, onStageChange) {
  if (!file) throw new Error('No file provided.');

  const isPDF = file.type === 'application/pdf' || file.name.endsWith('.pdf');
  const isDOCX = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx');

  if (!isPDF && !isDOCX) {
    throw new Error('Unsupported file type. Please upload a PDF or DOCX resume.');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Resume is too large. Please upload a file smaller than 5 MB.');
  }

  if (onStageChange) onStageChange('reading');
  const arrayBuffer = await file.arrayBuffer();

  if (onStageChange) onStageChange('extracting');
  let extracted = { fullText: '', links: [] };

  if (isPDF) {
    extracted = await extractTextAndLinksFromPDF(arrayBuffer);
  } else if (isDOCX) {
    extracted = await extractTextAndLinksFromDOCX(arrayBuffer);
  }

  if (!extracted.fullText || extracted.fullText.trim().length < 20) {
    throw new Error('We couldn\'t extract readable text from this resume. If this is a scanned image PDF, embedded hyperlink destinations cannot be recovered without document text layer metadata.');
  }

  if (onStageChange) onStageChange('parsing');
  const structuredProfile = parseResumeText(extracted.fullText, extracted.links);

  if (onStageChange) onStageChange('completed');
  return {
    rawText: extracted.fullText,
    links: extracted.links,
    profile: structuredProfile
  };
}
