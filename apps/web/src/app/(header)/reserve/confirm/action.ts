'use server';

import { auth } from '@/auth';
import { ReservationData } from '@/store/reservationStore';
import { hcWithAuth } from '@/utils/hc';

export const sendReservation = async (data: ReservationData) => {
  const session = await auth();
  if (!session) return false;

  const client = hcWithAuth(session.user.accessToken);

  const rowResponce = await client.api.v1.reservations.$post({
    json: {
      eventId: data.eventId,
      numberOfPeople: data.numberOfPeople,
    },
  });

  return rowResponce.ok;
};
