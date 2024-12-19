import {
  boolean,
  datetime,
  int,
  mysqlTable,
  varchar,
} from 'drizzle-orm/mysql-core';
import { created_at } from '../helper/columnsHelper.js';

export const temporaryMembers = mysqlTable('temporary_members', {
  temporary_member_id: int().autoincrement().primaryKey(),
  email: varchar({ length: 255 }).notNull(),
  token: varchar({ length: 128 }).notNull(),
  is_used: boolean().default(false).notNull(),
  ...created_at,
  expires_at: datetime().notNull(),
});
