'use server';

import { auth } from '@/auth';
import { hcWithAuth } from '@/utils/hc';

export const putReservationCalled = async (reservationId: number) => {
  const session = await auth();

  if (!session) return false;

  const client = hcWithAuth(session.user.accessToken);
  const rowResponce = await client.api.v1.reservations[':id'].$put({
    param: {
      id: reservationId.toString(),
    },
    json: {
      status: 'called',
    },
  });

  return rowResponce.ok;
};

export const putReservationDone = async (reservationId: number) => {
  const session = await auth();

  if (!session) return false;

  const client = hcWithAuth(session.user.accessToken);
  const rowResponce = await client.api.v1.reservations[':id'].$put({
    param: {
      id: reservationId.toString(),
    },
    json: {
      status: 'done',
    },
  });

  return rowResponce.ok;
};
