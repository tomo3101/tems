import { z } from '@hono/zod-openapi';

// イベントスキーマ
export const eventSchema = z.object({
  id: z.number().int().positive().openapi({ example: 1 }),
  adminId: z.number().int().positive().openapi({ example: 1 }),
  name: z.string().openapi({ example: 'イベント名' }),
  date: z.string().date().openapi({ example: '2024-01-01' }),
  startTime: z.string().time().openapi({ example: '12:00:00' }),
  endTime: z.string().time().openapi({ example: '13:00:00' }),
  capacity: z.number().int().positive().openapi({ example: 20 }),
  reservedCount: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .openapi({ example: 10 }),
  createdAt: z
    .string()
    .datetime()
    .openapi({ example: '2024-01-01T12:00:000Z' }),
  updatedAt: z
    .string()
    .datetime()
    .openapi({ example: '2024-01-01T12:00:000Z' }),
});

// イベントリストスキーマ
export const eventsListSchema = z.array(eventSchema).openapi('EventsList');

// イベントIDパラメータスキーマ
export const eventIdParamsSchema = z.object({
  id: z
    .string()
    .pipe(z.coerce.number().int().positive())
    .openapi({ example: '1' }),
});

// イベント全件取得用クエリスキーマ
export const getEventsQuerySchema = z.object({
  name: z.string().optional().openapi({ example: 'イベント名' }),
  startDate: z.string().date().optional().openapi({ example: '2024-01-01' }),
  endDate: z.string().date().optional().openapi({ example: '2024-12-31' }),
  startTime: z.string().time().optional().openapi({ example: '12:00:00' }),
  endTime: z.string().time().optional().openapi({ example: '13:00:00' }),
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
  startTime: z.string().time().openapi({ example: '12:00:00' }),
  endTime: z.string().time().openapi({ example: '13:00:00' }),
  capacity: z.number().int().positive().openapi({ example: 20 }),
});

// イベント更新用ボディスキーマ
export const putEventsBodySchema = z.object({
  name: z.string().optional().openapi({ example: 'イベント名' }),
  date: z.string().date().optional().openapi({ example: '2024-01-01' }),
  startTime: z.string().time().optional().openapi({ example: '12:00:00' }),
  endTime: z.string().time().optional().openapi({ example: '13:00:00' }),
  capacity: z.number().int().positive().optional().openapi({ example: 20 }),
});

// イベント削除用レスポンススキーマ
export const deleteEventsResponseSchema = z.object({
  message: z.string().openapi({ example: 'Successful deletion' }),
});
