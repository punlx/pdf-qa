import { useEffect } from 'react';
import { client } from '@/api/client';
import { useFilesStore } from '@/stores/filesStore';
import { useChatStore } from '@/stores/chatStore';

/** ดึง /api/files + /api/status (อัปเดต MemoryBadge) ครั้งแรก */
export function useFilesSync() {
  const setFiles = useFilesStore((s) => s.setFiles);
  const setMemory = useChatStore((s) => s.setMemory);

  useEffect(() => {
    (async () => {
      try {
        const [filesRes, statusRes] = await Promise.all([
          client.get('/api/files'),
          client.get('/api/status'),
        ]);
        if (filesRes.data.total_files > 0) {
          setFiles(filesRes.data.files);
        }
        setMemory(statusRes.data.has_memory);
      } catch (err) {
        // network error – ปล่อยผ่านแบบเงียบ ๆ
      }
    })();
  }, [setFiles, setMemory]);
}
