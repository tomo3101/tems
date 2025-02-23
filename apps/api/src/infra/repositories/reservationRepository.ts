import { z } from '@hono/zod-openapi';
import { createHash } from 'crypto';
import dayjs from 'dayjs';
import { and, count, eq, gte, lte, sum, type SQLWrapper } from 'drizzle-orm';
import type {
  getReservationsByMemberIdQuerySchema,
  getReservationsQuerySchema,
  postReservationsBodySchema,
  putReservationsBodySchema,
  reservationsWithEventListSchema,
} from '../../application/schemas/reservationSchema.js';
import { io } from '../../index.js';
import { sendCalledEmail } from '../../utils/resend.js';
import { db } from '../db/helpers/connecter.js';
import { reservations } from '../db/schemas/reservations.js';

type getReservationsQuerySchema = z.infer<typeof getReservationsQuerySchema>;
type postReservationsBodySchema = z.infer<typeof postReservationsBodySchema>;
type putReservationsBodySchema = z.infer<typeof putReservationsBodySchema>;
type getReservationsByMemberIdQuerySchema = z.infer<
  typeof getReservationsByMemberIdQuerySchema
>;
type reservationsWithEventListSchema = z.infer<
  typeof reservationsWithEventListSchema
>;

export class ReservationRepository {
  async findAll(query: getReservationsQuerySchema) {
    const filters: SQLWrapper[] = [];

    if (query.eventId) {
      filters.push(eq(reservations.event_id, query.eventId));
    }

    if (query.memberId) {
      filters.push(eq(reservations.member_id, query.memberId));
    }

    if (query.qrCodeHash) {
      filters.push(eq(reservations.qr_code_hash, query.qrCodeHash));
    }

    if (query.status) {
      filters.push(eq(reservations.status, query.status));
    }

    if (query.startTime) {
      filters.push(gte(reservations.created_at, new Date(query.startTime)));
    }

    if (query.endTime) {
      filters.push(lte(reservations.created_at, new Date(query.endTime)));
    }

    return db.query.reservations.findMany({
      where: and(...filters),
      with: {
        events: true,
      },
      limit: query.limit,
    });
  }

  async findById(id: number) {
    return db.query.reservations.findFirst({
      where: eq(reservations.reservation_id, id),
    });
  }

  async findByMemberId(
    memberId: number,
    query: getReservationsByMemberIdQuerySchema,
  ) {
    const filters: SQLWrapper[] = [];

    if (query.id) {
      filters.push(eq(reservations.event_id, query.id));
    }

    if (query.status) {
      filters.push(eq(reservations.status, query.status));
    }

    if (query.startTime) {
      filters.push(gte(reservations.created_at, new Date(query.startTime)));
    }

    if (query.endTime) {
      filters.push(lte(reservations.created_at, new Date(query.endTime)));
    }

    return db.query.reservations.findMany({
      where: and(eq(reservations.member_id, memberId), ...filters),
      with: {
        events: true,
      },
      limit: query.limit,
    });
  }

  async findByQrCode(qrCode: string) {
    return db.query.reservations.findFirst({
      where: eq(reservations.qr_code_hash, qrCode),
    });
  }

  async getReservedCount(eventId: number) {
    return db.query.reservations.findFirst({
      where: eq(reservations.event_id, eventId),
      columns: {},
      extras: {
        reserved_count: sum(reservations.number_of_people).as('reserved_count'),
      },
    });
  }

