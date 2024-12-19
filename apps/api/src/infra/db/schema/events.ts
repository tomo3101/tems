import { relations } from 'drizzle-orm';
import { datetime, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { datetimes } from '../helper/columnsHelper.js';
import { admins } from './admins.js';
import { reservations } from './reservations.js';

export const events = mysqlTable('events', {
  event_id: int().autoincrement().primaryKey(),
  admin_id: int()
    .notNull()
    .references(() => admins.admin_id, { onDelete: 'no action' }),
  name: varchar({ length: 255 }).notNull(),
  date: datetime().notNull(),
  start_time: datetime().notNull(),
  end_time: datetime().notNull(),
  capacity: int().notNull(),
  ...datetimes,
});

export const eventsRelations = relations(events, ({ one, many }) => ({
  admins: one(admins),
  reservations: many(reservations),
}));
