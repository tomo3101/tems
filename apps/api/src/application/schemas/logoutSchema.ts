import { z } from '@hono/zod-openapi';

// ログアウト用ボディスキーマ
export const deleteLogoutBodySchema = z.object({
  refreshToken: z.string().openapi({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3MDQxNjQ0MDB9.bVHuEZqLypjmqyONRheFEqEwt4KuIYht-VJ0cPg3b0E',
  }),
});

// ログアウト用レスポンススキーマ
export const deleteLogoutResponseSchema = z.object({
  userId: z.number().int().positive().openapi({ example: 1 }),
  role: z.enum(['admin', 'member']).openapi({ example: 'admin' }),
});
