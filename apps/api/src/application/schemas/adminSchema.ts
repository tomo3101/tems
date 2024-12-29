import { z } from '@hono/zod-openapi';

// 管理者スキーマ
export const adminSchema = z.object({
  admin_id: z.number().int().positive().openapi({ example: 1 }),
  name: z.string().openapi({ example: '田中 太郎' }),
  email: z.string().email().openapi({ example: 'example@email.com' }),
  created_at: z
    .string()
    .datetime()
    .openapi({ example: '2024-01-01T12:00:000Z' }),
  updated_at: z
    .string()
    .datetime()
    .openapi({ example: '2024-01-01T12:00:000Z' }),
});

// 管理者リストスキーマ
export const adminsListSchema = z.array(adminSchema).openapi('AdminsList');

// 管理者IDパラメータスキーマ
export const adminIdParamsSchema = z.object({
  admin_id: z
    .string()
    .pipe(z.coerce.number().int().positive())
    .openapi({ example: '1' }),
});

// 管理者全件取得用クエリスキーマ
export const getAdminsQuerySchema = z.object({
  name: z.string().optional().openapi({ example: '田中 太郎' }),
  email: z
    .string()
    .email()
    .optional()
    .openapi({ example: 'example@email.com' }),
  start_date: z.string().date().optional().openapi({ example: '2024-01-01' }),
  end_date: z.string().date().optional().openapi({ example: '2024-12-31' }),
  limit: z
    .string()
    .pipe(z.coerce.number().int().positive())
    .optional()
    .openapi({ example: '10' }),
});

// 管理者作成用ボディスキーマ
export const postAdminsBodySchema = z.object({
  name: z.string().openapi({ example: '田中 太郎' }),
  email: z.string().email().openapi({ example: 'example@email.com' }),
  password: z.string().openapi({
    example: 'password',
  }),
});

// 管理者更新用ボディスキーマ
export const putAdminsBodySchema = z.object({
  name: z.string().optional().openapi({ example: '田中 太郎' }),
  email: z
    .string()
    .email()
    .optional()
    .openapi({ example: 'example.email.com' }),
  password: z.string().optional().openapi({
    example: 'password',
  }),
});

// 管理者削除用レスポンススキーマ
export const deleteAdminsResponseSchema = z.object({
  message: z.string().openapi({ example: 'Successful deletion' }),
});