  async create(memberId: number, body: postReservationsBodySchema) {
    return await db.transaction(async (tx) => {
      const event = await tx.query.events.findFirst({
        where: eq(reservations.event_id, body.eventId),
      });

      if (event === undefined) {
        throw new Error('event not found');
      }

      const reservation = await tx.query.reservations.findFirst({
        where: eq(reservations.event_id, body.eventId),
        columns: {},
        extras: {
          reserved_number: sum(reservations.number_of_people).as(
            'reserved_number',
          ),
          reserved_count: count(reservations.reservation_id).as(
            'reserved_count',
          ),
        },
      });

      const reservedNumber = reservation
        ? Number(reservation.reserved_number)
        : 0;

      const reservedCount = reservation?.reserved_count ?? 0;

      if (event.capacity < reservedNumber + body.numberOfPeople) {
        throw new Error('capacity is not enough');
      }

      const qrCodeValue = `${body.eventId}-${memberId}-${body.numberOfPeople}-${new Date().toISOString()}`;
      const qrCodeHash = createHash('sha256').update(qrCodeValue).digest('hex');

      const createdId = await tx
        .insert(reservations)
        .values({
          event_id: body.eventId,
          member_id: memberId,
          number_of_people: body.numberOfPeople,
          qr_code_hash: qrCodeHash,
          call_number: reservedCount + 1,
        })
        .$returningId();

      const createdReservation = await tx.query.reservations.findFirst({
        where: eq(reservations.reservation_id, createdId[0].reservation_id),
      });

      if (createdReservation === undefined) {
        throw new Error('failed to create reservation');
      }

      return createdReservation;
    });
  }

  async update(id: number, reservation: putReservationsBodySchema) {
    const existsReservation = await this.findById(id);

    if (existsReservation === undefined) {
      throw new Error('reservation not found');
    }

    if (existsReservation.status === 'cancelled') {
      throw new Error('reservation is cancelled');
    } else if (existsReservation.status === reservation.status) {
      throw new Error('status is same');
    }

    // ステータスをチェックインに更新する場合、ckecked_in_atを更新
    switch (reservation.status) {
      case 'checked_in': {
        await db
          .update(reservations)
          .set({
            status: reservation.status,
            checked_in_at: new Date(),
          })
          .where(eq(reservations.reservation_id, id));

        const nowReservations = await this.findAll({
          eventId: existsReservation.event_id,
        });

        const response: reservationsWithEventListSchema = nowReservations.map(
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

        io.emit('message', JSON.stringify(response));

        break;
      }

      case 'called': {
        await db
          .update(reservations)
          .set({
            status: reservation.status,
            called_at: new Date(),
          })
          .where(eq(reservations.reservation_id, id));

        const nowReservations = await this.findAll({
          eventId: existsReservation.event_id,
        });

        const member = await db.query.members.findFirst({
          where: eq(reservations.member_id, existsReservation.member_id),
        });

        const event = await db.query.events.findFirst({
          where: eq(reservations.event_id, existsReservation.event_id),
        });

        if (member && event) {
          await sendCalledEmail(
            member.email,
            member.name,
            {
              id: id,
              callNumber: existsReservation.call_number,
              numberOfPeople: existsReservation.number_of_people,
            },
            {
              name: event.name,
              date: dayjs(event.date).format('YYYY-MM-DD'),
              startTime: event.start_time,
              endTime: event.end_time,
            },
          );
        }

        const response: reservationsWithEventListSchema = nowReservations.map(
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

        io.emit('message', JSON.stringify(response));
        io.emit('call', JSON.stringify({ reservationId: id }));

        break;
      }

      case 'done': {
        await db
          .update(reservations)
          .set({
            status: reservation.status,
            checked_in_at: new Date(),
          })
          .where(eq(reservations.reservation_id, id));

        const nowReservations = await this.findAll({
          eventId: existsReservation.event_id,
        });

        const response: reservationsWithEventListSchema = nowReservations.map(
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

        io.emit('message', JSON.stringify(response));

        break;
      }

      default:
        await db
          .update(reservations)
          .set({
            number_of_people: reservation.numberOfPeople,
            status: reservation.status,
          })
          .where(eq(reservations.reservation_id, id));
        break;
    }

    const updatedReservation = await this.findById(id);

    if (updatedReservation === undefined) {
      throw new Error('failed to update reservation');
    }

    return updatedReservation;
  }

  async delete(id: number) {
    const existsReservation = await this.findById(id);

    if (existsReservation === undefined) {
      throw new Error('reservation not found');
    }

    if (existsReservation.status === 'checked_in') {
      throw new Error('reservation is checked in');
    } else if (existsReservation.status === 'cancelled') {
      throw new Error('reservation is cancelled');
    }

    await db
      .update(reservations)
      .set({
        status: 'cancelled',
      })
      .where(eq(reservations.reservation_id, id));
  }
}
