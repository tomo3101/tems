'use client';

import { io } from 'socket.io-client';

export const socket = io('https://tems-dev-ws.ozasa.dev', {
  autoConnect: false,
});
