import type { RouteHandler, z } from '@hono/zod-openapi';
import { MemberRepository } from '../../infra/repositories/memberRepository.js';
import type {
  deleteMembersRoute,
  getMembersByIdRoute,
  getMembersRoute,
  postMembersRoute,
  putMembersRoute,
} from '../routes/memberRoute.js';
import { membersListSchema } from '../schemas/memberSchema.js';

type membersListSchema = z.infer<typeof membersListSchema>;

// 会員一覧取得用ハンドラ
export const getMembersHandler: RouteHandler<typeof getMembersRoute> = async (
  c,
) => {
  const query = c.req.valid('query');

  try {
    const memberRepository = new MemberRepository();
    const members = await memberRepository.findAll(query);

    const response: membersListSchema = members.map((member) => {
      return {
        id: member.member_id,
        name: member.name,
        email: member.email,
        phoneNumber: member.phone_number,
        passwordHash: member.password_hash,
        createdAt: member.created_at.toISOString(),
        updatedAt: member.updated_at.toISOString(),
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

// 会員一件取得用ハンドラ
export const getMembersByIdHandler: RouteHandler<
  typeof getMembersByIdRoute
> = async (c) => {
  const param = c.req.valid('param');

  try {
    const memberRepository = new MemberRepository();
    const member = await memberRepository.findById(param.id);

    if (member === undefined) {
      return c.json({ message: 'Not Found', error: 'member not fonud' }, 404);
    }

    return c.json(
      {
        id: member.member_id,
        name: member.name,
        email: member.email,
        phoneNumber: member.phone_number,
        passwordHash: member.password_hash,
        createdAt: member.created_at.toISOString(),
        updatedAt: member.updated_at.toISOString(),
      },
      200,
    );
  } catch (e: unknown) {
    console.error(e);
    return c.json(
      {
        message: 'Internal Server Error',
        error: e instanceof Error ? e.message : undefined,
      },
      500,
    );
  }
};

// 会員作成用ハンドラ
export const postMembersHandler: RouteHandler<typeof postMembersRoute> = async (
  c,
) => {
  const body = c.req.valid('json');

  try {
    const memberRepository = new MemberRepository();
    const member = await memberRepository.create(body);

    return c.json(
      {
        id: member.member_id,
        name: member.name,
        email: member.email,
        phoneNumber: member.phone_number,
        passwordHash: member.password_hash,
        createdAt: member.created_at.toISOString(),
        updatedAt: member.updated_at.toISOString(),
      },
      201,
    );
  } catch (e: unknown) {
    console.error(e);

    if (e instanceof Error && e.message === 'email already exists') {
      return c.json(
        {
          message: 'Bad Request',
          error: e.message,
        },
        400,
      );
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

// 会員更新用ハンドラ
export const putMembersHandler: RouteHandler<typeof putMembersRoute> = async (
  c,
) => {
  const param = c.req.valid('param');
  const body = c.req.valid('json');

  try {
    const memberRepository = new MemberRepository();
    const member = await memberRepository.update(param.id, body);

    return c.json(
      {
        id: member.member_id,
        name: member.name,
        email: member.email,
        phoneNumber: member.phone_number,
        passwordHash: member.password_hash,
        createdAt: member.created_at.toISOString(),
        updatedAt: member.updated_at.toISOString(),
      },
      200,
    );
  } catch (e: unknown) {
    console.error(e);

    if (e instanceof Error && e.message === 'member not found') {
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

// 会員削除用ハンドラ
export const deleteMembersHandler: RouteHandler<
  typeof deleteMembersRoute
> = async (c) => {
  const param = c.req.valid('param');

  try {
    const memberRepository = new MemberRepository();
    await memberRepository.delete(param.id);

    return c.json({ message: 'Successful deletion' }, 200);
  } catch (e: unknown) {
    console.error(e);

    if (e instanceof Error && e.message === 'member not found') {
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
