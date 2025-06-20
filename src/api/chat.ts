// src/api/chat.ts
// src/api/chat.ts
import { z } from 'zod';
import { client } from './client';

// ---------- Zod Schemas ----------

// body ที่จะส่งเข้า /api/chat
export const chatReqSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  chat_id: z.string().uuid().optional(),
});
export type ChatRequest = z.infer<typeof chatReqSchema>;

// response ที่ backend จะคืนมา
export const chatResSchema = z.object({
  answer: z.string(),
  source: z.string(),
  id: z.string().uuid(),
  timestamp: z.string(), // ISO-8601
  chat_id: z.string().uuid(),
});
export type ChatResponse = z.infer<typeof chatResSchema>;

// ---------- API Call Helper ----------
export async function sendChat(
  body: ChatRequest,
  opts: { validateInput?: boolean; validateOutput?: boolean } = {}
): Promise<ChatResponse> {
  const { validateInput = true, validateOutput = true } = opts;

  // 1) validate request
  if (validateInput) chatReqSchema.parse(body);

  // 2) call API
  const res = await client.post('/api/chat', body);

  // 3) validate response
  return validateOutput ? chatResSchema.parse(res.data) : (res.data as ChatResponse);
}
