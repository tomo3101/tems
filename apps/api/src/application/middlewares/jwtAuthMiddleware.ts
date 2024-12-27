import 'dotenv/config';
import type { Context, Next } from 'hono';
import { jwt } from 'hono/jwt';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

if (accessTokenSecret === undefined) {
  throw new Error('ACCESS_TOKEN_SECRET is not defined');
}

export const jwtAuthMiddleware = jwt({
  secret: accessTokenSecret,
});

export const adminAuthMiddleware = async (c: Context, next: Next) => {
  const { role } = c.get('jwtPayload');
  if (role === 'admin') {
    await next();
  } else {
    return c.json({ message: 'Forbidden' }, 403);
  }
};

export const userAuthMiddleware = async (c: Context, next: Next) => {
  const { role, user_id } = c.get('jwtPayload');
  const memberId = Number(c.req.param('member_id'));

  if (role === 'admin' || (role === 'member' && user_id === memberId)) {
    await next();
  } else {
    return c.json({ message: 'Forbidden' }, 403);
  }
};
