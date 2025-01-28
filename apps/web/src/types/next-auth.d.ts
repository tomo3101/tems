import 'next-auth';
import { DefaultSession } from 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    error?: string;
    user: User & DefaultSession['user'];
  }

  interface User {
    memberId: number;
    name: string;
    email: string;
    image?: string;
    role: 'admin' | 'member';
    accessToken: string;
    accessTokenExp: number;
    refreshToken: string;
    refreshTokenExp: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    memberId: number;
    role: 'admin' | 'member';
    accessToken: string;
    accessTokenExp: number;
    refreshToken: string;
    refreshTokenExp: number;
    error?: string;
  }
}
