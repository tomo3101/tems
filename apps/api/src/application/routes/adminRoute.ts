import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import {
  deleteAdminsHandler,
  getAdminsByIdHandler,
  getAdminsHandler,
  postAdminsHandler,
  putAdminsHandler,
} from '../controllers/adminController.js';
import {
  adminAuthMiddleware,
  jwtAuthMiddleware,
} from '../middlewares/jwtAuthMiddleware.js';
import {
  adminIdParamsSchema,
  adminSchema,
  adminsListSchema,
  deleteAdminsResponseSchema,
  getAdminsQuerySchema,
  postAdminsBodySchema,
  putAdminsBodySchema,
} from '../schemas/adminSchema.js';
import {
  badRequestErrorSchema,
  forbiddenErrorSchema,
  internalServerErrorSchema,
  notFoundErrorSchema,
  unauthorizedErrorSchema,
} from '../schemas/errorSchema.js';

// 管理者一覧取得用ルート
export const getAdminsRoute = createRoute({
  method: 'get',
  path: '/',
  description: '管理者一覧を取得します。',
  request: {
    query: getAdminsQuerySchema,
  },
  security: [{ JWT: [] }],
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: adminsListSchema,
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
  tags: ['管理者'],
});

//管理者一件取得用ルート
export const getAdminsByIdRoute = createRoute({
  method: 'get',
  path: '/{admin_id}',
  description: '指定した管理者を取得します。',
  request: {
    params: adminIdParamsSchema,
  },
  security: [{ JWT: [] }],
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: adminSchema,
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
  tags: ['管理者'],
});

// 管理者作成用ルート
export const postAdminsRoute = createRoute({
  method: 'post',
  path: '/',
  description: '管理者を作成します。',
  request: {
    body: {
      content: {
        'application/json': {
          schema: postAdminsBodySchema,
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
          schema: adminSchema,
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
  tags: ['管理者'],
});

// 管理者更新用ルート
export const putAdminsRoute = createRoute({
  method: 'put',
  path: '/{admin_id}',
  description: '指定した管理者を更新します。',
  request: {
    params: adminIdParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: putAdminsBodySchema,
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
          schema: adminSchema,
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
  tags: ['管理者'],
});

// 管理者削除用ルート
export const deleteAdminsRoute = createRoute({
  method: 'delete',
  path: '/{admin_id}',
  description: '指定した管理者を削除します。',
  request: {
    params: adminIdParamsSchema,
  },
  security: [{ JWT: [] }],
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: deleteAdminsResponseSchema,
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
  tags: ['管理者'],
});

const app = new OpenAPIHono();

app.use('*', jwtAuthMiddleware, adminAuthMiddleware);

const routes = app
  .openapi(getAdminsRoute, getAdminsHandler)
  .openapi(postAdminsRoute, postAdminsHandler)
  .openapi(getAdminsByIdRoute, getAdminsByIdHandler)
  .openapi(putAdminsRoute, putAdminsHandler)
  .openapi(deleteAdminsRoute, deleteAdminsHandler);

// ルートを登録
export default routes;
