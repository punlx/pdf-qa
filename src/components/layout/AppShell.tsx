// src/components/layout/AppShell.tsx
import { type ReactNode } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MemoryBadge } from '@/components/MemoryBadge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useChatStore } from '@/stores/chatStore';
import { useFilesStore } from '@/stores/filesStore';
import { useConfigStore } from '@/stores/configStore';
import { resetSession } from '@/api/reset';
import { client } from '@/api/client';
import { toast } from 'sonner';

export const AppShell = ({ children }: { children: ReactNode }) => {
  /* ---------- stores ---------- */
  const { chatId, reset: resetChat, setMemory } = useChatStore();

  // file-store selectors
  const resetFiles = useFilesStore((s) => s.reset);
  const setFiles = useFilesStore((s) => s.setFiles);

  // config-store selectors (ใช้สองบรรทัดแยกแบบที่คุณทำได้)
  const useStream = useConfigStore((s) => s.useStream);
  const setUseStream = useConfigStore((s) => s.setUseStream);

  /* ---------- handlers ---------- */
  async function handleReset() {
    if (!window.confirm('ล้างแชตและไฟล์ทั้งหมด ?')) return;

    try {
      await resetSession(chatId ? { chat_id: chatId } : {});
      resetChat();
      setMemory(false);

      // ดึงไฟล์ล่าสุดจากเซิร์ฟเวอร์
      const res = await client.get('/api/files');
      if (res.data.total_files === 0) {
        resetFiles();
      } else {
        setFiles(res.data.files);
        toast.info('ไฟล์เดิมยังอยู่ที่เซิร์ฟเวอร์');
      }

      toast.success('รีเซ็ตเรียบร้อย');
    } catch (e: any) {
      toast.error(e.message ?? 'Reset failed');
    }
  }

  /* ---------- render ---------- */
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 h-14 border-b">
        <h1 className="font-semibold">ArcFusion PDF QA</h1>

        <div className="flex items-center gap-4">
          {/* Streaming switch */}
          <div className="flex items-center gap-1 text-xs">
            <span>REST</span>
            <Switch
              checked={useStream}
              onCheckedChange={setUseStream} // ค่า v ถูกส่งเข้าฟังก์ชัน setter
              aria-label="toggle streaming"
            />
            <span>WS</span>
          </div>

          <MemoryBadge />
          <ThemeToggle />
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </header>

      <main className="flex-1 flex">{children}</main>
    </div>
  );
};
