import { DropZone } from './DropZone';
import { FileList } from './FileList';

export const UploadPanel = () => (
  <div className="w-full md:w-1/3 border-r p-4">
    <h2 className="font-medium mb-3">อัปโหลด PDF</h2>
    <DropZone />
    <FileList />
  </div>
);
