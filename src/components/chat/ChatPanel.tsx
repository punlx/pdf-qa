// src/components/chat/ChatPanel.tsx
import { ChatWindow } from './ChatWindow';
import { InputBar } from './InputBar';

export const ChatPanel = () => (
  <div className="flex flex-col flex-1 h-full">
    <ChatWindow />
    <InputBar />
  </div>
);
