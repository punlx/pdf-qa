import { DropZone } from './DropZone';
import { FileList } from './FileList';
import { Button } from '@/components/ui/button';
import { useFilesStore } from '@/stores/filesStore';
import { deleteAllFiles } from '@/api/files';
import { toast } from 'sonner';
import { cn } from '@/lib/utils'; // ฟังก์ชันรวมคลาส shadcn

interface UploadPanelProps {
  compact?: boolean; // = true เมื่ออยู่ใน Drawer
}

export const UploadPanel = ({ compact = false }: UploadPanelProps) => {
  const files = useFilesStore((s) => s.files);
  const clear = useFilesStore((s) => s.clear);

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
    <div
      className={cn(
        compact ? 'w-full max-w-sm h-full' : 'w-md border-r h-[calc(100vh-56px)]',
        'p-4 overflow-auto'
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-medium">อัปโหลด PDF</h2>
      </div>

      <DropZone />
      <div className="flex justify-end w-full pr-4 mt-6">
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

      <FileList />
    </div>
  );
};
