import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, AlertCircle } from 'lucide-react';
import { useAIStore, AVAILABLE_MODELS } from '../../store/aiStore';
import { useUserStore } from '../../store/userStore';
import { useWebLLM } from '../../hooks/useWebLLM';
import { orchestrateAI } from '../../lib/ai/orchestrator';
import { cn } from '../../lib/utils';
import ReactMarkdown from 'react-markdown';

export function ChatInterface() {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    addMessage, 
    isGenerating, 
    setGenerating,
    activeModelId,
    setActiveModel,
    modelLoadingProgress,
    modelLoadingText,
    isModelLoaded
  } = useAIStore();

  const { user, decrementCredits } = useUserStore();
  const { generateResponse: localGenerate } = useWebLLM();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const selectedModel = AVAILABLE_MODELS.find(m => m.id === activeModelId);
    
    // Check credits for cloud models
    if (selectedModel?.type === 'cloud' && user && !user.isPro && user.credits <= 0) {
      addMessage({ 
        role: 'system', 
        content: 'You have run out of credits for cloud models. Please upgrade to Pro or switch to a local model.' 
      });
      return;
    }

    const userPrompt = input.trim();
    setInput('');
    
    // Add user message
    addMessage({ role: 'user', content: userPrompt });
    setGenerating(true);

    try {
      // Create a placeholder for the assistant's response
      addMessage({ role: 'assistant', content: '' });

      // Orchestrate AI call (Local with Cloud Fallback)
      const response = await orchestrateAI(
        userPrompt,
        activeModelId,
        localGenerate,
        (text) => {
          // In a real app, we'd update the specific message in the store
          // For simplicity here, we'll just wait for the full response
        }
      );

      // Update the last message with the full response
      useAIStore.setState((state) => {
        const newMessages = [...state.messages];
        newMessages[newMessages.length - 1].content = response;
        return { messages: newMessages };
      });

      // Decrement credits if a cloud model was used
      if (selectedModel?.type === 'cloud') {
        decrementCredits();
      }

    } catch (error) {
      console.error('Chat error:', error);
      addMessage({ 
        role: 'system', 
        content: 'Failed to generate response. Please check your connection or try a different model.' 
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border-l border-[#2d2d2d] w-80 lg:w-96">
      {/* Header & Model Selector */}
      <div className="p-4 border-b border-[#2d2d2d] bg-[#252526]">
        <h2 className="text-sm font-semibold text-gray-200 mb-2">AI Assistant</h2>
        <select 
          className="w-full bg-[#3c3c3c] text-sm text-gray-200 rounded px-2 py-1.5 border-none outline-none focus:ring-1 focus:ring-blue-500"
          value={activeModelId}
          onChange={(e) => setActiveModel(e.target.value)}
          disabled={isGenerating}
        >
          {AVAILABLE_MODELS.map(model => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
        
        {/* Loading Progress for Local Models */}
        {AVAILABLE_MODELS.find(m => m.id === activeModelId)?.type === 'local' && !isModelLoaded && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>Loading Model...</span>
              <span>{Math.round(modelLoadingProgress * 100)}%</span>
            </div>
            <div className="w-full bg-[#3c3c3c] rounded-full h-1.5">
              <div 
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${modelLoadingProgress * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-500 mt-1 truncate">{modelLoadingText}</p>
          </div>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#424242] scrollbar-track-transparent">
        {messages.map((msg, idx) => (
          <div 
            key={msg.id || idx} 
            className={cn(
              "flex gap-3 text-sm",
              msg.role === 'user' ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              msg.role === 'user' ? "bg-blue-600" : msg.role === 'system' ? "bg-red-900/50 text-red-400" : "bg-[#3c3c3c]"
            )}>
              {msg.role === 'user' ? <User size={16} /> : msg.role === 'system' ? <AlertCircle size={16} /> : <Bot size={16} />}
            </div>
            <div className={cn(
              "max-w-[80%] rounded-lg px-3 py-2",
              msg.role === 'user' ? "bg-blue-600 text-white" : msg.role === 'system' ? "bg-red-900/20 text-red-400 border border-red-900/50" : "bg-[#2d2d2d] text-gray-200"
            )}>
              {msg.role === 'user' ? (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <div className="markdown-body prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{msg.content || '...'}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {isGenerating && (
          <div className="flex gap-3 text-sm">
            <div className="w-8 h-8 rounded-full bg-[#3c3c3c] flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-[#2d2d2d] text-gray-200 rounded-lg px-4 py-3 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-blue-400" />
              <span className="text-gray-400 text-xs">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#252526] border-t border-[#2d2d2d]">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={isModelLoaded ? "Ask AI to write or explain code..." : "Waiting for model..."}
            disabled={!isModelLoaded || isGenerating}
            className="w-full bg-[#3c3c3c] text-sm text-gray-200 rounded-lg pl-3 pr-10 py-3 resize-none outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            rows={3}
          />
          <button
            type="submit"
            disabled={!input.trim() || !isModelLoaded || isGenerating}
            className="absolute right-2 bottom-2 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
        <p className="text-[10px] text-gray-500 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line.
        </p>
      </div>
    </div>
  );
}
