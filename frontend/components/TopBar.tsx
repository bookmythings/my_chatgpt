'use client';

import { useRouter } from 'next/navigation';
import { Project } from '@/types';

interface TopBarProps {
  project: Project;
  onRun: () => void;
  running: boolean;
}

export default function TopBar({ project, onRun, running }: TopBarProps) {
  const router = useRouter();

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Dashboard
        </button>
        <div className="flex items-center space-x-2">
          <h1 className="text-lg font-semibold text-gray-900">{project.name}</h1>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {project.language}
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        {/* Status Indicator */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Connected</span>
        </div>

        {/* Run Button */}
        <button
          onClick={onRun}
          disabled={running}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            running
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {running ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Running...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>▶</span>
              <span>Run</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}