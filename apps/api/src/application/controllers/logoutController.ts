import type { RouteHandler } from '@hono/zod-openapi';
import { TokenRepository } from '../../infra/repositories/tokenRepository.js';
import type { deleteLogoutRoute } from '../routes/logoutRoute.js';

// 管理者ログアウト用ハンドラ
export const deleteLogoutHandler: RouteHandler<
  typeof deleteLogoutRoute
> = async (c) => {
  const token = c.req.valid('json');

  try {
    const tokenRepository = new TokenRepository();
    const result = await tokenRepository.deleteByToken(token.refresh_token);

    return c.json({ user_id: result.user_id, role: result.role }, 200);
  } catch (e: unknown) {
    console.log(e);

    if (e instanceof Error && e.message === 'token not found') {
      return c.json({ message: 'Not Found', error: e.message }, 404);
    }

    return c.json(
      {
        message: 'Internal Server Error',
        error: e instanceof Error ? e.message : undefined,
      },
      500,
    );
  }
};
