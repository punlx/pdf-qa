// src/components/layout/AppShell.tsx
import { useState, useEffect, type ReactNode } from 'react';
import { Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MemoryBadge } from '@/components/MemoryBadge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';

import { UploadPanel } from '@/components/upload/UploadPanel';

import { useChatStore } from '@/stores/chatStore';
import { useFilesStore } from '@/stores/filesStore';
import { useConfigStore } from '@/stores/configStore';
import { resetSession } from '@/api/reset';
import { client } from '@/api/client';
import { toast } from 'sonner';

export const AppShell = ({ children }: { children: ReactNode }) => {
  /* ──────────── Zustand selectors ──────────── */
  const { chatId, reset: resetChat, setMemory } = useChatStore();

  const clearFiles = useFilesStore((s) => s.clear);
  const setFiles = useFilesStore((s) => s.setFiles);

  const useStream = useConfigStore((s) => s.useStream);
  const setUseStream = useConfigStore((s) => s.setUseStream);

  /* ──────────── Drawer state ──────────── */
  const [drawerOpen, setDrawerOpen] = useState(false);

  /* ปิด Drawer เมื่อ viewport ≥ 1024px (lg) */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const closeDrawer = (ev: MediaQueryListEvent) => {
      if (ev.matches) setDrawerOpen(false);
    };
    mq.addEventListener('change', closeDrawer);
    return () => mq.removeEventListener('change', closeDrawer);
  }, []);

  /* ──────────── Reset handler ──────────── */
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

  /* ──────────── Render ──────────── */
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-14 border-b">
        {/* Title + Hamburger */}
        <div className="flex items-center gap-2">
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="open upload sidebar"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="p-0 w-80">
              <UploadPanel compact />
            </SheetContent>
          </Sheet>

          <h1 className="font-semibold whitespace-nowrap">ArcFusion PDF QA</h1>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Streaming toggle */}
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

      {/* Body */}
      <main className="flex-1 flex">{children}</main>
    </div>
  );
};
