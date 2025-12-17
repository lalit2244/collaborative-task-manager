import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (token: string): Socket => {
  if (socket) return socket;

  const apiUrl = import.meta.env?.VITE_API_URL || 'http://localhost:3000/api/v1';
  const baseUrl = apiUrl.replace('/api/v1', '');

  socket = io(baseUrl, {
    auth: { token },
    withCredentials: true,
  });

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
