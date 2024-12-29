import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import {
  deleteMembersHandler,
  getMembersByIdHandler,
  getMembersHandler,
  postMembersHandler,
  putMembersHandler,
} from '../controllers/memberController.js';
import {
  adminAuthMiddleware,
  jwtAuthMiddleware,
  userAuthMiddleware,
} from '../middlewares/jwtAuthMiddleware.js';
import {
  badRequestErrorSchema,
  forbiddenErrorSchema,
  internalServerErrorSchema,
  notFoundErrorSchema,
  unauthorizedErrorSchema,
} from '../schemas/errorSchema.js';
import {
  deleteMembersResponseSchema,
  getMembersQuerySchema,
  memberIdParamsSchema,
  memberSchema,
  membersListSchema,
  postMembersBodySchema,
  putMembersBodySchema,
} from '../schemas/memberSchema.js';

// 会員一覧取得用ルート
export const getMembersRoute = createRoute({
  method: 'get',
  path: '/',
  description: '会員一覧を取得します。',
  request: {
    query: getMembersQuerySchema,
  },
  middleware: [jwtAuthMiddleware, adminAuthMiddleware] as const,
  security: [{ JWT: [] }],
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: membersListSchema,
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
  tags: ['会員'],
});

// 会員一件取得用ルート
export const getMembersByIdRoute = createRoute({
  method: 'get',
  path: '/{member_id}',
  description: '指定した会員を一件取得します。',
  request: {
    params: memberIdParamsSchema,
  },
  middleware: [jwtAuthMiddleware, userAuthMiddleware] as const,
  security: [{ JWT: [] }],
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: memberSchema,
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
  tags: ['会員'],
});

// 会員作成用ルート
export const postMembersRoute = createRoute({
  method: 'post',
  path: '/',
  description: '会員を作成します。',
  request: {
    body: {
      content: {
        'application/json': {
          schema: postMembersBodySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Created',
      content: {
        'application/json': {
          schema: memberSchema,
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
  tags: ['会員'],
});

// 会員更新用ルート
export const putMembersRoute = createRoute({
  method: 'put',
  path: '/{member_id}',
  description: '指定した会員を更新します。',
  request: {
    params: memberIdParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: putMembersBodySchema,
        },
      },
    },
  },
  middleware: [jwtAuthMiddleware, userAuthMiddleware] as const,
  security: [{ JWT: [] }],
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: memberSchema,
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
  tags: ['会員'],
});

// 会員削除用ルート
export const deleteMembersRoute = createRoute({
  method: 'delete',
  path: '/{member_id}',
  description: '指定した会員を削除します。',
  request: {
    params: memberIdParamsSchema,
  },
  middleware: [jwtAuthMiddleware, userAuthMiddleware] as const,
  security: [{ JWT: [] }],
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: deleteMembersResponseSchema,
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
  tags: ['会員'],
});

const app = new OpenAPIHono();

// ルートを登録
app.openapi(getMembersRoute, getMembersHandler);
app.openapi(getMembersByIdRoute, getMembersByIdHandler);
app.openapi(postMembersRoute, postMembersHandler);
app.openapi(putMembersRoute, putMembersHandler);
app.openapi(deleteMembersRoute, deleteMembersHandler);

export default app;
