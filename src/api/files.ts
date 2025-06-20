// src/api/files.ts
import { client } from './client';

export async function deleteFile(id: string) {
  await client.delete(`/api/files/${id}`);
}

export async function deleteAllFiles() {
  await client.delete('/api/files');
}
