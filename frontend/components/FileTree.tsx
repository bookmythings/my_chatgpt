'use client';

import { ProjectFile } from '@/types';

interface FileTreeProps {
  files: ProjectFile[];
  activeFile: ProjectFile | null;
  onFileSelect: (file: ProjectFile) => void;
}

export default function FileTree({ files, activeFile, onFileSelect }: FileTreeProps) {
  const renderFile = (file: ProjectFile, level = 0) => {
    const isActive = activeFile?.path === file.path;
    
    return (
      <div key={file.path}>
        <div
          className={`flex items-center px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 ${
            isActive ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500' : 'text-gray-700'
          }`}
          style={{ paddingLeft: `${8 + level * 16}px` }}
          onClick={() => onFileSelect(file)}
        >
          <span className="mr-2">
            {file.isFolder ? (
              '📁'
            ) : getFileIcon(file.name)}
          </span>
          <span className="truncate">{file.name}</span>
        </div>
        {file.isFolder && file.children && (
          <div>
            {file.children.map(child => renderFile(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">Files</h3>
      </div>
      <div className="py-2">
        {files.map(file => renderFile(file))}
      </div>
    </div>
  );
}

function getFileIcon(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'js':
    case 'jsx':
      return '📜';
    case 'ts':
    case 'tsx':
      return '📘';
    case 'py':
      return '🐍';
    case 'html':
      return '🌐';
    case 'css':
      return '🎨';
    case 'json':
      return '📋';
    case 'md':
      return '📝';
    case 'cpp':
    case 'c':
      return '⚙️';
    case 'java':
      return '☕';
    default:
      return '📄';
  }
}