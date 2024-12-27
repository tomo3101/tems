import { sign, verify } from 'hono/jwt';
import type { JWTPayload } from 'hono/utils/jwt/types';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

if (accessTokenSecret === undefined) {
  throw new Error('ACCESS_TOKEN_SECRET is not defined');
}

if (refreshTokenSecret === undefined) {
  throw new Error('REFRESH_TOKEN_SECRET is not defined');
}

// アクセストークンの生成
export const createAccessToken = async (
  userId: number,
  role: 'admin' | 'member',
) => {
  const exp = Math.floor(Date.now() / 1000) + 60 * 15; // 15 minutes

  return {
    token: await sign(
      {
        user_id: userId,
        role: role,
        exp: exp,
      },
      accessTokenSecret,
    ),
    exp: exp,
  };
};

// リフレッシュトークンの生成
export const createRefreshToken = async (
  userId: number,
  role: 'admin' | 'member',
) => {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 1; // 1 days

  return {
    token: await sign(
      {
        user_id: userId,
        role: role,
        exp: exp,
      },
      refreshTokenSecret,
    ),
    exp: exp,
  };
};

interface RefreshTokenPayload extends JWTPayload {
  user_id: number;
  role: 'admin' | 'member';
}

// リフレッシュトークンの検証
export const verifyRefreshToken = async (token: string) => {
  return verify(token, refreshTokenSecret) as Promise<RefreshTokenPayload>;
};
