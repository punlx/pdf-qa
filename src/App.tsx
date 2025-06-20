import { UploadPanel } from '@/components/upload/UploadPanel';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { AppShell } from '@/components/layout/AppShell';
import { useFilesSync } from '@/hooks/useFilesSync';

export default function App() {
  useFilesSync();

  return (
    <AppShell>
      <UploadPanel />
      <ChatPanel />
    </AppShell>
  );
}
