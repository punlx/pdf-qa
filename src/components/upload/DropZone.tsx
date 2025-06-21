// src/components/upload/DropZone.tsx
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';

import { uploadFiles } from '@/api/upload';
import { useFilesStore } from '@/stores/filesStore';
import { useChatStore } from '@/stores/chatStore';

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
// const MAX_SIZE = 300 * 1024; // 300kb *test*

export const DropZone = () => {
  /* ---------- Zustand selectors ---------- */
  const addMany = useFilesStore((s) => s.addMany);
  const curFiles = useFilesStore((s) => s.files);
  const setMemory = useChatStore((s) => s.setMemory);

  const [loading, setLoading] = useState(false);

  /* ---------- onDrop ---------- */
  const onDrop = useCallback(
    async (accepted: File[]) => {
      if (!accepted.length) return;

      /* 1) กันอัปโหลดชื่อซ้ำ */
      const curNames = new Set(curFiles.map((f) => f.filename.toLowerCase()));
      const withoutDup = accepted.filter((f) => !curNames.has(f.name.toLowerCase()));

      if (withoutDup.length === 0) {
        toast.warning('ไฟล์ที่เลือกอัปโหลดไปแล้วทั้งหมด');
        return;
      }
      if (withoutDup.length < accepted.length) {
        toast.info('บางไฟล์ถูกข้ามเพราะมีอยู่แล้ว');
      }

      /* 2) กันไฟล์ใหญ่เกิน 10 MB */
      const oversize = withoutDup.filter((f) => f.size > MAX_SIZE);
      if (oversize.length) {
        const names = oversize
          .slice(0, 3)
          .map((f) => f.name)
          .join(', ');
        toast.error(`ไฟล์ ${names} เกิน 10 MB และจะไม่อัปโหลด`);
      }
      const valid = withoutDup.filter((f) => f.size <= MAX_SIZE);
      if (valid.length === 0) return;

      /* 3) เริ่มอัปโหลด */
      setLoading(true);
      try {
        const data = await uploadFiles(valid);
        addMany(data.files);

        /* refresh MemoryBadge */
        const status = await fetch('http://localhost:8000/api/status').then((r) => r.json());
        setMemory(status.has_memory);

        toast.success(data.message);
      } catch (err: any) {
        toast.error(err?.message ?? 'Upload failed');
      } finally {
        setLoading(false);
      }
    },
    [addMany, curFiles, setMemory]
  );

  /* ---------- react-dropzone ---------- */
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': [] },
    multiple: true,
  });

  /* ---------- UI ---------- */
  return (
    <div
      {...getRootProps()}
      className={`border-dashed border-2 rounded-md flex flex-col items-center
        justify-center p-6 cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-muted/20' : 'border-muted'}`}
    >
      <input {...getInputProps()} />
      {loading ? (
        <>
          <Loader2 className="animate-spin h-6 w-6 mb-2" />
          <p className="text-sm">Uploading…</p>
        </>
      ) : (
        <>
          <UploadCloud className="h-8 w-8 mb-2" />
          <p className="text-sm">
            {isDragActive ? 'ปล่อยไฟล์ที่นี่' : 'ลาก PDF มาวาง หรือคลิกเพื่อเลือกไฟล์ (≤ 10 MB)'}
          </p>
        </>
      )}
    </div>
  );
};
