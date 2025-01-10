import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { postRefreshHandler } from '../controllers/refreshController.js';
import {
  badRequestErrorSchema,
  internalServerErrorSchema,
  unauthorizedErrorSchema,
} from '../schemas/errorSchema.js';
import {
  postRefreshBodySchema,
  postRefreshResponseSchema,
} from '../schemas/refreshSchema.js';

// アクセストークンのリフレッシュ用ルート
export const postRefreshRoute = createRoute({
  method: 'post',
  path: '/',
  description: 'アクセストークンをリフレッシュトークンを用いて再取得します。',
  request: {
    body: {
      content: {
        'application/json': {
          schema: postRefreshBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: postRefreshResponseSchema,
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
  tags: ['リフレッシュトークン'],
});

const app = new OpenAPIHono();

// ルートを登録
const routes = app.openapi(postRefreshRoute, postRefreshHandler);

export default routes;
