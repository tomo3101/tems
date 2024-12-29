import type { RouteHandler } from '@hono/zod-openapi';
import { compare } from 'bcrypt';
import { serialize } from 'hono/utils/cookie';
import { AdminRepository } from '../../infra/repositories/adminRepository.js';
import { MemberRepository } from '../../infra/repositories/memberRepository.js';
import { TokenRepository } from '../../infra/repositories/tokenRepository.js';
import { createAccessToken, createRefreshToken } from '../../utils/jwt.js';
import type { postLoginAdminRoute } from '../routes/loginRoute.js';

// ログイン用ハンドラ
export const postLoginHandler: RouteHandler<
  typeof postLoginAdminRoute
> = async (c) => {
  const body = c.req.valid('json');

  if (body.role === 'member') {
    try {
      const memberRepository = new MemberRepository();
      const member = await memberRepository.findByEmail(body.email);

      if (member === undefined) {
        return c.json(
          { message: 'Unauthorized', error: 'email or password incorrect' },
          401,
        );
      }

      const isPasswordMatch = await compare(
        body.password,
        member.password_hash,
      );

      if (!isPasswordMatch) {
        return c.json(
          { message: 'Unauthorized', error: 'email or password incorrect' },
          401,
        );
      }

      const accessToken = await createAccessToken(member.member_id, 'member');
      const refreshToken = await createRefreshToken(member.member_id, 'member');

      const tokenRepository = new TokenRepository();
      await tokenRepository.create(member.member_id, 'member', refreshToken);

      c.res.headers.append(
        'Set-Cookie',
        serialize('accessToken', accessToken.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 15, // 15 minutes
          path: '/api/v1',
        }),
      );

      c.res.headers.append(
        'Set-Cookie',
        serialize('refreshToken', refreshToken.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 1, // 1 days
          path: '/api/v1',
        }),
      );

      return c.json(
        {
          user_id: member.member_id,
          name: member.name,
          email: member.email,
          role: body.role,
          access_token: accessToken.token,
          access_token_exp: accessToken.exp,
          refresh_token: refreshToken.token,
          refresh_token_exp: refreshToken.exp,
        },
        200,
      );
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
  } else if (body.role === 'admin') {
    try {
      const adminRepository = new AdminRepository();
      const admin = await adminRepository.findByEmail(body.email);

      if (admin === undefined) {
        return c.json(
          { message: 'Unauthorized', error: 'email or password incorrect' },
          401,
        );
      }

      const isPasswordMatch = await compare(body.password, admin.password_hash);

      if (!isPasswordMatch) {
        return c.json(
          { message: 'Unauthorized', error: 'email or password incorrect' },
          401,
        );
      }

      const accessToken = await createAccessToken(admin.admin_id, 'admin');
      const refreshToken = await createRefreshToken(admin.admin_id, 'admin');

      const tokenRepository = new TokenRepository();
      await tokenRepository.create(admin.admin_id, 'admin', refreshToken);

      c.res.headers.append(
        'Set-Cookie',
        serialize('accessToken', accessToken.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 15, // 15 minutes
          path: '/api/v1',
        }),
      );

      c.res.headers.append(
        'Set-Cookie',
        serialize('refreshToken', refreshToken.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 1, // 1 days
          path: '/api/v1',
        }),
      );

      return c.json(
        {
          user_id: admin.admin_id,
          name: admin.name,
          email: admin.email,
          role: body.role,
          access_token: accessToken.token,
          access_token_exp: accessToken.exp,
          refresh_token: refreshToken.token,
          refresh_token_exp: refreshToken.exp,
        },
        200,
      );
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
  }
  return c.json(
    {
      message: 'Bad Request',
      error: 'Invalid role',
    },
    400,
  );
};
