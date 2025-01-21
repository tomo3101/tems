import { z } from '@hono/zod-openapi';
import {
  and,
  eq,
  getTableColumns,
  gte,
  like,
  lte,
  type SQLWrapper,
} from 'drizzle-orm';
import type {
  getEventsQuerySchema,
  postEventsBodySchema,
  putEventsBodySchema,
} from '../../application/schemas/eventSchema.js';
import { db } from '../db/helpers/connecter.js';
import { withLimit } from '../db/helpers/dynamicBuilder.js';
import { events } from '../db/schemas/events.js';
import { reservations } from '../db/schemas/reservations.js';

type getEventsQuerySchema = z.infer<typeof getEventsQuerySchema>;
type postEventsBodySchema = z.infer<typeof postEventsBodySchema>;
type putEventsBodySchema = z.infer<typeof putEventsBodySchema>;

export class EventRepository {
  async findAll(query: getEventsQuerySchema) {
    const filters: SQLWrapper[] = [];

    if (query.name) {
      filters.push(like(events.name, query.name));
    }

    if (query.start_date) {
      filters.push(gte(events.date, new Date(query.start_date)));
    }

    if (query.end_date) {
      filters.push(lte(events.date, new Date(query.end_date)));
    }

    if (query.start_time) {
      filters.push(gte(events.start_time, query.start_time));
    }

    if (query.end_time) {
      filters.push(lte(events.end_time, query.end_time));
    }

    const dynamicQuery = db
      .select({
        ...getTableColumns(events),
        reserved_count: db.$count(
          reservations,
          eq(reservations.event_id, events.event_id),
        ),
      })
      .from(events)
      .where(and(...filters))
      .$dynamic();

    return withLimit(dynamicQuery, query.limit);
  }

  async findById(id: number) {
    return db
      .select({
        ...getTableColumns(events),
        reserved_count: db.$count(
          reservations,
          eq(reservations.event_id, events.event_id),
        ),
      })
      .from(events)
      .where(eq(events.event_id, id))
      .limit(1)
      .then((rows) => rows[0]);
  }

  async create(adminId: number, event: postEventsBodySchema) {
    const createdId = await db
      .insert(events)
      .values({
        admin_id: adminId,
        name: event.name,
        date: new Date(event.date),
        start_time: event.start_time,
        end_time: event.end_time,
        capacity: event.capacity,
      })
      .$returningId();

    const createdEvent = await this.findById(createdId[0].event_id);

    if (createdEvent === undefined) {
      throw new Error('failed to create event');
    }

    return createdEvent;
  }

  async update(id: number, event: putEventsBodySchema) {
    const existsEvent = await this.findById(id);

    if (existsEvent === undefined) {
      throw new Error('event not found');
    }

    await db
      .update(events)
      .set({
        name: event.name,
        date: event.date ? new Date(event.date) : undefined,
        start_time: event.start_time,
        end_time: event.end_time,
      })
      .where(eq(events.event_id, id));

    const updatedEvent = await this.findById(id);

    if (updatedEvent === undefined) {
      throw new Error('failed to update event');
    }

    return updatedEvent;
  }

  async delete(id: number) {
    const existsEvent = await this.findById(id);

    if (existsEvent === undefined) {
      throw new Error('event not found');
    }

    await db.delete(events).where(eq(events.event_id, id));
  }
}
