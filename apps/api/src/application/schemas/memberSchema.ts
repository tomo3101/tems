import { z } from '@hono/zod-openapi';

// 会員スキーマ
export const memberSchema = z.object({
  id: z.number().int().positive().openapi({ example: 1 }),
  name: z.string().openapi({ example: '田中 太郎' }),
  email: z.string().email().openapi({ example: 'example@email.com' }),
  phoneNumber: z
    .string()
    .optional()
    .nullable()
    .openapi({ example: '0123-456-789' }),
  passwordHash: z.string().openapi({
    example:
      'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86',
  }),
  createdAt: z
    .string()
    .datetime()
    .openapi({ example: '2024-01-01T12:00:000Z' }),
  updatedAt: z
    .string()
    .datetime()
    .openapi({ example: '2024-01-01T12:00:000Z' }),
});

// 会員リストスキーマ
export const membersListSchema = z.array(memberSchema).openapi('MembersList');

// 会員IDパラメータスキーマ
export const memberIdParamsSchema = z.object({
  id: z
    .string()
    .pipe(z.coerce.number().int().positive())
    .openapi({ example: '1' }),
});

// 会員全件取得用クエリスキーマ
export const getMembersQuerySchema = z.object({
  name: z.string().optional().openapi({ example: '田中 太郎' }),
  email: z
    .string()
    .email()
    .optional()
    .openapi({ example: 'example@email.com' }),
  phoneNumber: z.string().optional().openapi({ example: '0123-456-789' }),
  startDate: z.string().date().optional().openapi({ example: '2024-01-01' }),
  endDate: z.string().date().optional().openapi({ example: '2024-12-31' }),
  limit: z
    .string()
    .pipe(z.coerce.number().int().positive())
    .optional()
    .openapi({ example: '10' }),
});

// 会員作成用ボディスキーマ
export const postMembersBodySchema = z.object({
  name: z.string().openapi({ example: '田中 太郎' }),
  email: z.string().email().openapi({ example: 'example@email.com' }),
  phoneNumber: z.string().optional().openapi({ example: '0123-456-789' }),
  password: z.string().openapi({
    example: 'password',
  }),
});

// 会員更新用ボディスキーマ
export const putMembersBodySchema = z.object({
  name: z.string().optional().openapi({ example: '田中 太郎' }),
  email: z
    .string()
    .email()
    .optional()
    .openapi({ example: 'example@email.com' }),
  phoneNumber: z.string().optional().openapi({ example: '0123-456-789' }),
  password: z.string().optional().openapi({
    example: 'password',
  }),
});

// 会員削除用レスポンススキーマ
export const deleteMembersResponseSchema = z.object({
  message: z.string().openapi({ example: 'Successful deletion' }),
});
