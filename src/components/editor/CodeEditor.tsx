import { Editor } from '@monaco-editor/react';
import { useEditorStore } from '../../store/editorStore';

export function CodeEditor() {
  const { files, activeFileId, updateFileContent } = useEditorStore();
  
  const activeFile = files.find(f => f.id === activeFileId);

  if (!activeFile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#1e1e1e] text-gray-400">
        <div className="text-center">
          <p className="text-xl mb-2">No file open</p>
          <p className="text-sm">Select a file from the sidebar or create a new one.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full w-full">
      <Editor
        height="100%"
        language={activeFile.language}
        theme="vs-dark"
        value={activeFile.content}
        onChange={(value) => updateFileContent(activeFile.id, value || '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          padding: { top: 16 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          formatOnPaste: true,
        }}
      />
    </div>
  );
}
