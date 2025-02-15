import { authConfig } from '@/auth/config';
import { hcWithType } from 'api/hc';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'role' },
      },
      authorize: async (credentials) => {
        const client = hcWithType('http://localhost:3001/');

        if (!credentials) {
          return null;
        }

        if (
          typeof credentials.email !== 'string' ||
          typeof credentials.password !== 'string'
        ) {
          return null;
        }

        if (credentials.role !== 'admin' && credentials.role !== 'member') {
          return null;
        }

        const rawResponse = await client.api.v1.login.$post({
          json: {
            email: credentials.email,
            password: credentials.password,
            role: credentials.role,
          },
        });

        if (rawResponse.ok) {
          const response = await rawResponse.json();

          return {
            id: response.userId.toString(),
            memberId: response.userId,
            name: response.name,
            email: response.email,
            role: response.role,
            accessToken: response.accessToken,
            accessTokenExp: response.accessTokenExp,
            refreshToken: response.refreshToken,
            refreshTokenExp: response.refreshTokenExp,
          };
        }

        return null;
      },
    }),
  ],
});
