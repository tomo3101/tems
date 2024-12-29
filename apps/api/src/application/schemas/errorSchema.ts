import { z } from '@hono/zod-openapi';

export const badRequestErrorSchema = z.object({
  message: z.string().openapi({ example: 'Bad Request' }),
  error: z.string().optional().openapi({ example: 'Error message' }),
});

export const unauthorizedErrorSchema = z.object({
  message: z.string().openapi({ example: 'Unauthorized' }),
  error: z.string().optional().openapi({ example: 'Error message' }),
});

export const forbiddenErrorSchema = z.object({
  message: z.string().openapi({ example: 'Forbidden' }),
  error: z.string().optional().openapi({ example: 'Error message' }),
});

export const notFoundErrorSchema = z.object({
  message: z.string().openapi({ example: 'Not Found' }),
  error: z.string().optional().openapi({ example: 'Error message' }),
});

export const internalServerErrorSchema = z.object({
  message: z.string().openapi({ example: 'Internal Server Error' }),
  error: z.string().optional().openapi({ example: 'Error message' }),
});
