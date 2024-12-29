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
        event_id: event.event_id,
        admin_id: event.admin_id,
        name: event.name,
        date: dayjs(event.date).format('YYYY-MM-DD'),
        start_time: event.start_time,
        end_time: event.end_time,
        capacity: event.capacity,
        created_at: event.created_at.toISOString(),
        updated_at: event.updated_at.toISOString(),
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
    const event = await eventRepository.findById(param.event_id);

    if (event === undefined) {
      return c.json({ message: 'Not Found', error: 'event not fonud' }, 404);
    }

    return c.json(
      {
        event_id: event.event_id,
        admin_id: event.admin_id,
        name: event.name,
        date: dayjs(event.date).format('YYYY-MM-DD'),
        start_time: event.start_time,
        end_time: event.end_time,
        capacity: event.capacity,
        created_at: event.created_at.toISOString(),
        updated_at: event.updated_at.toISOString(),
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
  const { user_id } = c.get('jwtPayload');

  try {
    const eventRepository = new EventRepository();
    const event = await eventRepository.create(user_id, body);

    return c.json(
      {
        event_id: event.event_id,
        admin_id: event.admin_id,
        name: event.name,
        date: dayjs(event.date).format('YYYY-MM-DD'),
        start_time: event.start_time,
        end_time: event.end_time,
        capacity: event.capacity,
        created_at: event.created_at.toISOString(),
        updated_at: event.updated_at.toISOString(),
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
    const event = await eventRepository.update(param.event_id, body);

    return c.json(
      {
        event_id: event.event_id,
        admin_id: event.admin_id,
        name: event.name,
        date: dayjs(event.date).format('YYYY-MM-DD'),
        start_time: event.start_time,
        end_time: event.end_time,
        capacity: event.capacity,
        created_at: event.created_at.toISOString(),
        updated_at: event.updated_at.toISOString(),
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
    await eventRepository.delete(param.event_id);

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
