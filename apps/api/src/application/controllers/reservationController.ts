import { z, type RouteHandler } from '@hono/zod-openapi';
import { ReservationRepository } from '../../infra/repositories/reservationRepository.js';
import type {
  deleteReservationsRoute,
  getReservationsByIdRoute,
  getReservationsByMemberRoute,
  getReservationsByQrCodeRoute,
  getReservationsRoute,
  postReservationsRoute,
  putReservationsRoute,
} from '../routes/reservationRoute.js';
import type {
  reservationsListSchema,
  reservationsWithEventListSchema,
} from '../schemas/reservationSchema.js';

type reservationsListSchema = z.infer<typeof reservationsListSchema>;
type reservationsWithEventListSchema = z.infer<
  typeof reservationsWithEventListSchema
>;

// 予約一覧取得用ハンドラ
export const getReservationsHandler: RouteHandler<
  typeof getReservationsRoute
> = async (c) => {
  const query = c.req.valid('query');

  try {
    const reservationRepository = new ReservationRepository();
    const reservations = await reservationRepository.findAll(query);

    const response: reservationsWithEventListSchema = reservations.map(
      (reservation) => {
        return {
          id: reservation.reservation_id,
          eventId: reservation.event_id,
          eventName: reservation.events.name,
          eventDate: reservation.events.date.toISOString(),
          eventStartTime: reservation.events.start_time,
          eventEndTime: reservation.events.end_time,
          memberId: reservation.member_id,
          numberOfPeople: reservation.number_of_people,
          qrCodeHash: reservation.qr_code_hash,
          callNumber: reservation.call_number,
          status: reservation.status,
          createdAt: reservation.created_at.toISOString(),
          checkedInAt: reservation.checked_in_at?.toISOString(),
          calledAt: reservation.called_at?.toISOString(),
        };
      },
    );

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
    const reservation = await reservationRepository.findById(param.id);

    if (reservation === undefined) {
      return c.json(
        { message: 'Not Found', error: 'reservation not found' },
        404,
      );
    }

    return c.json(
      {
        id: reservation.reservation_id,
        eventId: reservation.event_id,
        memberId: reservation.member_id,
        numberOfPeople: reservation.number_of_people,
        qrCodeHash: reservation.qr_code_hash,
        callNumber: reservation.call_number,
        status: reservation.status,
        createdAt: reservation.created_at.toISOString(),
        checkedInAt: reservation.checked_in_at?.toISOString(),
        calledAt: reservation.called_at?.toISOString(),
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
  const { user_id } = c.get('jwtPayload') as { user_id: number };

  try {
    const reservationRepository = new ReservationRepository();
    const reservation = await reservationRepository.create(user_id, body);

    return c.json(
      {
        id: reservation.reservation_id,
        eventId: reservation.event_id,
        memberId: reservation.member_id,
        numberOfPeople: reservation.number_of_people,
        qrCodeHash: reservation.qr_code_hash,
        callNumber: reservation.call_number,
        status: reservation.status,
        createdAt: reservation.created_at.toISOString(),
        checkedInAt: reservation.checked_in_at?.toISOString(),
        calledAt: reservation.called_at?.toISOString(),
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
    const reservation = await reservationRepository.update(param.id, body);

    if (reservation === undefined) {
      return c.json(
        { message: 'Not Found', error: 'reservation not found' },
        404,
      );
    }

    return c.json(
      {
        id: reservation.reservation_id,
        eventId: reservation.event_id,
        memberId: reservation.member_id,
        numberOfPeople: reservation.number_of_people,
        qrCodeHash: reservation.qr_code_hash,
        callNumber: reservation.call_number,
        status: reservation.status,
        createdAt: reservation.created_at.toISOString(),
        checkedInAt: reservation.checked_in_at?.toISOString(),
        calledAt: reservation.called_at?.toISOString(),
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
    await reservationRepository.delete(param.id);

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
      param.id,
      query,
    );

    const response: reservationsWithEventListSchema = reservations.map(
      (reservation) => {
        return {
          id: reservation.reservation_id,
          eventId: reservation.event_id,
          eventName: reservation.events.name,
          eventDate: reservation.events.date.toISOString(),
          eventStartTime: reservation.events.start_time,
          eventEndTime: reservation.events.end_time,
          memberId: reservation.member_id,
          numberOfPeople: reservation.number_of_people,
          qrCodeHash: reservation.qr_code_hash,
          callNumber: reservation.call_number,
          status: reservation.status,
          createdAt: reservation.created_at.toISOString(),
          checkedInAt: reservation.checked_in_at?.toISOString(),
          calledAt: reservation.called_at?.toISOString(),
        };
      },
    );

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

// QRコードの予約取得用ハンドラ
export const getReservationsByQrCodeHandler: RouteHandler<
  typeof getReservationsByQrCodeRoute
> = async (c) => {
  const param = c.req.valid('param');

  try {
    const reservationRepository = new ReservationRepository();
    const reservation = await reservationRepository.findByQrCode(
      param.qrCodeHash,
    );

    if (reservation === undefined) {
      return c.json(
        { message: 'Not Found', error: 'reservation not found' },
        404,
      );
    }

    return c.json(
      {
        id: reservation.reservation_id,
        eventId: reservation.event_id,
        memberId: reservation.member_id,
        numberOfPeople: reservation.number_of_people,
        qrCodeHash: reservation.qr_code_hash,
        callNumber: reservation.call_number,
        status: reservation.status,
        createdAt: reservation.created_at.toISOString(),
        checkedInAt: reservation.checked_in_at?.toISOString(),
        calledAt: reservation.called_at?.toISOString(),
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
