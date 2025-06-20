// src/stores/chat.ts
import { create } from 'zustand';

type Msg = { id: string; role: 'user' | 'bot'; text: string; source?: string };

interface ChatState {
  chatId: string | null;
  messages: Msg[];
  hasMemory: boolean;
  addMsg: (msg: Msg) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chatId: null,
  messages: [],
  hasMemory: false,
  addMsg: (m) => set((s) => ({ messages: [...s.messages, m] })),
  reset: () => set({ messages: [], chatId: null, hasMemory: false }),
}));
