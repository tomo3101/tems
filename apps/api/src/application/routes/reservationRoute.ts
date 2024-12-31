import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import {
  deleteReservationsHandler,
  getReservationsByIdHandler,
  getReservationsByMemberHandler,
  getReservationsHandler,
  postReservationsHandler,
  putReservationsHandler,
} from '../controllers/reservationController.js';
import {
  adminAuthMiddleware,
  jwtAuthMiddleware,
  reservationAuthMiddleware,
  userAuthMiddleware,
} from '../middlewares/jwtAuthMiddleware.js';
import {
  badRequestErrorSchema,
  forbiddenErrorSchema,
  internalServerErrorSchema,
  notFoundErrorSchema,
  unauthorizedErrorSchema,
} from '../schemas/errorSchema.js';
import { memberIdParamsSchema } from '../schemas/memberSchema.js';
import {
  deleteReservationsResponseSchema,
  getReservationsByMemberIdQuerySchema,
  getReservationsQuerySchema,
  postReservationsBodySchema,
  putReservationsBodySchema,
  reservationIdParamsSchema,
  reservationSchema,
  reservationsListSchema,
} from '../schemas/reservationSchema.js';

// 予約一覧取得用ルート
export const getReservationsRoute = createRoute({
  method: 'get',
  path: '/',
  description: '予約一覧を取得します。',
  request: {
    query: getReservationsQuerySchema,
  },
  middleware: [jwtAuthMiddleware, adminAuthMiddleware] as const,
  security: [{ JWT: [] }],
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: reservationsListSchema,
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
  tags: ['予約'],
});

// 予約一件取得用ルート
export const getReservationsByIdRoute = createRoute({
  method: 'get',
  path: '/{reservation_id}',
  description: '指定した予約を取得します。',
  request: {
    params: reservationIdParamsSchema,
  },
  middleware: [jwtAuthMiddleware, reservationAuthMiddleware] as const,
  security: [{ JWT: [] }],
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: reservationSchema,
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
  tags: ['予約'],
});

// 予約作成用ルート
export const postReservationsRoute = createRoute({
  method: 'post',
  path: '/',
  description: '予約を作成します。',
  request: {
    body: {
      content: {
        'application/json': {
          schema: postReservationsBodySchema,
        },
      },
    },
  },
  middleware: [jwtAuthMiddleware] as const,
  security: [{ JWT: [] }],
  responses: {
    201: {
      description: 'Success',
      content: {
        'application/json': {
          schema: reservationSchema,
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
  tags: ['予約'],
});

// 予約更新用ルート
export const putReservationsRoute = createRoute({
  method: 'put',
  path: '/{reservation_id}',
  description: '指定した予約を更新します。',
  request: {
    params: reservationIdParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: putReservationsBodySchema,
        },
      },
    },
  },
  middleware: [jwtAuthMiddleware, reservationAuthMiddleware] as const,
  security: [{ JWT: [] }],
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: reservationSchema,
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
  tags: ['予約'],
});

// 予約削除用ルート
export const deleteReservationsRoute = createRoute({
  method: 'delete',
  path: '/{reservation_id}',
  description: '指定した予約を削除します。',
  request: {
    params: reservationIdParamsSchema,
  },
  middleware: [jwtAuthMiddleware, reservationAuthMiddleware] as const,
  security: [{ JWT: [] }],
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: deleteReservationsResponseSchema,
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
  tags: ['予約'],
});

// 指定のメンバーの予約一覧取得用ルート
export const getReservationsByMemberRoute = createRoute({
  method: 'get',
  path: '/members/{member_id}',
  description: '指定したメンバーの予約一覧を取得します。',
  request: {
    params: memberIdParamsSchema,
    query: getReservationsByMemberIdQuerySchema,
  },
  middleware: [jwtAuthMiddleware, userAuthMiddleware] as const,
  security: [{ JWT: [] }],
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: reservationsListSchema,
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
  tags: ['予約'],
});

const app = new OpenAPIHono();

app.openapi(getReservationsRoute, getReservationsHandler);
app.openapi(postReservationsRoute, postReservationsHandler);
app.openapi(getReservationsByIdRoute, getReservationsByIdHandler);
app.openapi(putReservationsRoute, putReservationsHandler);
app.openapi(deleteReservationsRoute, deleteReservationsHandler);
app.openapi(getReservationsByMemberRoute, getReservationsByMemberHandler);

export default app;
