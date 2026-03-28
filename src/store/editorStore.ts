import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { File, Project } from '../types';

interface EditorState {
  activeProject: Project | null;
  files: File[];
  activeFileId: string | null;
  openFiles: string[]; // Array of file IDs currently open in tabs
  
  setActiveProject: (project: Project | null) => void;
  setFiles: (files: File[]) => void;
  addFile: (name: string, language: string, content?: string) => void;
  updateFileContent: (id: string, content: string) => void;
  deleteFile: (id: string) => void;
  setActiveFile: (id: string | null) => void;
  closeFile: (id: string) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  activeProject: null,
  files: [],
  activeFileId: null,
  openFiles: [],

  setActiveProject: (project) => set({ activeProject: project }),
  
  setFiles: (files) => set({ files }),
  
  addFile: (name, language, content = '') => {
    const newFile: File = {
      id: uuidv4(),
      projectId: get().activeProject?.id || 'local',
      name,
      language,
      content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    set((state) => ({
      files: [...state.files, newFile],
      openFiles: [...state.openFiles, newFile.id],
      activeFileId: newFile.id,
    }));
  },
  
  updateFileContent: (id, content) => {
    set((state) => ({
      files: state.files.map((f) => 
        f.id === id ? { ...f, content, updatedAt: Date.now() } : f
      ),
    }));
  },
  
  deleteFile: (id) => {
    set((state) => {
      const newFiles = state.files.filter((f) => f.id !== id);
      const newOpenFiles = state.openFiles.filter((fid) => fid !== id);
      
      let newActiveFileId = state.activeFileId;
      if (state.activeFileId === id) {
        newActiveFileId = newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null;
      }
      
      return {
        files: newFiles,
        openFiles: newOpenFiles,
        activeFileId: newActiveFileId,
      };
    });
  },
  
  setActiveFile: (id) => {
    set((state) => {
      if (!id) return { activeFileId: null };
      
      const newOpenFiles = state.openFiles.includes(id) 
        ? state.openFiles 
        : [...state.openFiles, id];
        
      return {
        activeFileId: id,
        openFiles: newOpenFiles,
      };
    });
  },
  
  closeFile: (id) => {
    set((state) => {
      const newOpenFiles = state.openFiles.filter((fid) => fid !== id);
      let newActiveFileId = state.activeFileId;
      
      if (state.activeFileId === id) {
        newActiveFileId = newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null;
      }
      
      return {
        openFiles: newOpenFiles,
        activeFileId: newActiveFileId,
      };
    });
  }
}));
