// src/components/upload/DropZone.tsx
import { useCallback, useState } from 'react';
import { uploadFiles } from '@/api/upload';
import { useFilesStore } from '@/stores/filesStore';
import { useChatStore } from '@/stores/chatStore';
import { useDropzone } from 'react-dropzone';
import { Loader2, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';

export const DropZone = () => {
  const addMany = useFilesStore((s) => s.addMany);
  const curFiles = useFilesStore((s) => s.files); // 🆕
  const setMemory = useChatStore((s) => s.setMemory);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(
    async (accepted: File[]) => {
      if (!accepted.length) return;

      /* ---------- กรองชื่อที่ซ้ำแล้ว ---------- */
      const curNames = new Set(curFiles.map((f) => f.filename.toLowerCase()));
      const uniques = accepted.filter((f) => !curNames.has(f.name.toLowerCase()));

      if (!uniques.length) {
        toast.warning('ไฟล์ที่เลือกมีอยู่แล้วทั้งหมด');
        return;
      }
      if (uniques.length < accepted.length) {
        toast.info('บางไฟล์ถูกข้าม เพราะอัปโหลดไว้แล้ว');
      }

      setLoading(true);
      try {
        const data = await uploadFiles(uniques);
        addMany(data.files);
        /* refresh memory badge */
        const status = await fetch('http://localhost:8000/api/status').then((r) => r.json());
        setMemory(status.has_memory);
        toast.success(data.message);
      } catch (err: any) {
        toast.error(err.message ?? 'Upload failed');
      } finally {
        setLoading(false);
      }
    },
    [addMany, curFiles, setMemory]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': [] },
    multiple: true,
  });

  /* --------- UI เดิม --------- */
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
            {isDragActive ? 'ปล่อยไฟล์ที่นี่' : 'ลาก PDF มาวาง หรือคลิกเพื่อเลือกไฟล์'}
          </p>
        </>
      )}
    </div>
  );
};
