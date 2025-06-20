// src/components/chat/InputBar.tsx
import { type FormEvent, useState } from 'react';
import { SendHorizonal, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { v4 as uuid } from 'uuid';
import { useChatStore } from '@/stores/chatStore';
import { useConfigStore } from '@/stores/configStore';
import { sendChat } from '@/api/chat';
import { sendChatWS, genTempId } from '@/api/wsChat';

export const InputBar = () => {
  const [text, setText] = useState('');

  // stores
  const { chatId, setChatId, addMessage, updateMessage, sending, setSending, setMemory } =
    useChatStore();
  const useStream = useConfigStore((s) => s.useStream);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = text.trim();
    if (!q || sending) return;

    /* ---------- optimistic user message ---------- */
    const userId = uuid();
    addMessage({ id: userId, role: 'user', text: q });

    setText('');
    setSending(true);

    if (useStream) {
      /* ========== WebSocket streaming ========== */
      const botId = genTempId();
      addMessage({ id: botId, role: 'bot', text: '...' });

      sendChatWS(
        { question: q, chat_id: chatId ?? undefined },
        {
          onTyping: () => updateMessage(botId, { text: '...' }),
          onChunk: (chunk) =>
            updateMessage(botId, (prev) => ({
              text: prev.text + chunk, // prev มี type Message แล้ว
            })),
          onComplete: (p) => {
            updateMessage(botId, {
              id: p.id ?? botId,
              text: p.answer ?? '',
              source: p.source,
            });

            if (!chatId && p.chat_id) setChatId(p.chat_id); // ✅ ไม่ส่ง null
            setMemory(true);
            setSending(false);
          },
          onError: (msg) => {
            toast.error(msg);
            updateMessage(botId, { text: `❌ ${msg}` });
            setSending(false);
          },
        }
      );
    } else {
      /* ========== Plain REST ========== */
      try {
        const res = await sendChat({
          question: q,
          chat_id: chatId ?? undefined,
        });

        addMessage({
          id: res.id,
          role: 'bot',
          text: res.answer,
          source: res.source,
        });

        if (!chatId && res.chat_id) setChatId(res.chat_id); // ✅ ไม่ส่ง null
        setMemory(true);
      } catch (err: any) {
        toast.error(err.message ?? 'Chat failed');
      } finally {
        setSending(false);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t p-3">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="ถามอะไรเกี่ยวกับ PDF…"
        disabled={sending}
      />
      <Button type="submit" disabled={sending || !text.trim()}>
        {sending ? (
          <Loader2 className="animate-spin h-4 w-4" />
        ) : (
          <SendHorizonal className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
};
