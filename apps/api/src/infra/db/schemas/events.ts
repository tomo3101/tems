import { relations } from 'drizzle-orm';
import { date, int, mysqlTable, time, varchar } from 'drizzle-orm/mysql-core';
import { datetimes } from '../helpers/columnsHelper.js';
import { admins } from './admins.js';
import { reservations } from './reservations.js';

export const events = mysqlTable('events', {
  event_id: int().autoincrement().primaryKey(),
  admin_id: int()
    .notNull()
    .references(() => admins.admin_id, { onDelete: 'no action' }),
  name: varchar({ length: 255 }).notNull(),
  date: date().notNull(),
  start_time: time().notNull(),
  end_time: time().notNull(),
  capacity: int().notNull(),
  ...datetimes,
});

export const eventsRelations = relations(events, ({ one, many }) => ({
  admins: one(admins),
  reservations: many(reservations),
}));
