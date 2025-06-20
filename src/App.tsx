import { UploadPanel } from '@/components/upload/UploadPanel';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { AppShell } from '@/components/layout/AppShell';
import { useStatus } from '@/hooks/useStatus';

export default function App() {
  useStatus();

  return (
    <AppShell>
      <UploadPanel />
      <ChatPanel />
    </AppShell>
  );
}
