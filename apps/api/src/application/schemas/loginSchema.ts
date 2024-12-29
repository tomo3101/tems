import { z } from '@hono/zod-openapi';

// ログイン用ボディスキーマ
export const postLoginBodySchema = z.object({
  email: z.string().email().openapi({ example: 'example@email.com' }),
  password: z.string().openapi({ example: 'password' }),
  role: z.enum(['admin', 'member']).openapi({ example: 'admin' }),
});

// ログイン用レスポンススキーマ
export const postLoginResponseSchema = z.object({
  user_id: z.number().int().positive().openapi({ example: 1 }),
  name: z.string().openapi({ example: '田中 太郎' }),
  email: z.string().email().openapi({ example: 'example@email.com' }),
  role: z.enum(['admin', 'member']).openapi({ example: 'admin' }),
  access_token: z.string().openapi({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3MDQwNzgwMDB9.4hjMZRIni_BkGGSE2bznW_Z-W8KZAYYLO84nBN8kwPI',
  }),
  access_token_exp: z.number().openapi({
    example: 1704078000,
  }),
  refresh_token: z.string().openapi({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3MDQxNjQ0MDB9.bVHuEZqLypjmqyONRheFEqEwt4KuIYht-VJ0cPg3b0E',
  }),
  refresh_token_exp: z.number().openapi({
    example: 1704078000,
  }),
});
