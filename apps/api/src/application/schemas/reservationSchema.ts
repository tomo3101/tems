import { z } from '@hono/zod-openapi';

// 予約スキーマ
export const reservationSchema = z.object({
  reservation_id: z.number().int().positive().openapi({ example: 1 }),
  event_id: z.number().int().positive().openapi({ example: 1 }),
  member_id: z.number().int().positive().openapi({ example: 1 }),
  number_of_people: z.number().int().positive().openapi({ example: 1 }),
  qr_code_hash: z.string().openapi({
    example: '3e282f3fab90aef740a6e4baabda7567ab8bba63b9dad310953746d7992a9cde',
  }),
  status: z
    .enum(['reserved', 'checked_in', 'cancelled'])
    .openapi({ example: 'reserved' }),
  created_at: z
    .string()
    .datetime()
    .openapi({ example: '2022-01-01T00:00:00.000Z' }),
  checked_in_at: z
    .string()
    .datetime()
    .optional()
    .openapi({ example: '2022-01-01T00:00:00.000Z' }),
});

// 予約リストスキーマ
export const reservationsListSchema = z
  .array(reservationSchema)
  .openapi('ReservationsList');

// 予約IDパラメータスキーマ
export const reservationIdParamsSchema = z.object({
  reservation_id: z
    .string()
    .pipe(z.coerce.number().int().positive())
    .openapi({ example: '1' }),
});

// 予約全件取得用クエリスキーマ
export const getReservationsQuerySchema = z.object({
  event_id: z
    .string()
    .pipe(z.coerce.number().int().positive())
    .optional()
    .openapi({ example: '1' }),
  member_id: z
    .string()
    .pipe(z.coerce.number().int().positive())
    .optional()
    .openapi({ example: '1' }),
  status: z
    .enum(['reserved', 'checked_in', 'cancelled'])
    .optional()
    .openapi({ example: 'reserved' }),
  start_time: z.string().date().optional().openapi({ example: '2022-01-01' }),
  end_time: z.string().date().optional().openapi({ example: '2022-12-31' }),
  limit: z
    .string()
    .pipe(z.coerce.number().int().positive())
    .optional()
    .openapi({ example: '10' }),
});

// メンバーの予約取得用クエリスキーマ
export const getReservationsByMemberIdQuerySchema = z.object({
  event_id: z
    .string()
    .pipe(z.coerce.number().int().positive())
    .optional()
    .openapi({ example: '1' }),
  status: z
    .enum(['reserved', 'checked_in', 'cancelled'])
    .optional()
    .openapi({ example: 'reserved' }),
  start_time: z.string().date().optional().openapi({ example: '2022-01-01' }),
  end_time: z.string().date().optional().openapi({ example: '2022-12-31' }),
  limit: z
    .string()
    .pipe(z.coerce.number().int().positive())
    .optional()
    .openapi({ example: '10' }),
});

// 予約作成用ボディスキーマ
export const postReservationsBodySchema = z.object({
  event_id: z.number().int().positive().openapi({ example: 1 }),
  number_of_people: z.number().int().positive().openapi({ example: 1 }),
});

// 予約更新用ボディスキーマ
export const putReservationsBodySchema = z.object({
  number_of_people: z
    .number()
    .int()
    .positive()
    .optional()
    .openapi({ example: 1 }),
  status: z
    .enum(['reserved', 'checked_in', 'cancelled'])
    .optional()
    .openapi({ example: 'reserved' }),
});

// 予約削除用レスポンススキーマ
export const deleteReservationsResponseSchema = z.object({
  message: z.string().openapi({ example: 'Successful deletion' }),
});
