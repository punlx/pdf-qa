// src/App.tsx

import { UploadPanel } from '@/components/upload/UploadPanel';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { AppShell } from '@/components/layout/AppShell';
import { useFilesSync } from '@/hooks/useFilesSync';

export default function App() {
  useFilesSync();

  return (
    <AppShell>
      <div>test</div>
      {/* desktop sidebar */}
      <div className="hidden lg:block">
        <UploadPanel />
      </div>

      <ChatPanel />
    </AppShell>
  );
}
