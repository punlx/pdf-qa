// src/components/upload/UploadPanel.tsx
import { DropZone } from './DropZone';
import { FileList } from './FileList';
import { Button } from '@/components/ui/button'; // 🆕
import { useFilesStore } from '@/stores/filesStore'; // 🆕
import { deleteAllFiles } from '@/api/files'; // 🆕
import { toast } from 'sonner'; // 🆕

export const UploadPanel = () => {
  const files = useFilesStore((s) => s.files); // 🆕
  const clear = useFilesStore((s) => s.clear); // 🆕

  async function handleDeleteAll() {
    if (!files.length) return;
    if (!window.confirm('ลบไฟล์ทั้งหมด?')) return;

    try {
      await deleteAllFiles();
      clear();
      toast.success('ลบไฟล์ทั้งหมดแล้ว');
    } catch (err: any) {
      toast.error(err.message ?? 'ลบไฟล์ไม่สำเร็จ');
    }
  }

  return (
    <div className="w-full md:w-1/3 border-r p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-medium">อัปโหลด PDF</h2>

        {/* ปุ่ม Delete All (ซ่อนถ้าไม่มีไฟล์) */}
        {files.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteAll}
            aria-label="delete all files"
          >
            Delete All
          </Button>
        )}
      </div>

      <DropZone />
      <FileList />
    </div>
  );
};
