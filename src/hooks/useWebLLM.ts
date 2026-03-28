import { useEffect, useRef, useCallback } from 'react';
import { CreateWebWorkerMLCEngine, InitProgressReport, WebWorkerMLCEngine } from '@mlc-ai/web-llm';
import { useAIStore, AVAILABLE_MODELS } from '../store/aiStore';

export function useWebLLM() {
  const engineRef = useRef<WebWorkerMLCEngine | null>(null);
  const { 
    activeModelId, 
    setModelLoadingProgress, 
    setModelLoaded, 
    isModelLoaded 
  } = useAIStore();

  const initProgressCallback = useCallback((report: InitProgressReport) => {
    setModelLoadingProgress(report.progress, report.text);
  }, [setModelLoadingProgress]);

  const loadModel = useCallback(async (modelId: string) => {
    try {
      setModelLoaded(false);
      setModelLoadingProgress(0, 'Initializing Web Worker...');
      
      // Create a new worker
      const worker = new Worker(
        new URL('../lib/ai/worker.ts', import.meta.url),
        { type: 'module' }
      );

      // Initialize the engine with the worker
      const engine = await CreateWebWorkerMLCEngine(
        worker,
        modelId,
        { initProgressCallback }
      );

      engineRef.current = engine;
      setModelLoaded(true);
      setModelLoadingProgress(1, 'Ready');
    } catch (error) {
      console.error('Failed to load WebLLM model:', error);
      setModelLoadingProgress(0, 'Failed to load model. Please try again.');
      setModelLoaded(false);
    }
  }, [initProgressCallback, setModelLoaded, setModelLoadingProgress]);

  // Load model when activeModelId changes and it's a local model
  useEffect(() => {
    const model = AVAILABLE_MODELS.find(m => m.id === activeModelId);
    if (model?.type === 'local') {
      loadModel(activeModelId);
    } else {
      // If switching to cloud, we don't need the local model loaded
      setModelLoaded(true); // Cloud is always "loaded"
      setModelLoadingProgress(1, 'Using Cloud Model');
    }

    return () => {
      // Cleanup engine if needed
      if (engineRef.current) {
        // WebLLM doesn't have a direct destroy method on the engine interface yet,
        // but the worker will be terminated when the component unmounts.
      }
    };
  }, [activeModelId, loadModel, setModelLoaded, setModelLoadingProgress]);

  const generateResponse = async (prompt: string, onUpdate?: (text: string) => void): Promise<string> => {
    if (!engineRef.current) {
      throw new Error('Engine not initialized');
    }

    try {
      const chunks = await engineRef.current.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      });

      let fullText = '';
      for await (const chunk of chunks) {
        const text = chunk.choices[0]?.delta?.content || '';
        fullText += text;
        if (onUpdate) {
          onUpdate(fullText);
        }
      }
      return fullText;
    } catch (error) {
      console.error('Generation error:', error);
      throw error;
    }
  };

  return { generateResponse, isReady: isModelLoaded };
}
