import { and, eq } from 'drizzle-orm';
import { db } from '../db/helpers/connecter.js';
import { tokens } from '../db/schemas/tokens.js';

export class TokenRepository {
  async create(
    userId: number,
    role: 'admin' | 'member',
    refreshToken: { token: string; exp: number },
  ) {
    return db
      .insert(tokens)
      .values({
        user_id: userId,
        role: role,
        token: refreshToken.token,
        exp: refreshToken.exp,
      })
      .$returningId();
  }

  async findByToken(token: string) {
    return db.query.tokens.findFirst({
      where: eq(tokens.token, token),
    });
  }

  async findByUser(userId: number, role: 'admin' | 'member') {
    return db.query.tokens.findFirst({
      where: and(eq(tokens.user_id, userId), eq(tokens.role, role)),
    });
  }

  async deleteByToken(token: string) {
    const existsToken = await this.findByToken(token);

    if (existsToken === undefined) {
      throw new Error('token not found');
    }

    await db.delete(tokens).where(eq(tokens.token, token));

    return {
      user_id: existsToken.user_id,
      role: existsToken.role,
    };
  }

  async deleteByUserId(userId: number, role: 'admin' | 'member') {
    const existsUser = await this.findByUser(userId, role);

    if (existsUser === undefined) {
      throw new Error('user not found');
    }

    await db.delete(tokens).where(eq(tokens.user_id, userId));

    return {
      user_id: existsUser.user_id,
      role: existsUser.role,
    };
  }
}
