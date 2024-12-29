import type { z } from '@hono/zod-openapi';
import { hash } from 'bcrypt';
import { and, eq, gte, like, lte, type SQLWrapper } from 'drizzle-orm';
import type {
  getMembersQuerySchema,
  postMembersBodySchema,
  putMembersBodySchema,
} from '../../application/schemas/memberSchema.js';
import { db } from '../db/helpers/connecter.js';
import { members } from '../db/schemas/members.js';

type getMemberQuerySchema = z.infer<typeof getMembersQuerySchema>;
type postMemberBodySchema = z.infer<typeof postMembersBodySchema>;
type putMemberBodySchema = z.infer<typeof putMembersBodySchema>;

export class MemberRepository {
  async findAll(query: getMemberQuerySchema) {
    const filters: SQLWrapper[] = [];

    if (query.name) {
      filters.push(like(members.name, query.name));
    }

    if (query.email) {
      filters.push(like(members.email, query.email));
    }

    if (query.phone_number) {
      filters.push(like(members.phone_number, query.phone_number));
    }

    if (query.start_date) {
      filters.push(gte(members.created_at, new Date(query.start_date)));
    }

    if (query.end_date) {
      filters.push(lte(members.created_at, new Date(query.end_date)));
    }

    return db.query.members.findMany({
      where: and(...filters),
      limit: query.limit,
    });
  }

  async findById(id: number) {
    return db.query.members.findFirst({
      where: eq(members.member_id, id),
    });
  }

  async findByEmail(email: string) {
    return db.query.members.findFirst({
      where: eq(members.email, email),
    });
  }

  async create(member: postMemberBodySchema) {
    const existsEmail = await this.findByEmail(member.email);

    if (existsEmail) {
      throw new Error('email already exists');
    }

    const password_hash = await hash(member.password, 10);

    const createdId = await db
      .insert(members)
      .values({
        name: member.name,
        email: member.email,
        phone_number: member.phone_number,
        password_hash: password_hash,
      })
      .$returningId();

    const createdMember = await this.findById(createdId[0].member_id);

    if (createdMember === undefined) {
      throw new Error('failed to create member');
    }

    return createdMember;
  }

  async update(memberId: number, member: putMemberBodySchema) {
    let password_hash: string | undefined;

    if (member.password) {
      password_hash = await hash(member.password, 10);
    }

    const existsMember = await this.findById(memberId);

    if (existsMember === undefined) {
      throw new Error('member not found');
    }

    await db
      .update(members)
      .set({
        name: member.name,
        email: member.email,
        phone_number: member.phone_number,
        password_hash: password_hash,
      })
      .where(eq(members.member_id, memberId));

    const updatedMember = await this.findById(memberId);

    if (updatedMember === undefined) {
      throw new Error('failed to update member');
    }

    return updatedMember;
  }

  async delete(id: number) {
    const existsMember = await this.findById(id);

    if (existsMember === undefined) {
      throw new Error('member not found');
    }

    await db.delete(members).where(eq(members.member_id, id));
  }
}
