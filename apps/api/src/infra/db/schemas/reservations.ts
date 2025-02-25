import { relations } from 'drizzle-orm';
import {
  datetime,
  int,
  mysqlEnum,
  mysqlTable,
  varchar,
} from 'drizzle-orm/mysql-core';
import { created_at } from '../helpers/columnsHelper.js';
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
  status: mysqlEnum('status', [
    'reserved',
    'cancelled',
    'checked_in',
    'called',
    'done',
  ])
    .default('reserved')
    .notNull(),
  call_number: int().notNull(),
  ...created_at,
  checked_in_at: datetime(),
  called_at: datetime(),
});

export const reservationsRelations = relations(reservations, ({ one }) => ({
  members: one(members, {
    fields: [reservations.member_id],
    references: [members.member_id],
  }),
  events: one(events, {
    fields: [reservations.event_id],
    references: [events.event_id],
  }),
}));
