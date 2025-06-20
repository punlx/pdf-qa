import { create } from 'zustand';

export interface UploadFileMeta {
  id: string;
  filename: string;
  size: number;
  upload_time: string;
}

interface FilesState {
  files: UploadFileMeta[];
  setFiles: (fs: UploadFileMeta[]) => void;
  addMany: (fs: UploadFileMeta[]) => void; // 🆕
  reset: () => void;
}

export const useFilesStore = create<FilesState>((set) => ({
  files: [],
  setFiles: (fs) => set({ files: fs }),
  addMany: (fs) => set((s) => ({ files: [...s.files, ...fs] })),
  reset: () => set({ files: [] }),
}));
