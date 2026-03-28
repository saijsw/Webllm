import { useState } from 'react';
import { FileCode, Folder, Plus, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { cn } from '../../lib/utils';

export function Sidebar() {
  const { files, activeFileId, setActiveFile, addFile, deleteFile } = useEditorStore();
  const [isFilesOpen, setIsFilesOpen] = useState(true);

  const handleCreateFile = () => {
    const name = prompt('Enter file name (e.g., index.js):');
    if (!name) return;
    
    let language = 'javascript';
    if (name.endsWith('.ts') || name.endsWith('.tsx')) language = 'typescript';
    if (name.endsWith('.html')) language = 'html';
    if (name.endsWith('.css')) language = 'css';
    if (name.endsWith('.json')) language = 'json';
    if (name.endsWith('.md')) language = 'markdown';

    addFile(name, language);
  };

  return (
    <div className="w-64 bg-[#252526] border-r border-[#1e1e1e] flex flex-col h-full text-gray-300 select-none">
      <div className="p-4 border-b border-[#1e1e1e]">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">Explorer</h2>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {/* Project Folder */}
        <div className="px-2">
          <div 
            className="flex items-center justify-between py-1 px-2 hover:bg-[#2a2d2e] cursor-pointer rounded group"
            onClick={() => setIsFilesOpen(!isFilesOpen)}
          >
            <div className="flex items-center gap-1 font-semibold text-sm">
              {isFilesOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <Folder size={14} className="text-blue-400" />
              <span>MY-PROJECT</span>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleCreateFile();
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#3c3c3c] rounded"
              title="New File"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* File List */}
          {isFilesOpen && (
            <div className="mt-1 ml-4 space-y-0.5">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={cn(
                    "flex items-center justify-between py-1 px-2 cursor-pointer rounded text-sm group",
                    activeFileId === file.id ? "bg-[#37373d] text-white" : "hover:bg-[#2a2d2e]"
                  )}
                  onClick={() => setActiveFile(file.id)}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode size={14} className="text-yellow-500 shrink-0" />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete ${file.name}?`)) deleteFile(file.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#4d4d4d] rounded text-gray-400 hover:text-red-400"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              {files.length === 0 && (
                <div className="text-xs text-gray-500 italic px-2 py-1">
                  No files. Click + to create one.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
