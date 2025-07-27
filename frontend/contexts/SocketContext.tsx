'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import socketIO from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: ReturnType<typeof socketIO> | null;
  isConnected: boolean;
  joinProject: (projectId: string) => void;
  leaveProject: (projectId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<ReturnType<typeof socketIO> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token, user } = useAuth();

  useEffect(() => {
    if (token && user) {
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
      
      const newSocket = socketIO(socketUrl, {
        auth: {
          token,
        },
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error: Error) => {
        console.error('Connection error:', error);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
        setSocket(null);
        setIsConnected(false);
      };
    }
  }, [token, user]);

  const joinProject = (projectId: string) => {
    if (socket) {
      socket.emit('join-project', projectId);
    }
  };

  const leaveProject = (projectId: string) => {
    if (socket) {
      socket.emit('leave-project', projectId);
    }
  };

  const value = {
    socket,
    isConnected,
    joinProject,
    leaveProject,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};