'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Replit Clone</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Code Together,
            <span className="text-blue-600"> Anywhere</span>
          </h2>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            A powerful online IDE that lets you write, run, and collaborate on code in real-time. 
            Support for multiple programming languages with instant execution.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/auth"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Start Coding
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-blue-600 text-3xl mb-4">💻</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Language Support</h3>
              <p className="text-gray-600">
                Write code in JavaScript, Python, C++, Java, and more with syntax highlighting and auto-completion.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-blue-600 text-3xl mb-4">🚀</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Execution</h3>
              <p className="text-gray-600">
                Run your code instantly in secure sandboxed environments without any setup required.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-blue-600 text-3xl mb-4">👥</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Collaboration</h3>
              <p className="text-gray-600">
                Work together with your team in real-time with live cursor tracking and instant sync.
              </p>
            </div>
          </div>
        </div>

        {/* Supported Languages */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Supported Languages</h3>
          <div className="flex flex-wrap justify-center items-center gap-6">
            {['JavaScript', 'Python', 'HTML/CSS', 'C++', 'Java', 'TypeScript'].map((lang) => (
              <div key={lang} className="bg-white rounded-lg shadow-sm px-4 py-2 text-sm font-medium text-gray-700">
                {lang}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
