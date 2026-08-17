/**
 * PDF File Validation Utility
 */

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB Limit

export function validateResumeFile(file) {
  if (!file) {
    return {
      isValid: false,
      error: 'No file selected. Please choose a PDF resume file.'
    };
  }

  // File extension & MIME type check
  const isPdfExtension = file.name.toLowerCase().endsWith('.pdf');
  const isPdfMime = file.type === 'application/pdf' || file.type === '';

  if (!isPdfExtension && !isPdfMime) {
    return {
      isValid: false,
      error: 'Please upload a PDF resume (.pdf extension).'
    };
  }

  // Size limit check
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      error: `This file (${sizeMb}MB) is larger than the allowed size limit (Max 5MB).`
    };
  }

  return {
    isValid: true,
    error: null
  };
}

export function validateExtractedText(text) {
  if (!text || !text.trim() || text.trim().length < 30) {
    return {
      isValid: false,
      error: 'No readable text was found in this resume. If this is a scanned image PDF, please upload a text-based PDF.'
    };
  }

  return {
    isValid: true,
    error: null
  };
}
