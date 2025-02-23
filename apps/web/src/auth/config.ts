import {
  ADMIN_BASE_ROUTE,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  ERROR_BASE_ROUTE,
  ERROR_SESSION_ROUTE,
  publicRoutes,
} from '@/auth/routes';
import { hcWithType } from 'api/hc';
import { NextAuthConfig } from 'next-auth';

export const authConfig = {
  debug: process.env.NODE_ENV !== 'production',
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    authorized: async ({ auth, request: { nextUrl } }) => {
      const isAuthenticated = !!auth?.user;
      const isError = !!auth?.error;
      const isAuthRoute = authRoutes.includes(nextUrl.pathname);
      const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
      const isAdminRoute = nextUrl.pathname.startsWith(ADMIN_BASE_ROUTE);
      const isErrorRoute = nextUrl.pathname.startsWith(ERROR_BASE_ROUTE);
      const isErrorSessionRoute =
        nextUrl.pathname.startsWith(ERROR_SESSION_ROUTE);

      if (isError) {
        if (
          auth.error === 'RefreshTokenExpired' ||
          auth.error === 'RefreshTokenError'
        ) {
          if (isErrorSessionRoute) {
            return true;
          }

          return Response.redirect(
            new URL(
              ERROR_SESSION_ROUTE +
                `?callbackUrl=${encodeURIComponent(nextUrl.href)}`,
              nextUrl,
            ),
          );
        }
      }

      if (isErrorRoute) {
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }

      if (isAuthRoute) {
        if (isAuthenticated) {
          return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }

        return true;
      }

      if (isAdminRoute) {
        if (!isAuthenticated || auth?.user?.role !== 'admin') {
          return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }

        return true;
      }

      if (!isPublicRoute && !isAuthenticated) {
        return false;
      }

      return true;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        return {
          ...token,
          memberId: user.memberId,
          role: user.role,
          accessToken: user.accessToken,
          accessTokenExp: user.accessTokenExp,
          refreshToken: user.refreshToken,
          refreshTokenExp: user.refreshTokenExp,
        };
      } else if (Date.now() < token.accessTokenExp * 1000) {
        return token;
      } else if (Date.now() >= token.refreshTokenExp * 1000) {
        token.error = 'RefreshTokenExpired';
        return token;
      } else {
        if (!token.refreshToken) throw new TypeError('Missing refresh_token');

        try {
          const client = hcWithType('http://localhost:3001/');

          const rawResponse = await client.api.v1.refresh.$post({
            json: {
              refreshToken: token.refreshToken,
            },
          });

          if (!rawResponse.ok) {
            token.error = 'RefreshTokenError';
            return token;
          }

          const response = await rawResponse.json();

          return {
            ...token,
            accessToken: response.accessToken,
            accessTokenExp: response.accessTokenExp,
            refreshToken: token.refreshToken,
            refreshTokenExp: token.refreshTokenExp,
          };
        } catch (error) {
          console.error('Failed to refresh token', error);
          token.error = 'RefreshTokenError';
          return token;
        }
      }
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.memberId = token.memberId;
        session.user.role = token.role;
        session.user.accessToken = token.accessToken;
        session.user.accessTokenExp = token.accessTokenExp;
        session.user.refreshToken = token.refreshToken;
        session.user.refreshTokenExp = token.refreshTokenExp;
        session.error = token.error;
      }

      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
