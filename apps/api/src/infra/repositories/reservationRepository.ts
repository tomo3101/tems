import { z } from '@hono/zod-openapi';
import { createHash } from 'crypto';
import { and, eq, gte, lte, type SQLWrapper } from 'drizzle-orm';
import type {
  getReservationsByMemberIdQuerySchema,
  getReservationsQuerySchema,
  postReservationsBodySchema,
  putReservationsBodySchema,
} from '../../application/schemas/reservationSchema.js';
import { db } from '../db/helpers/connecter.js';
import { reservations } from '../db/schemas/reservations.js';

type getReservationsQuerySchema = z.infer<typeof getReservationsQuerySchema>;
type postReservationsBodySchema = z.infer<typeof postReservationsBodySchema>;
type putReservationsBodySchema = z.infer<typeof putReservationsBodySchema>;
type getReservationsByMemberIdQuerySchema = z.infer<
  typeof getReservationsByMemberIdQuerySchema
>;

export class ReservationRepository {
  async findAll(query: getReservationsQuerySchema) {
    const filters: SQLWrapper[] = [];

    if (query.event_id) {
      filters.push(eq(reservations.event_id, query.event_id));
    }

    if (query.member_id) {
      filters.push(eq(reservations.member_id, query.member_id));
    }

    if (query.status) {
      filters.push(eq(reservations.status, query.status));
    }

    if (query.start_time) {
      filters.push(gte(reservations.created_at, new Date(query.start_time)));
    }

    if (query.end_time) {
      filters.push(lte(reservations.created_at, new Date(query.end_time)));
    }

    return db.query.reservations.findMany({
      where: and(...filters),
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

    if (query.event_id) {
      filters.push(eq(reservations.event_id, query.event_id));
    }

    if (query.status) {
      filters.push(eq(reservations.status, query.status));
    }

    if (query.start_time) {
      filters.push(gte(reservations.created_at, new Date(query.start_time)));
    }

    if (query.end_time) {
      filters.push(lte(reservations.created_at, new Date(query.end_time)));
    }

    return db.query.reservations.findMany({
      where: and(eq(reservations.member_id, memberId), ...filters),
      limit: query.limit,
    });
  }

  async findByQrCode(qrCode: string) {
    return db.query.reservations.findFirst({
      where: eq(reservations.qr_code_hash, qrCode),
    });
  }

  async create(memberId: number, reservation: postReservationsBodySchema) {
    const qrCodeValue = `${reservation.event_id}-${memberId}-${reservation.number_of_people}-${new Date().toISOString()}`;
    console.log(qrCodeValue);
    const qrCodeHash = createHash('sha256').update(qrCodeValue).digest('hex');

    const createdId = await db
      .insert(reservations)
      .values({
        event_id: reservation.event_id,
        member_id: memberId,
        number_of_people: reservation.number_of_people,
        qr_code_hash: qrCodeHash,
      })
      .$returningId();

    const createdReservation = await this.findById(createdId[0].reservation_id);

    if (createdReservation === undefined) {
      throw new Error('failed to create reservation');
    }

    return createdReservation;
  }

  async update(id: number, reservation: putReservationsBodySchema) {
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
        number_of_people: reservation.number_of_people,
        status: reservation.status,
      })
      .where(eq(reservations.reservation_id, id));

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
