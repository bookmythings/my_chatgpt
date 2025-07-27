'use client';

import { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { ProjectFile } from '@/types';

interface CodeEditorProps {
  file: ProjectFile;
  onChange: (content: string) => void;
}

export default function CodeEditor({ file, onChange }: CodeEditorProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Configure Monaco Editor
    monaco.editor.defineTheme('custom-theme', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#ffffff',
      }
    });
    
    monaco.editor.setTheme('custom-theme');
  };

  const getLanguage = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'py':
        return 'python';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      case 'cpp':
      case 'c':
        return 'cpp';
      case 'java':
        return 'java';
      default:
        return 'plaintext';
    }
  };

  return (
    <div className="h-full">
      {/* File Tab */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center">
        <span className="mr-2">{getFileIcon(file.name)}</span>
        <span className="text-sm font-medium text-gray-700">{file.name}</span>
      </div>
      
      {/* Editor */}
      <div className="h-[calc(100%-40px)]">
        <Editor
          value={file.content}
          language={getLanguage(file.name)}
          onChange={(value) => onChange(value || '')}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            contextmenu: true,
            selectOnLineNumbers: true,
          }}
        />
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