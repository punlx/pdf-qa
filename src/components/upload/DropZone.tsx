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
  const setMemory = useChatStore((s) => s.setMemory);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(
    async (accepted: File[]) => {
      if (!accepted.length) return;
      setLoading(true);
      try {
        const data = await uploadFiles(accepted);
        addMany(data.files);

        /** รีเฟรช status เพื่อ MemoryBadge */
        const statusRes = await fetch('http://localhost:8000/api/status');
        const status = await statusRes.json();
        setMemory(status.has_memory);

        toast.success(data.message);
      } catch (err: any) {
        toast.error(err.message ?? 'Upload failed');
      } finally {
        setLoading(false);
      }
    },
    [addMany, setMemory]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': [] },
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-dashed border-2 rounded-md flex flex-col items-center justify-center
          p-6 cursor-pointer transition-colors
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
