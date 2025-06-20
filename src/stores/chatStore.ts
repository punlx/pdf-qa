// src/stores/chatStore.ts

import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  source?: string;
}

type Patch = Partial<Message> | ((prev: Message) => Partial<Message>); // 🆕 callback แบบ prev-state

interface ChatState {
  chatId: string | null;
  messages: Message[];
  hasMemory: boolean;
  sending: boolean;

  addMessage: (m: Message) => void;
  updateMessage: (id: string, patch: Patch) => void; // 🆕
  setChatId: (id: string) => void;
  setMemory: (f: boolean) => void;
  setSending: (v: boolean) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chatId: null,
  messages: [],
  hasMemory: false,
  sending: false,

  addMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),

  /** อนุญาตทั้ง object patch และ callback(prev) */
  updateMessage: (id, patch) =>
    set((s) => ({
      messages: s.messages.map((m) => {
        if (m.id !== id) return m;
        const partial: Partial<Message> = typeof patch === 'function' ? patch(m) : patch;
        return { ...m, ...partial };
      }),
    })),

  setChatId: (id) => set({ chatId: id }),
  setMemory: (f) => set({ hasMemory: f }),
  setSending: (v) => set({ sending: v }),

  reset: () =>
    set({
      chatId: null,
      messages: [],
      hasMemory: false,
      sending: false,
    }),
}));
