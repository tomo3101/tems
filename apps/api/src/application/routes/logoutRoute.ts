import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { deleteLogoutHandler } from '../controllers/logoutController.js';
import {
  badRequestErrorSchema,
  internalServerErrorSchema,
  notFoundErrorSchema,
} from '../schemas/errorSchema.js';
import {
  deleteLogoutBodySchema,
  deleteLogoutResponseSchema,
} from '../schemas/logoutSchema.js';

// 管理者ログアウト用ルート
export const deleteLogoutRoute = createRoute({
  method: 'delete',
  path: '/',
  description: '管理者ログアウトを行います。',
  request: {
    body: {
      content: {
        'application/json': {
          schema: deleteLogoutBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: deleteLogoutResponseSchema,
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
    404: {
      description: 'Not Found',
      content: {
        'application/json': {
          schema: notFoundErrorSchema,
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
  tags: ['ログアウト'],
});

const app = new OpenAPIHono();

// ルートを登録
app.openapi(deleteLogoutRoute, deleteLogoutHandler);

export default app;
