'use server';

import { auth } from '@/auth';
import { hcWithAuth } from '@/utils/hc';

export const putCheckin = async (reservationId: number) => {
  const session = await auth();

  if (session) {
    const client = hcWithAuth(session.user.accessToken);

    const rowResponse = await client.api.v1.reservations[':id'].$put({
      param: {
        id: reservationId.toString(),
      },
      json: {
        status: 'checked_in',
      },
    });

    if (rowResponse.ok) {
      return rowResponse.json();
    }
  }
};
