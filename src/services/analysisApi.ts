import { AnalysisReport } from '../types/analysisTypes';
import { sanitizeAnalysisResponse } from '../utils/validation';

export async function checkServerHealth(): Promise<{ status: string; hasApiKey: boolean }> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    return { status: 'offline', hasApiKey: false };
  }
}

export async function analyzeScreenshotImage(
  base64Data: string,
  mimeType: string,
  filename?: string
): Promise<AnalysisReport> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

  try {
    const response = await fetch('/api/analyze-screenshot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        imageBase64: base64Data,
        mimeType: mimeType || 'image/png',
        filename: filename || 'screenshot.png'
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `Server error (${response.status})`;
      try {
        const errorJson = await response.json();
        if (errorJson.error) {
          errorMessage = errorJson.error;
        }
      } catch {
        // use default message
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return sanitizeAnalysisResponse(data);
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Analysis timed out. The image may be too large or the AI service took too long to respond. Please try again.');
    }
    throw error;
  }
}
