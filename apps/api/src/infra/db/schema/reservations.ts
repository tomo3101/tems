import { relations } from 'drizzle-orm';
import { int, mysqlEnum, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { datetimes } from '../helper/columnsHelper.js';
import { events } from './events.js';
import { members } from './members.js';

export const reservations = mysqlTable('reservations', {
  reservation_id: int().autoincrement().primaryKey(),
  event_id: int()
    .notNull()
    .references(() => events.event_id, {
      onDelete: 'no action',
    }),
  member_id: int()
    .notNull()
    .references(() => members.member_id, {
      onDelete: 'cascade',
    }),
  number_of_people: int().notNull(),
  qr_code_hash: varchar({ length: 128 }).notNull(),
  status: mysqlEnum('status', ['reserved', 'cancelled', 'checked_in'])
    .default('reserved')
    .notNull(),
  ...datetimes,
});

export const reservationsRelations = relations(reservations, ({ one }) => ({
  members: one(members),
  events: one(events),
}));
