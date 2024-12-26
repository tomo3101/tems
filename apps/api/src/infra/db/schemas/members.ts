import { relations } from 'drizzle-orm';
import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { datetimes } from '../helpers/columnsHelper.js';
import { reservations } from './reservations.js';

export const members = mysqlTable('members', {
  member_id: int().autoincrement().primaryKey(),
  name: varchar({ length: 60 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  password_hash: varchar({ length: 60 }).notNull(),
  phone_number: varchar({ length: 21 }).notNull(),
  ...datetimes,
});

export const membersRelations = relations(members, ({ many }) => ({
  reservations: many(reservations),
}));
