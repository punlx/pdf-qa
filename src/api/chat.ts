// src/api/chat.ts
import { z } from 'zod';
import { client } from './client';

export const chatReqSchema = z.object({
  question: z.string(),
  chat_id: z.string().optional(),
});
export type ChatRequest = z.infer<typeof chatReqSchema>;

export const chatResSchema = z.object({
  answer: z.string(),
  source: z.string(),
  id: z.string(),
  timestamp: z.string(),
  chat_id: z.string(),
});
export type ChatResponse = z.infer<typeof chatResSchema>;

export async function sendChat(body: ChatRequest) {
  const res = await client.post<ChatResponse>('/api/chat', body);
  return res.data;
}
