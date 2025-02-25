import 'dotenv/config';
import type { Context, Next } from 'hono';
import { jwt } from 'hono/jwt';
import { ReservationRepository } from '../../infra/repositories/reservationRepository.js';
import type { AccessTokenPayload } from '../../utils/jwt.js';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

if (accessTokenSecret === undefined) {
  throw new Error('ACCESS_TOKEN_SECRET is not defined');
}

export const jwtAuthMiddleware = jwt({
  secret: accessTokenSecret,
});

export const adminAuthMiddleware = async (c: Context, next: Next) => {
  const { role } = c.get('jwtPayload') as AccessTokenPayload;
  if (role === 'admin') {
    await next();
  } else {
    return c.json({ message: 'Forbidden' }, 403);
  }
};

export const userAuthMiddleware = async (c: Context, next: Next) => {
  const { role, userId } = c.get('jwtPayload') as AccessTokenPayload;
  const memberId = Number(c.req.param('id'));

  if (role === 'admin' || (role === 'member' && userId === memberId)) {
    await next();
  } else {
    return c.json({ message: 'Forbidden' }, 403);
  }
};

export const reservationAuthMiddleware = async (c: Context, next: Next) => {
  const { role, userId } = c.get('jwtPayload') as AccessTokenPayload;
  const reservationId = Number(c.req.param('id'));

  if (role === 'member') {
    const reservationRepository = new ReservationRepository();
    const reservation = await reservationRepository.findById(reservationId);

    if (reservation?.member_id !== userId) {
      return c.json({ message: 'Forbidden' }, 403);
    }
  }

  await next();
};
