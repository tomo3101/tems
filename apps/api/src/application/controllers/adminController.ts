import type { RouteHandler, z } from '@hono/zod-openapi';
import { AdminRepository } from '../../infra/repositories/adminRepository.js';
import type {
  deleteAdminsRoute,
  getAdminsByIdRoute,
  getAdminsRoute,
  postAdminsRoute,
  putAdminsRoute,
} from '../routes/adminRoute.js';
import type { adminsListSchema } from '../schemas/adminSchema.js';

type adminsListSchema = z.infer<typeof adminsListSchema>;

// 管理者一覧取得用ハンドラ
export const getAdminsHandler: RouteHandler<typeof getAdminsRoute> = async (
  c,
) => {
  const query = c.req.valid('query');

  try {
    const adminRepository = new AdminRepository();
    const admins = await adminRepository.findAll(query);

    const response: adminsListSchema = admins.map((admin) => {
      return {
        id: admin.admin_id,
        name: admin.name,
        email: admin.email,
        createdAt: admin.created_at.toISOString(),
        updatedAt: admin.updated_at.toISOString(),
      };
    });

    return c.json(response, 200);
  } catch (e: unknown) {
    console.log(e);
    return c.json(
      {
        message: 'Internal Server Error',
        error: e instanceof Error ? e.message : undefined,
      },
      500,
    );
  }
};

// 管理者一件取得用ハンドラ
export const getAdminsByIdHandler: RouteHandler<
  typeof getAdminsByIdRoute
> = async (c) => {
  const param = c.req.valid('param');

  try {
    const adminRepository = new AdminRepository();
    const admin = await adminRepository.findById(param.id);

    if (admin === undefined) {
      return c.json({ message: 'Not Found', error: 'admin not fonud' }, 404);
    }

    const response = {
      id: admin.admin_id,
      name: admin.name,
      email: admin.email,
      createdAt: admin.created_at.toISOString(),
      updatedAt: admin.updated_at.toISOString(),
    };

    return c.json(response, 200);
  } catch (e: unknown) {
    console.log(e);
    return c.json(
      {
        message: 'Internal Server Error',
        error: e instanceof Error ? e.message : undefined,
      },
      500,
    );
  }
};

// 管理者作成用ハンドラ
export const postAdminsHandler: RouteHandler<typeof postAdminsRoute> = async (
  c,
) => {
  const body = c.req.valid('json');

  try {
    const adminRepository = new AdminRepository();
    const admin = await adminRepository.create(body);

    return c.json(
      {
        id: admin.admin_id,
        name: admin.name,
        email: admin.email,
        createdAt: admin.created_at.toISOString(),
        updatedAt: admin.updated_at.toISOString(),
      },
      201,
    );
  } catch (e: unknown) {
    console.log(e);

    if (e instanceof Error && e.message === 'email already exists') {
      return c.json({ message: 'Bad Request', error: e.message }, 400);
    }

    return c.json(
      {
        message: 'Internal Server Error',
        error: e instanceof Error ? e.message : undefined,
      },
      500,
    );
  }
};

// 管理者更新用ハンドラ
export const putAdminsHandler: RouteHandler<typeof putAdminsRoute> = async (
  c,
) => {
  const param = c.req.valid('param');
  const body = c.req.valid('json');

  try {
    const adminRepository = new AdminRepository();
    const admin = await adminRepository.update(param.id, body);

    return c.json(
      {
        id: admin.admin_id,
        name: admin.name,
        email: admin.email,
        createdAt: admin.created_at.toISOString(),
        updatedAt: admin.updated_at.toISOString(),
      },
      200,
    );
  } catch (e: unknown) {
    console.log(e);

    if (e instanceof Error && e.message === 'admin not found') {
      return c.json({ message: 'Not Found', error: e.message }, 404);
    }

    return c.json(
      {
        message: 'Internal Server Error',
        error: e instanceof Error ? e.message : undefined,
      },
      500,
    );
  }
};

// 管理者削除用ハンドラ
export const deleteAdminsHandler: RouteHandler<
  typeof deleteAdminsRoute
> = async (c) => {
  const param = c.req.valid('param');

  try {
    const adminRepository = new AdminRepository();
    await adminRepository.delete(param.id);

    return c.json({ message: 'Successful deletion' }, 200);
  } catch (e: unknown) {
    console.log(e);

    if (e instanceof Error && e.message === 'admin not found') {
      return c.json({ message: 'Not Found', error: e.message }, 404);
    }

    return c.json(
      {
        message: 'Internal Server Error',
        error: e instanceof Error ? e.message : undefined,
      },
      500,
    );
  }
};
