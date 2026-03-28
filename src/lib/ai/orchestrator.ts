import { GoogleGenAI } from '@google/genai';
import { AVAILABLE_MODELS } from '../../store/aiStore';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateCloudResponse(
  prompt: string, 
  modelId: string, 
  onUpdate?: (text: string) => void
): Promise<string> {
  try {
    const responseStream = await ai.models.generateContentStream({
      model: modelId,
      contents: prompt,
    });

    let fullText = '';
    for await (const chunk of responseStream) {
      fullText += chunk.text;
      if (onUpdate) {
        onUpdate(fullText);
      }
    }
    return fullText;
  } catch (error) {
    console.error('Cloud generation error:', error);
    throw new Error('Failed to generate response from cloud model.');
  }
}

export async function orchestrateAI(
  prompt: string,
  activeModelId: string,
  localGenerate: (prompt: string, onUpdate?: (text: string) => void) => Promise<string>,
  onUpdate?: (text: string) => void
): Promise<string> {
  const model = AVAILABLE_MODELS.find(m => m.id === activeModelId);

  if (!model) {
    throw new Error('Selected model not found.');
  }

  if (model.type === 'local') {
    try {
      return await localGenerate(prompt, onUpdate);
    } catch (error) {
      console.warn('Local generation failed, falling back to cloud...', error);
      // Fallback to Gemini 3 Flash Preview
      return await generateCloudResponse(prompt, 'gemini-3-flash-preview', onUpdate);
    }
  } else {
    return await generateCloudResponse(prompt, model.id, onUpdate);
  }
}
