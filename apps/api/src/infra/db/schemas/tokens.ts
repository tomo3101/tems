import { int, mysqlEnum, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { created_at } from '../helpers/columnsHelper.js';

export const tokens = mysqlTable('tokens', {
  token_id: int().autoincrement().primaryKey(),
  user_id: int().notNull(),
  role: mysqlEnum(['admin', 'member']).notNull(),
  token: varchar({ length: 255 }).notNull(),
  exp: int().notNull(),
  ...created_at,
});
