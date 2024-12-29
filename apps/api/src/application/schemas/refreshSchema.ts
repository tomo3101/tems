import { z } from '@hono/zod-openapi';

// アクセストークンのリフレッシュ用ボディスキーマ
export const postRefreshBodySchema = z.object({
  refresh_token: z.string().openapi({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3MDQxNjQ0MDB9.bVHuEZqLypjmqyONRheFEqEwt4KuIYht-VJ0cPg3b0E',
  }),
});

// アクセストークンのリフレッシュ用レスポンススキーマ
export const postRefreshResponseSchema = z.object({
  user_id: z.number().int().positive().openapi({ example: 1 }),
  role: z.enum(['admin', 'member']).openapi({ example: 'admin' }),
  access_token: z.string().openapi({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3MDQwNzgwMDB9.4hjMZRIni_BkGGSE2bznW_Z-W8KZAYYLO84nBN8kwPI',
  }),
  access_token_exp: z.number().openapi({ example: 1704078000 }),
});
