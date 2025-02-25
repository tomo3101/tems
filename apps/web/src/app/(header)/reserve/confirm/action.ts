'use server';

import { auth } from '@/auth';
import { ReservationData } from '@/store/reservationStore';
import { hcWithAuth } from '@/utils/hc';

export const sendReservation = async (data: ReservationData) => {
  const session = await auth();
  if (!session) return { success: false };

  const client = hcWithAuth(session.user.accessToken);

  const rowResponce = await client.api.v1.reservations.$post({
    json: {
      eventId: data.eventId,
      numberOfPeople: data.numberOfPeople,
    },
  });

  if (!rowResponce.ok) {
    const json = await rowResponce.json();

    return {
      success: false,
      error: json.error,
    };
  }

  return {
    success: true,
  };
};
