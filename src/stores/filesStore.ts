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
  setFiles: (fs: UploadFileMeta[]) => void;
  addMany: (fs: UploadFileMeta[]) => void;
  deleteById: (id: string) => void;
  clear: () => void;
}

export const useFilesStore = create<FilesState>((set) => ({
  files: [],

  setFiles: (
    fs // แทนที่ทั้งก้อน
  ) => set({ files: dedup(fs) }),

  addMany: (
    fs // เติมเข้า list เดิม
  ) => set((s) => ({ files: dedup([...s.files, ...fs]) })),

  deleteById: (id) => set((s) => ({ files: s.files.filter((f) => f.id !== id) })),

  clear: () => set({ files: [] }),
}));

/* ---------- util: ลบซ้ำโดย filename (ไม่สน id) ---------- */
function dedup(arr: UploadFileMeta[]) {
  const seen = new Set<string>();
  return arr.filter((f) => {
    const name = f.filename.toLowerCase();
    if (seen.has(name)) return false;
    seen.add(name);
    return true;
  });
}
