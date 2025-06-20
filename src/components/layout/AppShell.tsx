import { type ReactNode } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MemoryBadge } from '@/components/MemoryBadge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

import { useChatStore } from '@/stores/chatStore';
import { useFilesStore } from '@/stores/filesStore';
import { useConfigStore } from '@/stores/configStore';
import { resetSession } from '@/api/reset';
import { client } from '@/api/client';
import { toast } from 'sonner';
import { UploadPanel } from '@/components/upload/UploadPanel';

export const AppShell = ({ children }: { children: ReactNode }) => {
  /* ---------- stores ---------- */
  const { chatId, reset: resetChat, setMemory } = useChatStore();
  const clearFiles = useFilesStore((s) => s.clear);
  const setFiles = useFilesStore((s) => s.setFiles);

  const useStream = useConfigStore((s) => s.useStream);
  const setUseStream = useConfigStore((s) => s.setUseStream);

  /* ---------- reset chat (ไม่ลบไฟล์) ---------- */
  async function handleReset() {
    if (!window.confirm('ล้างแชตและไฟล์ทั้งหมด ?')) return;

    try {
      await resetSession(chatId ? { chat_id: chatId } : {});
      resetChat();
      setMemory(false);

      const res = await client.get('/api/files');
      if (res.data.total_files === 0) {
        clearFiles();
      } else {
        setFiles(res.data.files);
        toast.info('ไฟล์เดิมยังอยู่ที่เซิร์ฟเวอร์');
      }
      toast.success('รีเซ็ตเรียบร้อย');
    } catch (e: any) {
      toast.error(e.message ?? 'Reset failed');
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* ---------- HEADER ---------- */}
      <header className="flex items-center justify-between px-4 h-14 border-b">
        <div className="flex items-center gap-2">
          {/* hamburger – mobile only */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="open upload">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="p-0 w-80">
              {/* UploadPanel ใน Drawer */}
              <UploadPanel compact />
            </SheetContent>
          </Sheet>

          <h1 className="font-semibold whitespace-nowrap">PDF QA</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Streaming switch */}
          <div className="flex items-center gap-1 text-xs">
            <span>REST</span>
            <Switch
              checked={useStream}
              onCheckedChange={setUseStream}
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

      {/* ---------- BODY ---------- */}
      <main className="flex-1 flex">{children}</main>
    </div>
  );
};
