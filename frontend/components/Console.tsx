'use client';

import { CodeExecutionResult } from '@/types';

interface ConsoleProps {
  output: CodeExecutionResult | null;
  onClear: () => void;
}

export default function Console({ output, onClear }: ConsoleProps) {
  return (
    <div className="h-full bg-gray-900 text-white flex flex-col">
      {/* Console Header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <h3 className="text-sm font-medium">Console</h3>
        <button
          onClick={onClear}
          className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-700"
        >
          Clear
        </button>
      </div>
      
      {/* Console Content */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-sm">
        {!output ? (
          <div className="text-gray-500">
            Press the Run button to execute your code...
          </div>
        ) : (
          <div>
            {/* Stdout */}
            {output.stdout && (
              <div className="mb-2">
                <div className="text-green-400 mb-1">Output:</div>
                <pre className="whitespace-pre-wrap text-gray-100">
                  {output.stdout}
                </pre>
              </div>
            )}
            
            {/* Stderr */}
            {output.stderr && (
              <div className="mb-2">
                <div className="text-red-400 mb-1">Error:</div>
                <pre className="whitespace-pre-wrap text-red-300">
                  {output.stderr}
                </pre>
              </div>
            )}
            
            {/* Exit Code */}
            <div className="mt-2 text-xs text-gray-400">
              Exit code: {output.code} | Language: {output.language} {output.version}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}