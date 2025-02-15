import { z } from '@hono/zod-openapi';

// 予約スキーマ
export const reservationSchema = z.object({
  id: z.number().int().positive().openapi({ example: 1 }),
  eventId: z.number().int().positive().openapi({ example: 1 }),
  memberId: z.number().int().positive().openapi({ example: 1 }),
  numberOfPeople: z.number().int().positive().openapi({ example: 1 }),
  qrCodeHash: z.string().openapi({
    example: '3e282f3fab90aef740a6e4baabda7567ab8bba63b9dad310953746d7992a9cde',
  }),
  status: z
    .enum(['reserved', 'checked_in', 'cancelled', 'called', 'done'])
    .openapi({ example: 'reserved' }),
  callNumber: z.number().int().positive().openapi({ example: 1 }),
  createdAt: z
    .string()
    .datetime()
    .openapi({ example: '2022-01-01T00:00:00.000Z' }),
  checkedInAt: z
    .string()
    .datetime()
    .optional()
    .openapi({ example: '2022-01-01T00:00:00.000Z' }),
  calledAt: z
    .string()
    .datetime()
    .optional()
    .openapi({ example: '2022-01-01T00:00:00.000Z' }),
});

// 予約イベントスキーマ
export const reservationWithEventSchema = reservationSchema.extend({
  eventName: z.string().openapi({ example: 'イベント名' }),
  eventDate: z.string().date().openapi({ example: '2022-01-01' }),
  eventStartTime: z.string().time().openapi({ example: '12:00:00' }),
  eventEndTime: z.string().time().openapi({ example: '13:00:00' }),
});

// 予約リストスキーマ
export const reservationsListSchema = z
  .array(reservationSchema)
  .openapi('ReservationsList');

// 予約イベントリストスキーマ
export const reservationsWithEventListSchema = z
  .array(reservationWithEventSchema)
  .openapi('ReservationsWithEventList');

// 予約IDパラメータスキーマ
export const reservationIdParamsSchema = z.object({
  id: z
    .string()
    .pipe(z.coerce.number().int().positive())
    .openapi({ example: '1' }),
});

// QRコードハッシュパラメータスキーマ
export const qrCodeHashParamsSchema = z.object({
  qrCodeHash: z.string().openapi({
    example: '3e282f3fab90aef740a6e4baabda7567ab8bba63b9dad310953746d7992a9cde',
  }),
});

// 予約全件取得用クエリスキーマ
export const getReservationsQuerySchema = z.object({
  eventId: z
    .string()
    .pipe(z.coerce.number().int().positive())
    .optional()
    .openapi({ example: '1' }),
  memberId: z
    .string()
    .pipe(z.coerce.number().int().positive())
    .optional()
    .openapi({ example: '1' }),
  qrCodeHash: z.string().optional().openapi({
    example: '3e282f3fab90aef740a6e4baabda7567ab8bba63b9dad310953746d7992a9cde',
  }),
  status: z
    .enum(['reserved', 'checked_in', 'cancelled', 'called'])
    .optional()
    .openapi({ example: 'reserved' }),
  startTime: z.string().date().optional().openapi({ example: '2022-01-01' }),
  endTime: z.string().date().optional().openapi({ example: '2022-12-31' }),
  limit: z
    .string()
    .pipe(z.coerce.number().int().positive())
    .optional()
    .openapi({ example: '10' }),
});

// メンバーの予約取得用クエリスキーマ
export const getReservationsByMemberIdQuerySchema = z.object({
  id: z
    .string()
    .pipe(z.coerce.number().int().positive())
    .optional()
    .openapi({ example: '1' }),
  status: z
    .enum(['reserved', 'checked_in', 'cancelled', 'called'])
    .optional()
    .openapi({ example: 'reserved' }),
  startTime: z.string().date().optional().openapi({ example: '2022-01-01' }),
  endTime: z.string().date().optional().openapi({ example: '2022-12-31' }),
  limit: z
    .string()
    .pipe(z.coerce.number().int().positive())
    .optional()
    .openapi({ example: '10' }),
});

// 予約作成用ボディスキーマ
export const postReservationsBodySchema = z.object({
  eventId: z.number().int().positive().openapi({ example: 1 }),
  numberOfPeople: z.number().int().positive().openapi({ example: 1 }),
});

// 予約更新用ボディスキーマ
export const putReservationsBodySchema = z.object({
  numberOfPeople: z
    .number()
    .int()
    .positive()
    .optional()
    .openapi({ example: 1 }),
  status: z
    .enum(['reserved', 'checked_in', 'cancelled', 'called'])
    .optional()
    .openapi({ example: 'reserved' }),
});

// 予約削除用レスポンススキーマ
export const deleteReservationsResponseSchema = z.object({
  message: z.string().openapi({ example: 'Successful deletion' }),
});
