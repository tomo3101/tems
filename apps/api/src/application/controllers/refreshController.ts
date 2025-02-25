import type { RouteHandler } from '@hono/zod-openapi';
import { TokenRepository } from '../../infra/repositories/tokenRepository.js';
import { createAccessToken, verifyRefreshToken } from '../../utils/jwt.js';
import type { postRefreshRoute } from '../routes/refreshRoute.js';

// アクセストークンのリフレッシュ用ハンドラ
export const postRefreshHandler: RouteHandler<typeof postRefreshRoute> = async (
  c,
) => {
  const body = c.req.valid('json');

  try {
    const tokenRepository = new TokenRepository();
    const token = await tokenRepository.findByToken(body.refreshToken);

    if (token === undefined) {
      console.log('token not found');

      return c.json(
        { message: 'Unauthorized', error: 'refresh token invalid' },
        401,
      );
    }

    try {
      const refreshToken = await verifyRefreshToken(body.refreshToken);

      const accessToken = await createAccessToken(
        refreshToken.userId,
        refreshToken.role,
      );

      return c.json(
        {
          userId: refreshToken.userId,
          role: refreshToken.role,
          accessToken: accessToken.token,
          accessTokenExp: accessToken.exp,
        },
        200,
      );
    } catch (e: unknown) {
      console.log(e);
      return c.json(
        { message: 'Unauthorized', error: 'refresh token invalid' },
        401,
      );
    }
  } catch (e: unknown) {
    console.log(e);
    return c.json(
      {
        message: 'Internal Server Error',
        error: e instanceof Error ? e.message : undefined,
      },
      500,
    );
  }
};
