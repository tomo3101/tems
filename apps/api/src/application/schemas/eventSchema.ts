import { z } from '@hono/zod-openapi';

// イベントスキーマ
export const eventSchema = z.object({
  event_id: z.number().int().positive().openapi({ example: 1 }),
  admin_id: z.number().int().positive().openapi({ example: 1 }),
  name: z.string().openapi({ example: 'イベント名' }),
  date: z.string().date().openapi({ example: '2024-01-01' }),
  start_time: z.string().time().openapi({ example: '12:00:00' }),
  end_time: z.string().time().openapi({ example: '13:00:00' }),
  capacity: z.number().int().positive().openapi({ example: 20 }),
  created_at: z
    .string()
    .datetime()
    .openapi({ example: '2024-01-01T12:00:000Z' }),
  updated_at: z
    .string()
    .datetime()
    .openapi({ example: '2024-01-01T12:00:000Z' }),
});

// イベントリストスキーマ
export const eventsListSchema = z.array(eventSchema).openapi('EventsList');

// イベントIDパラメータスキーマ
export const eventIdParamsSchema = z.object({
  event_id: z
    .string()
    .pipe(z.coerce.number().int().positive())
    .openapi({ example: '1' }),
});

// イベント全件取得用クエリスキーマ
export const getEventsQuerySchema = z.object({
  name: z.string().optional().openapi({ example: 'イベント名' }),
  start_date: z.string().date().optional().openapi({ example: '2024-01-01' }),
  end_date: z.string().date().optional().openapi({ example: '2024-12-31' }),
  start_time: z.string().time().optional().openapi({ example: '12:00:00' }),
  end_time: z.string().time().optional().openapi({ example: '13:00:00' }),
  limit: z
    .string()
    .pipe(z.coerce.number().int().positive())
    .optional()
    .openapi({ example: '10' }),
});

// イベント作成用ボディスキーマ
export const postEventsBodySchema = z.object({
  name: z.string().openapi({ example: 'イベント名' }),
  date: z.string().date().openapi({ example: '2024-01-01' }),
  start_time: z.string().time().openapi({ example: '12:00:00' }),
  end_time: z.string().time().openapi({ example: '13:00:00' }),
  capacity: z.number().int().positive().openapi({ example: 20 }),
});

// イベント更新用ボディスキーマ
export const putEventsBodySchema = z.object({
  name: z.string().optional().openapi({ example: 'イベント名' }),
  date: z.string().date().optional().openapi({ example: '2024-01-01' }),
  start_time: z.string().time().optional().openapi({ example: '12:00:00' }),
  end_time: z.string().time().optional().openapi({ example: '13:00:00' }),
  capacity: z.number().int().positive().optional().openapi({ example: 20 }),
});

// イベント削除用レスポンススキーマ
export const deleteEventsResponseSchema = z.object({
  message: z.string().openapi({ example: 'Successful deletion' }),
});
