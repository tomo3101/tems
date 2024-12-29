import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { postLoginHandler } from '../controllers/loginController.js';
import {
  badRequestErrorSchema,
  internalServerErrorSchema,
  unauthorizedErrorSchema,
} from '../schemas/errorSchema.js';
import {
  postLoginBodySchema,
  postLoginResponseSchema,
} from '../schemas/loginSchema.js';

// ログイン用ルート
export const postLoginAdminRoute = createRoute({
  method: 'post',
  path: '/',
  description: 'ログインを行います。',
  request: {
    body: {
      content: {
        'application/json': {
          schema: postLoginBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Success',
      headers: {
        'Set-Cookie': {
          description:
            'アクセストークンとリフレッシュトークンをCookieにセットします。',
          schema: {
            type: 'string',
          },
        },
      },
      content: {
        'application/json': {
          schema: postLoginResponseSchema,
        },
      },
    },
    400: {
      description: 'Bad Request',
      content: {
        'application/json': {
          schema: badRequestErrorSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: unauthorizedErrorSchema,
        },
      },
    },
    500: {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: internalServerErrorSchema,
        },
      },
    },
  },
  tags: ['ログイン'],
});

const app = new OpenAPIHono();

// ルートを登録
app.openapi(postLoginAdminRoute, postLoginHandler);

export default app;
