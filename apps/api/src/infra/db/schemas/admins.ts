import { relations } from 'drizzle-orm';
import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { datetimes } from '../helpers/columnsHelper.js';
import { events } from './events.js';

export const admins = mysqlTable('admins', {
  admin_id: int().autoincrement().primaryKey(),
  name: varchar({ length: 60 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  password_hash: varchar({ length: 60 }).notNull(),
  ...datetimes,
});

export const adminsRelations = relations(admins, ({ many }) => ({
  events: many(events),
}));
