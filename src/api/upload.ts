import type { UploadFileMeta } from '@/stores/filesStore';

export async function uploadFiles(files: File[]) {
  const form = new FormData();
  files.forEach((f) => form.append('files', f));

  const res = await fetch('http://localhost:8000/api/upload', {
    method: 'POST',
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as {
    message: string;
    files: UploadFileMeta[];
  };
}
