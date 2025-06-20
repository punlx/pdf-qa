import { create } from 'zustand';

/** เก็บการตั้งค่า global (เช่น เลือกโหมดแชต) */
interface ConfigState {
  useStream: boolean; // true = WebSocket, false = REST
  toggleStream: () => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  useStream: true, // 🟢 เริ่มต้นเปิดสตรีม
  toggleStream: () => set((s) => ({ useStream: !s.useStream })),
}));
