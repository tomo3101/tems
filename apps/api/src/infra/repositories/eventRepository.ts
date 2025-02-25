import { z } from '@hono/zod-openapi';
import {
  and,
  eq,
  getTableColumns,
  gte,
  like,
  lte,
  sum,
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

    if (query.startDate) {
      filters.push(gte(events.date, new Date(query.startDate)));
    }

    if (query.endDate) {
      filters.push(lte(events.date, new Date(query.endDate)));
    }

    if (query.startTime) {
      filters.push(gte(events.start_time, query.startTime));
    }

    if (query.endTime) {
      filters.push(lte(events.end_time, query.endTime));
    }

    const dynamicQuery = db
      .select({
        ...getTableColumns(events),
        reserved_count: sum(reservations.number_of_people),
      })
      .from(events)
      .where(and(...filters))
      .leftJoin(reservations, eq(events.event_id, reservations.event_id))
      .groupBy(events.event_id)
      .$dynamic();

    return withLimit(dynamicQuery, query.limit);
  }

  async findById(id: number) {
    return db
      .select({
        ...getTableColumns(events),
        reserved_count: sum(reservations.number_of_people),
      })
      .from(events)
      .where(eq(events.event_id, id))
      .leftJoin(reservations, eq(events.event_id, reservations.event_id))
      .groupBy(events.event_id)
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
        start_time: event.startTime,
        end_time: event.endTime,
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
        start_time: event.startTime,
        end_time: event.endTime,
        capacity: event.capacity,
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
