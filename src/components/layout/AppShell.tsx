// src/components/layout/AppShell.tsx
import { type ReactNode } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MemoryBadge } from '@/components/MemoryBadge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch'; // shadcn component
import { useChatStore } from '@/stores/chatStore';
import { useFilesStore } from '@/stores/filesStore';
import { useConfigStore } from '@/stores/configStore';
import { resetSession } from '@/api/reset';
import { toast } from 'sonner';

export const AppShell = ({ children }: { children: ReactNode }) => {
  // reset
  const { chatId, reset: resetChat, setMemory } = useChatStore();
  const resetFiles = useFilesStore((s) => s.reset);

  // stream toggle
  const useStream = useConfigStore((s) => s.useStream);
  const toggleStream = useConfigStore((s) => s.toggleStream);

  async function handleReset() {
    if (!window.confirm('ล้างแชตและไฟล์ทั้งหมด ?')) return;

    try {
      await resetSession(chatId ? { chat_id: chatId } : {});
      resetChat();
      resetFiles();
      setMemory(false);
      toast.success('รีเซ็ตเรียบร้อย');
    } catch (e: any) {
      toast.error(e.message ?? 'Reset failed');
    }
  }

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
              onCheckedChange={toggleStream}
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
