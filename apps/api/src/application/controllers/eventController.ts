import type { RouteHandler } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import dayjs from 'dayjs';
import { EventRepository } from '../../infra/repositories/eventRepository.js';
import type {
  deleteEventsRoute,
  getEventsByIdRoute,
  getEventsRoute,
  postEventsRoute,
  putEventsRoute,
} from '../routes/eventRoute.js';
import type { eventsListSchema } from '../schemas/eventSchema.js';
import type { AccessTokenPayload } from '../../utils/jwt.js';

type eventsListSchema = z.infer<typeof eventsListSchema>;

// イベント一覧取得用ハンドラ
export const getEventsHandler: RouteHandler<typeof getEventsRoute> = async (
  c,
) => {
  const query = c.req.valid('query');

  try {
    const eventRepository = new EventRepository();
    const events = await eventRepository.findAll(query);

    const response: eventsListSchema = events.map((event) => {
      return {
        id: event.event_id,
        adminId: event.admin_id,
        name: event.name,
        date: dayjs(event.date).format('YYYY-MM-DD'),
        startTime: event.start_time,
        endTime: event.end_time,
        capacity: event.capacity,
        reservedCount: Number(event.reserved_count),
        createdAt: event.created_at.toISOString(),
        updatedAt: event.updated_at.toISOString(),
      };
    });

    return c.json(response, 200);
  } catch (e: unknown) {
    console.log(e);
    return c.json(
      {
        message: 'Internal Server Error',
        error: e instanceof Error ? e.message : undefined,
      },
      500,
    );
  }
};

// イベント一件取得用ハンドラ
export const getEventsByIdHandler: RouteHandler<
  typeof getEventsByIdRoute
> = async (c) => {
  const param = c.req.valid('param');

  try {
    const eventRepository = new EventRepository();
    const event = await eventRepository.findById(param.id);

    if (event === undefined) {
      return c.json({ message: 'Not Found', error: 'event not fonud' }, 404);
    }

    return c.json(
      {
        id: event.event_id,
        adminId: event.admin_id,
        name: event.name,
        date: dayjs(event.date).format('YYYY-MM-DD'),
        startTime: event.start_time,
        endTime: event.end_time,
        capacity: event.capacity,
        reservedCount: Number(event.reserved_count),
        createdAt: event.created_at.toISOString(),
        updatedAt: event.updated_at.toISOString(),
      },
      200,
    );
  } catch (e: unknown) {
    console.log(e);
    return c.json(
      {
        message: 'Internal Server Error',
        error: e instanceof Error ? e.message : undefined,
      },
      500,
    );
  }
};

// イベント作成用ハンドラ
export const postEventsHandler: RouteHandler<typeof postEventsRoute> = async (
  c,
) => {
  const body = c.req.valid('json');
  const { userId } = c.get('jwtPayload') as AccessTokenPayload;

  try {
    const eventRepository = new EventRepository();
    const event = await eventRepository.create(userId, body);

    return c.json(
      {
        id: event.event_id,
        adminId: event.admin_id,
        name: event.name,
        date: dayjs(event.date).format('YYYY-MM-DD'),
        startTime: event.start_time,
        endTime: event.end_time,
        capacity: event.capacity,
        createdAt: event.created_at.toISOString(),
        updatedAt: event.updated_at.toISOString(),
      },
      201,
    );
  } catch (e: unknown) {
    console.log(e);
    return c.json(
      {
        message: 'Internal Server Error',
        error: e instanceof Error ? e.message : undefined,
      },
      500,
    );
  }
};

// イベント更新用ハンドラ
export const putEventsHandler: RouteHandler<typeof putEventsRoute> = async (
  c,
) => {
  const body = c.req.valid('json');
  const param = c.req.valid('param');

  try {
    const eventRepository = new EventRepository();
    const event = await eventRepository.update(param.id, body);

    return c.json(
      {
        id: event.event_id,
        adminId: event.admin_id,
        name: event.name,
        date: dayjs(event.date).format('YYYY-MM-DD'),
        startTime: event.start_time,
        endTime: event.end_time,
        capacity: event.capacity,
        createdAt: event.created_at.toISOString(),
        updatedAt: event.updated_at.toISOString(),
      },
      200,
    );
  } catch (e: unknown) {
    console.log(e);

    if (e instanceof Error && e.message === 'event not found') {
      return c.json({ message: 'Not Found', error: e.message }, 404);
    }

    return c.json(
      {
        message: 'Internal Server Error',
        error: e instanceof Error ? e.message : undefined,
      },
      500,
    );
  }
};

// イベント削除用ハンドラ
export const deleteEventsHandler: RouteHandler<
  typeof deleteEventsRoute
> = async (c) => {
  const param = c.req.valid('param');

  try {
    const eventRepository = new EventRepository();
    await eventRepository.delete(param.id);

    return c.json(
      {
        message: 'Successful deletion',
      },
      200,
    );
  } catch (e: unknown) {
    console.log(e);

    if (e instanceof Error && e.message === 'event not found') {
      return c.json({ message: 'Not Found', error: e.message }, 404);
    }

    return c.json(
      {
        message: 'Internal Server Error',
        error: e instanceof Error ? e.message : undefined,
      },
      500,
    );
  }
};
