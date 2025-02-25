'use client';

import { io } from 'socket.io-client';

const NEXT_PUBLIC_WS_URL = process.env.NEXT_PUBLIC_WS_URL;

if (!NEXT_PUBLIC_WS_URL) {
  throw new Error('WS_URL is undefined');
}

export const socket = io(NEXT_PUBLIC_WS_URL, {
  autoConnect: false,
});
