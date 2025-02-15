import type { z } from '@hono/zod-openapi';
import { hash } from 'bcrypt';
import { and, eq, gte, like, lte, type SQLWrapper } from 'drizzle-orm';
import type {
  getAdminsQuerySchema,
  postAdminsBodySchema,
  putAdminsBodySchema,
} from '../../application/schemas/adminSchema.js';
import { db } from '../db/helpers/connecter.js';
import { admins } from '../db/schemas/admins.js';

type getAdminsQuerySchema = z.infer<typeof getAdminsQuerySchema>;
type postAdminsBodySchema = z.infer<typeof postAdminsBodySchema>;
type putAdminsBodySchema = z.infer<typeof putAdminsBodySchema>;

export class AdminRepository {
  async findAll(query: getAdminsQuerySchema) {
    const filters: SQLWrapper[] = [];

    if (query.name) {
      filters.push(like(admins.name, query.name));
    }

    if (query.email) {
      filters.push(like(admins.email, query.email));
    }

    if (query.startDate) {
      filters.push(gte(admins.created_at, new Date(query.startDate)));
    }

    if (query.endDate) {
      filters.push(lte(admins.created_at, new Date(query.endDate)));
    }

    return db.query.admins.findMany({
      where: and(...filters),
      limit: query.limit,
    });
  }

  async findById(id: number) {
    return db.query.admins.findFirst({
      where: eq(admins.admin_id, id),
    });
  }

  async findByEmail(email: string) {
    return db.query.admins.findFirst({
      where: eq(admins.email, email),
    });
  }

  async create(admin: postAdminsBodySchema) {
    const existsEmail = await this.findByEmail(admin.email);

    if (existsEmail) {
      throw new Error('email already exists');
    }

    const password_hash = await hash(admin.password, 10);

    const createdId = await db
      .insert(admins)
      .values({
        name: admin.name,
        email: admin.email,
        password_hash: password_hash,
      })
      .$returningId();

    const createdMember = await this.findById(createdId[0].admin_id);

    if (createdMember === undefined) {
      throw new Error('failed to create member');
    }

    return createdMember;
  }

  async update(adminId: number, admin: putAdminsBodySchema) {
    let password_hash: string | undefined;

    if (admin.password) {
      password_hash = await hash(admin.password, 10);
    }

    const existsAdmin = await this.findById(adminId);

    if (existsAdmin === undefined) {
      throw new Error('admin not found');
    }

    await db
      .update(admins)
      .set({
        name: admin.name,
        email: admin.email,
        password_hash: password_hash,
      })
      .where(eq(admins.admin_id, adminId));

    const updatedMember = await this.findById(adminId);

    if (updatedMember === undefined) {
      throw new Error('failed to update member');
    }

    return updatedMember;
  }

  async delete(id: number) {
    const existsAdmin = await this.findById(id);

    if (existsAdmin === undefined) {
      throw new Error('admin not found');
    }

    await db.delete(admins).where(eq(admins.admin_id, id));
  }
}
