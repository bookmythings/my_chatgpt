'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { Project, ProjectFile, CodeExecutionResult } from '@/types';
import api from '@/lib/api';
import FileTree from '@/components/FileTree';
import CodeEditor from '@/components/CodeEditor';
import Console from '@/components/Console';
import TopBar from '@/components/TopBar';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { socket, joinProject, leaveProject } = useSocket();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFile, setActiveFile] = useState<ProjectFile | null>(null);
  const [executing, setExecuting] = useState(false);
  const [output, setOutput] = useState<CodeExecutionResult | null>(null);

  const projectId = params.id as string;

  const fetchProject = useCallback(async () => {
    try {
      const response = await api.get(`/projects/${projectId}`);
      const projectData = response.data.project;
      setProject(projectData);
      
      // Set the first file as active if exists
      if (projectData.files.length > 0) {
        setActiveFile(projectData.files[0]);
      }
    } catch (error) {
      console.error('Failed to fetch project:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [projectId, router]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
      return;
    }

    if (user && projectId) {
      fetchProject();
    }
  }, [user, authLoading, projectId, router, fetchProject]);

  useEffect(() => {
    if (project && socket) {
      joinProject(projectId);
      
      // Set up socket listeners
      socket.on('file-changed', handleFileChanged);
      socket.on('user-joined', handleUserJoined);
      socket.on('user-left', handleUserLeft);
      socket.on('code-executed', handleCodeExecuted);

      return () => {
        leaveProject(projectId);
        socket.off('file-changed');
        socket.off('user-joined');
        socket.off('user-left');
        socket.off('code-executed');
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, socket]);

  const handleFileChanged = (data: { filePath: string; content: string; userId: string; username: string; cursor?: unknown }) => {
    if (data.filePath === activeFile?.path) {
      // Update the file content if it's the currently active file
      setActiveFile(prev => prev ? { ...prev, content: data.content } : null);
    }
    
    // Update project files
    setProject(prev => {
      if (!prev) return null;
      const updatedFiles = updateFileInTree(prev.files, data.filePath, data.content);
      return { ...prev, files: updatedFiles };
    });
  };

  const handleUserJoined = (data: { userId: string; username: string; socketId: string }) => {
    console.log(`${data.username} joined the project`);
  };

  const handleUserLeft = (data: { userId: string; username: string; socketId: string }) => {
    console.log(`${data.username} left the project`);
  };

  const handleCodeExecuted = (data: { output: CodeExecutionResult; userId: string; username: string }) => {
    setOutput(data.output);
  };

  const updateFileInTree = (files: ProjectFile[], filePath: string, content: string): ProjectFile[] => {
    return files.map(file => {
      if (file.path === filePath) {
        return { ...file, content };
      }
      if (file.children) {
        return { ...file, children: updateFileInTree(file.children, filePath, content) };
      }
      return file;
    });
  };

  const handleFileSelect = (file: ProjectFile) => {
    if (!file.isFolder) {
      setActiveFile(file);
    }
  };

  const handleFileContentChange = (content: string) => {
    if (!activeFile) return;

    const updatedFile = { ...activeFile, content };
    setActiveFile(updatedFile);

    // Emit change to other users
    if (socket) {
      socket.emit('file-change', {
        projectId,
        filePath: activeFile.path,
        content,
      });
    }

    // Update project files locally
    setProject(prev => {
      if (!prev) return null;
      const updatedFiles = updateFileInTree(prev.files, activeFile.path, content);
      return { ...prev, files: updatedFiles };
    });

    // Save to backend (debounced)
    debouncedSave();
  };

  // Debounced save function
  const debouncedSave = (() => {
    let timeoutId: NodeJS.Timeout;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        saveProject();
      }, 1000);
    };
  })();

  const saveProject = async () => {
    if (!project) return;
    
    try {
      await api.put(`/projects/${projectId}/files`, {
        files: project.files
      });
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const executeCode = async () => {
    if (!activeFile || executing) return;

    setExecuting(true);
    try {
      const response = await api.post('/execute', {
        language: project?.language,
        code: activeFile.content,
      });

      const result = response.data.output;
      setOutput(result);

      // Broadcast execution result to other users
      if (socket) {
        socket.emit('code-execution', {
          projectId,
          output: result,
        });
      }
    } catch (error: unknown) {
      const errorOutput: CodeExecutionResult = {
        stdout: '',
        stderr: error instanceof Error && 'response' in error && (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Execution failed',
        code: 1,
        language: project?.language || 'unknown',
        version: '0.0.0'
      };
      setOutput(errorOutput);
    } finally {
      setExecuting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Project not found</h2>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-blue-600 hover:text-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <TopBar 
        project={project} 
        onRun={executeCode} 
        running={executing}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* File Tree */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <FileTree
            files={project.files}
            activeFile={activeFile}
            onFileSelect={handleFileSelect}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Editor */}
          <div className="flex-1 relative">
            {activeFile ? (
              <CodeEditor
                file={activeFile}
                onChange={handleFileContentChange}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-white">
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">📄</div>
                  <p>Select a file to start editing</p>
                </div>
              </div>
            )}
          </div>

          {/* Console */}
          <div className="h-64 border-t border-gray-200">
            <Console 
              output={output} 
              onClear={() => setOutput(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}