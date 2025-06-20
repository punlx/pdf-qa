// src/stores/filesStore.ts

import { create } from 'zustand';

export interface UploadFileMeta {
  id: string;
  filename: string;
  size: number;
  upload_time: string;
}

interface FilesState {
  files: UploadFileMeta[];
  /* setters */
  setFiles: (fs: UploadFileMeta[]) => void;
  addMany: (fs: UploadFileMeta[]) => void;
  deleteById: (id: string) => void; // 🆕
  clear: () => void; // 🆕
}

export const useFilesStore = create<FilesState>((set) => ({
  files: [],

  setFiles: (fs) => set({ files: fs }),

  addMany: (fs) =>
    set((s) => ({
      files: [
        ...s.files,
        ...fs.filter((f) => !s.files.some((e) => e.id === f.id)), // กันซ้ำ
      ],
    })),

  deleteById: (id) => set((s) => ({ files: s.files.filter((f) => f.id !== id) })),

  clear: () => set({ files: [] }),
}));
