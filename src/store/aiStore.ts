import { create } from 'zustand';
import { ChatMessage, AIModel } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const AVAILABLE_MODELS: AIModel[] = [
  {
    id: 'Llama-3.2-1B-Instruct-q4f16_1-MLC',
    name: 'Llama 3.2 1B (Local)',
    type: 'local',
    description: 'Fast, lightweight local model running in your browser.',
    size: '~800MB'
  },
  {
    id: 'Llama-3.2-3B-Instruct-q4f16_1-MLC',
    name: 'Llama 3.2 3B (Local)',
    type: 'local',
    description: 'More capable local model, requires more RAM.',
    size: '~2GB'
  },
  {
    id: 'gemini-3-flash-preview',
    name: 'Gemini 3 Flash (Cloud)',
    type: 'cloud',
    description: 'Fast cloud model via Google AI Studio.'
  }
];

interface AIState {
  messages: ChatMessage[];
  isGenerating: boolean;
  activeModelId: string;
  modelLoadingProgress: number;
  modelLoadingText: string;
  isModelLoaded: boolean;
  
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setGenerating: (isGenerating: boolean) => void;
  setActiveModel: (modelId: string) => void;
  setModelLoadingProgress: (progress: number, text: string) => void;
  setModelLoaded: (isLoaded: boolean) => void;
  clearMessages: () => void;
}

export const useAIStore = create<AIState>((set) => ({
  messages: [
    {
      id: 'system-1',
      role: 'assistant',
      content: 'Hello! I am your AI coding assistant. I can help you write, refactor, and debug code. I can run entirely locally in your browser using WebLLM, or use cloud models for more complex tasks.',
      timestamp: Date.now(),
    }
  ],
  isGenerating: false,
  activeModelId: AVAILABLE_MODELS[0].id,
  modelLoadingProgress: 0,
  modelLoadingText: '',
  isModelLoaded: false,

  addMessage: (msg) => set((state) => ({
    messages: [...state.messages, { ...msg, id: uuidv4(), timestamp: Date.now() }]
  })),
  
  setGenerating: (isGenerating) => set({ isGenerating }),
  
  setActiveModel: (modelId) => set({ activeModelId: modelId }),
  
  setModelLoadingProgress: (progress, text) => set({ 
    modelLoadingProgress: progress, 
    modelLoadingText: text 
  }),
  
  setModelLoaded: (isLoaded) => set({ isModelLoaded: isLoaded }),
  
  clearMessages: () => set({ messages: [] })
}));
