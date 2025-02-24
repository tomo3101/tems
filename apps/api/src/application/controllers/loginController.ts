import type { RouteHandler } from '@hono/zod-openapi';
import { compare } from 'bcrypt';
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

      return c.json(
        {
          userId: member.member_id,
          name: member.name,
          email: member.email,
          role: body.role,
          accessToken: accessToken.token,
          accessTokenExp: accessToken.exp,
          refreshToken: refreshToken.token,
          refreshTokenExp: refreshToken.exp,
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

      const isPasswordMatch = await compare(
        body.password,
        admin.password_hash.replace(/^\$2y\$/, '$2a$'),
      );

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

      return c.json(
        {
          userId: admin.admin_id,
          name: admin.name,
          email: admin.email,
          role: body.role,
          accessToken: accessToken.token,
          accessTokenExp: accessToken.exp,
          refreshToken: refreshToken.token,
          refreshTokenExp: refreshToken.exp,
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
