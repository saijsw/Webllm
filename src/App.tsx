import { useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CodeEditor } from './components/editor/CodeEditor';
import { EditorTabs } from './components/editor/EditorTabs';
import { ChatInterface } from './components/ai/ChatInterface';
import { useEditorStore } from './store/editorStore';

export default function App() {
  const { addFile, files } = useEditorStore();

  // Initialize with a default file if empty
  useEffect(() => {
    if (files.length === 0) {
      addFile(
        'index.js',
        'javascript',
        '// Welcome to WebLLM AI Code Editor\n// Start typing or ask the AI assistant for help!\n\nfunction calculateFibonacci(n) {\n  if (n <= 1) return n;\n  return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);\n}\n\nconsole.log(calculateFibonacci(10));\n'
      );
    }
  }, [addFile, files.length]);

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e] text-gray-300 font-sans overflow-hidden">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - File Explorer */}
        <Sidebar />
        
        {/* Main Editor Area */}
        <div className="flex flex-col flex-1 min-w-0">
          <EditorTabs />
          <div className="flex-1 relative">
            <CodeEditor />
          </div>
        </div>

        {/* Right Sidebar - AI Chat */}
        <ChatInterface />
      </div>
    </div>
  );
}
