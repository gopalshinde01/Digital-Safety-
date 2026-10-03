import { createWorker } from 'tesseract.js';

export async function extractTextFromImage(imageFile, progressCallback = null) {
  try {
    const worker = await createWorker('eng');
    
    if (progressCallback) {
      // Monitor status if needed
      progressCallback({ status: 'initializing', progress: 0.2 });
    }

    const ret = await worker.recognize(imageFile);
    await worker.terminate();

    return {
      success: true,
      text: ret.data.text.trim(),
      confidence: ret.data.confidence
    };
  } catch (err) {
    console.error('Tesseract OCR error:', err);
    return {
      success: false,
      error: err.message || 'OCR processing failed'
    };
  }
}
