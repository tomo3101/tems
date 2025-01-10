import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import {
  deleteEventsHandler,
  getEventsByIdHandler,
  getEventsHandler,
  postEventsHandler,
  putEventsHandler,
} from '../controllers/eventController.js';
import {
  adminAuthMiddleware,
  jwtAuthMiddleware,
} from '../middlewares/jwtAuthMiddleware.js';
import {
  badRequestErrorSchema,
  forbiddenErrorSchema,
  internalServerErrorSchema,
  notFoundErrorSchema,
  unauthorizedErrorSchema,
} from '../schemas/errorSchema.js';
import {
  deleteEventsResponseSchema,
  eventIdParamsSchema,
  eventSchema,
  eventsListSchema,
  getEventsQuerySchema,
  postEventsBodySchema,
} from '../schemas/eventSchema.js';

// イベント一覧取得用ルート
export const getEventsRoute = createRoute({
  method: 'get',
  path: '/',
  description: 'イベント一覧を取得します。',
  request: {
    query: getEventsQuerySchema,
  },
  security: [{ JWT: [] }],
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: eventsListSchema,
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
    403: {
      description: 'Forbidden',
      content: {
        'application/json': {
          schema: forbiddenErrorSchema,
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
  tags: ['イベント'],
});

// イベント一件取得用ルート
export const getEventsByIdRoute = createRoute({
  method: 'get',
  path: '/{event_id}',
  description: '指定したイベントを取得します。',
  request: {
    params: eventIdParamsSchema,
  },
  security: [{ JWT: [] }],
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: eventSchema,
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
    403: {
      description: 'Forbidden',
      content: {
        'application/json': {
          schema: forbiddenErrorSchema,
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
  tags: ['イベント'],
});

// イベント作成用ルート
export const postEventsRoute = createRoute({
  method: 'post',
  path: '/',
  description: 'イベントを作成します。',
  request: {
    body: {
      content: {
        'application/json': {
          schema: postEventsBodySchema,
        },
      },
    },
  },
  security: [{ JWT: [] }],
  responses: {
    201: {
      description: 'Created',
      content: {
        'application/json': {
          schema: eventSchema,
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
    403: {
      description: 'Forbidden',
      content: {
        'application/json': {
          schema: forbiddenErrorSchema,
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
  tags: ['イベント'],
});

// イベント更新用ルート
export const putEventsRoute = createRoute({
  method: 'put',
  path: '/{event_id}',
  description: '指定したイベントを更新します。',
  request: {
    params: eventIdParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: postEventsBodySchema,
        },
      },
    },
  },
  security: [{ JWT: [] }],
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: eventSchema,
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
    403: {
      description: 'Forbidden',
      content: {
        'application/json': {
          schema: forbiddenErrorSchema,
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
  tags: ['イベント'],
});

// イベント削除用ルート
export const deleteEventsRoute = createRoute({
  method: 'delete',
  path: '/{event_id}',
  description: '指定したイベントを削除します。',
  request: {
    params: eventIdParamsSchema,
  },
  security: [{ JWT: [] }],
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: deleteEventsResponseSchema,
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
    403: {
      description: 'Forbidden',
      content: {
        'application/json': {
          schema: forbiddenErrorSchema,
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
  tags: ['イベント'],
});

const app = new OpenAPIHono();

// ミドルウェアを登録
app.use('*', jwtAuthMiddleware, adminAuthMiddleware);

// ルートを登録
const routes = app
  .openapi(getEventsRoute, getEventsHandler)
  .openapi(postEventsRoute, postEventsHandler)
  .openapi(getEventsByIdRoute, getEventsByIdHandler)
  .openapi(putEventsRoute, putEventsHandler)
  .openapi(deleteEventsRoute, deleteEventsHandler);

export default routes;
