import { z, type RouteHandler } from '@hono/zod-openapi';
import { ReservationRepository } from '../../infra/repositories/reservationRepository.js';
import type {
  deleteReservationsRoute,
  getReservationsByIdRoute,
  getReservationsByMemberRoute,
  getReservationsRoute,
  postReservationsRoute,
  putReservationsRoute,
} from '../routes/reservationRoute.js';
import type { reservationsListSchema } from '../schemas/reservationSchema.js';

type reservationsListSchema = z.infer<typeof reservationsListSchema>;

// 予約一覧取得用ハンドラ
export const getReservationsHandler: RouteHandler<
  typeof getReservationsRoute
> = async (c) => {
  const query = c.req.valid('query');

  try {
    const reservationRepository = new ReservationRepository();
    const reservations = await reservationRepository.findAll(query);

    const response: reservationsListSchema = reservations.map((reservation) => {
      return {
        reservation_id: reservation.reservation_id,
        event_id: reservation.event_id,
        member_id: reservation.member_id,
        number_of_people: reservation.number_of_people,
        qr_code_hash: reservation.qr_code_hash,
        status: reservation.status,
        created_at: reservation.created_at.toISOString(),
        checked_in_at: reservation.checked_in_at?.toISOString(),
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

// 予約一件取得用ハンドラ
export const getReservationsByIdHandler: RouteHandler<
  typeof getReservationsByIdRoute
> = async (c) => {
  const param = c.req.valid('param');

  try {
    const reservationRepository = new ReservationRepository();
    const reservation = await reservationRepository.findById(
      param.reservation_id,
    );

    if (reservation === undefined) {
      return c.json(
        { message: 'Not Found', error: 'reservation not found' },
        404,
      );
    }

    return c.json(
      {
        reservation_id: reservation.reservation_id,
        event_id: reservation.event_id,
        member_id: reservation.member_id,
        number_of_people: reservation.number_of_people,
        qr_code_hash: reservation.qr_code_hash,
        status: reservation.status,
        created_at: reservation.created_at.toISOString(),
        checked_in_at: reservation.checked_in_at?.toISOString(),
      },
      200,
    );
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

// 予約作成用ハンドラ
export const postReservationsHandler: RouteHandler<
  typeof postReservationsRoute
> = async (c) => {
  const body = c.req.valid('json');
  const { user_id } = c.get('jwtPayload');

  try {
    const reservationRepository = new ReservationRepository();
    const reservation = await reservationRepository.create(user_id, body);

    return c.json(
      {
        reservation_id: reservation.reservation_id,
        event_id: reservation.event_id,
        member_id: reservation.member_id,
        number_of_people: reservation.number_of_people,
        qr_code_hash: reservation.qr_code_hash,
        status: reservation.status,
        created_at: reservation.created_at.toISOString(),
        checked_in_at: reservation.checked_in_at?.toISOString(),
      },
      201,
    );
  } catch (e: unknown) {
    console.log(e);

    if (e instanceof Error && e.message === 'capacity is not enough') {
      return c.json({ message: 'Conflict', error: e.message }, 409);
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

// 予約更新用ハンドラ
export const putReservationsHandler: RouteHandler<
  typeof putReservationsRoute
> = async (c) => {
  const param = c.req.valid('param');
  const body = c.req.valid('json');

  try {
    const reservationRepository = new ReservationRepository();
    const reservation = await reservationRepository.update(
      param.reservation_id,
      body,
    );

    if (reservation === undefined) {
      return c.json(
        { message: 'Not Found', error: 'reservation not found' },
        404,
      );
    }

    return c.json(
      {
        reservation_id: reservation.reservation_id,
        event_id: reservation.event_id,
        member_id: reservation.member_id,
        number_of_people: reservation.number_of_people,
        qr_code_hash: reservation.qr_code_hash,
        status: reservation.status,
        created_at: reservation.created_at.toISOString(),
        checked_in_at: reservation.checked_in_at?.toISOString(),
      },
      200,
    );
  } catch (e: unknown) {
    console.log(e);

    if (e instanceof Error && e.message === 'reservation not found') {
      return c.json({ message: 'Not Found', error: e.message }, 404);
    }

    if (
      e instanceof Error &&
      (e.message === 'reservation is checked in' ||
        e.message === 'reservation is cancelled')
    ) {
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

// 予約削除用ハンドラ
export const deleteReservationsHandler: RouteHandler<
  typeof deleteReservationsRoute
> = async (c) => {
  const param = c.req.valid('param');

  try {
    const reservationRepository = new ReservationRepository();
    await reservationRepository.delete(param.reservation_id);

    return c.json({ message: 'Successful deletion' }, 200);
  } catch (e: unknown) {
    console.log(e);

    if (e instanceof Error && e.message === 'reservation not found') {
      return c.json({ message: 'Not Found', error: e.message }, 404);
    }

    if (
      e instanceof Error &&
      (e.message === 'reservation is checked in' ||
        e.message === 'reservation is cancelled')
    ) {
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

// メンバーの予約一覧取得用ハンドラ
export const getReservationsByMemberHandler: RouteHandler<
  typeof getReservationsByMemberRoute
> = async (c) => {
  const param = c.req.valid('param');
  const query = c.req.valid('query');

  try {
    const reservationRepository = new ReservationRepository();
    const reservations = await reservationRepository.findByMemberId(
      param.member_id,
      query,
    );

    const response: reservationsListSchema = reservations.map((reservation) => {
      return {
        reservation_id: reservation.reservation_id,
        event_id: reservation.event_id,
        member_id: reservation.member_id,
        number_of_people: reservation.number_of_people,
        qr_code_hash: reservation.qr_code_hash,
        status: reservation.status,
        created_at: reservation.created_at.toISOString(),
        checked_in_at: reservation.checked_in_at?.toISOString(),
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
