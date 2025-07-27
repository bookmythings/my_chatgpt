import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  username?: string;
}

interface ProjectRoom {
  projectId: string;
  users: Map<string, { userId: string; username: string; cursor?: any }>;
}

const projectRooms = new Map<string, ProjectRoom>();

export const setupSocketHandlers = (io: Server) => {
  // Authentication middleware for Socket.io
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
      const decoded = jwt.verify(token, jwtSecret) as { userId: string };
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return next(new Error('Authentication error'));
      }

      socket.userId = user._id.toString();
      socket.username = user.username;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User ${socket.username} connected`);

    // Join project room
    socket.on('join-project', (projectId: string) => {
      socket.join(projectId);
      
      // Initialize project room if it doesn't exist
      if (!projectRooms.has(projectId)) {
        projectRooms.set(projectId, {
          projectId,
          users: new Map()
        });
      }

      const room = projectRooms.get(projectId)!;
      room.users.set(socket.id, {
        userId: socket.userId!,
        username: socket.username!
      });

      // Notify other users in the room
      socket.to(projectId).emit('user-joined', {
        userId: socket.userId,
        username: socket.username,
        socketId: socket.id
      });

      // Send current users to the joining user
      const currentUsers = Array.from(room.users.values());
      socket.emit('room-users', currentUsers);

      console.log(`User ${socket.username} joined project ${projectId}`);
    });

    // Leave project room
    socket.on('leave-project', (projectId: string) => {
      socket.leave(projectId);
      
      const room = projectRooms.get(projectId);
      if (room) {
        room.users.delete(socket.id);
        
        // Clean up empty rooms
        if (room.users.size === 0) {
          projectRooms.delete(projectId);
        }
      }

      socket.to(projectId).emit('user-left', {
        userId: socket.userId,
        username: socket.username,
        socketId: socket.id
      });

      console.log(`User ${socket.username} left project ${projectId}`);
    });

    // Handle file content changes
    socket.on('file-change', (data: {
      projectId: string;
      filePath: string;
      content: string;
      cursor?: any;
    }) => {
      socket.to(data.projectId).emit('file-changed', {
        filePath: data.filePath,
        content: data.content,
        userId: socket.userId,
        username: socket.username,
        cursor: data.cursor
      });
    });

    // Handle cursor position changes
    socket.on('cursor-change', (data: {
      projectId: string;
      filePath: string;
      cursor: any;
    }) => {
      const room = projectRooms.get(data.projectId);
      if (room && room.users.has(socket.id)) {
        const user = room.users.get(socket.id)!;
        user.cursor = data.cursor;
      }

      socket.to(data.projectId).emit('cursor-changed', {
        filePath: data.filePath,
        cursor: data.cursor,
        userId: socket.userId,
        username: socket.username
      });
    });

    // Handle file operations (create, delete, rename)
    socket.on('file-operation', (data: {
      projectId: string;
      operation: 'create' | 'delete' | 'rename';
      filePath: string;
      newPath?: string;
      isFolder?: boolean;
    }) => {
      socket.to(data.projectId).emit('file-operation', {
        ...data,
        userId: socket.userId,
        username: socket.username
      });
    });

    // Handle code execution broadcasts
    socket.on('code-execution', (data: {
      projectId: string;
      output: any;
    }) => {
      socket.to(data.projectId).emit('code-executed', {
        output: data.output,
        userId: socket.userId,
        username: socket.username
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${socket.username} disconnected`);
      
      // Remove user from all project rooms
      for (const [projectId, room] of projectRooms.entries()) {
        if (room.users.has(socket.id)) {
          room.users.delete(socket.id);
          
          // Notify other users
          socket.to(projectId).emit('user-left', {
            userId: socket.userId,
            username: socket.username,
            socketId: socket.id
          });

          // Clean up empty rooms
          if (room.users.size === 0) {
            projectRooms.delete(projectId);
          }
        }
      }
    });
  });
};