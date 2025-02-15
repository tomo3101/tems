import { z } from '@hono/zod-openapi';

// ログイン用ボディスキーマ
export const postLoginBodySchema = z.object({
  email: z.string().email().openapi({ example: 'example@email.com' }),
  password: z.string().openapi({ example: 'password' }),
  role: z.enum(['admin', 'member']).openapi({ example: 'admin' }),
});

// ログイン用レスポンススキーマ
export const postLoginResponseSchema = z.object({
  userId: z.number().int().positive().openapi({ example: 1 }),
  name: z.string().openapi({ example: '田中 太郎' }),
  email: z.string().email().openapi({ example: 'example@email.com' }),
  role: z.enum(['admin', 'member']).openapi({ example: 'admin' }),
  accessToken: z.string().openapi({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3MDQwNzgwMDB9.4hjMZRIni_BkGGSE2bznW_Z-W8KZAYYLO84nBN8kwPI',
  }),
  accessTokenExp: z.number().openapi({
    example: 1704078000,
  }),
  refreshToken: z.string().openapi({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3MDQxNjQ0MDB9.bVHuEZqLypjmqyONRheFEqEwt4KuIYht-VJ0cPg3b0E',
  }),
  refreshTokenExp: z.number().openapi({
    example: 1704078000,
  }),
});
