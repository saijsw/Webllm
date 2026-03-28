import { X } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { cn } from '../../lib/utils';

export function EditorTabs() {
  const { files, openFiles, activeFileId, setActiveFile, closeFile } = useEditorStore();

  if (openFiles.length === 0) return null;

  return (
    <div className="flex bg-[#252526] overflow-x-auto border-b border-[#1e1e1e] scrollbar-hide">
      {openFiles.map((fileId) => {
        const file = files.find(f => f.id === fileId);
        if (!file) return null;

        const isActive = activeFileId === fileId;

        return (
          <div
            key={fileId}
            className={cn(
              "flex items-center gap-2 px-4 py-2 min-w-[120px] max-w-[200px] cursor-pointer border-r border-[#1e1e1e] group transition-colors",
              isActive ? "bg-[#1e1e1e] text-white" : "bg-[#2d2d2d] text-gray-400 hover:bg-[#2a2d2e]"
            )}
            onClick={() => setActiveFile(fileId)}
          >
            <span className="truncate text-sm flex-1 select-none">{file.name}</span>
            <button
              className={cn(
                "p-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#3c3c3c]",
                isActive && "opacity-100"
              )}
              onClick={(e) => {
                e.stopPropagation();
                closeFile(fileId);
              }}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
