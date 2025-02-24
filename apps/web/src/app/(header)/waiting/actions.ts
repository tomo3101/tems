'use server';

import { auth } from '@/auth';
import { hcWithAuth } from '@/utils/hc';

export const fetchReservations = async (eventId: string) => {
  const session = await auth();

  if (!session) return;

  const client = hcWithAuth(session.user.accessToken);
  const rowResponse = await client.api.v1.reservations.$get({
    query: {
      eventId: eventId,
    },
  });

  if (!rowResponse.ok) return;

  return rowResponse.json();
};

export const fetchEvent = async (eventId: string) => {
  const session = await auth();

  if (!session) return;

  const client = hcWithAuth(session.user.accessToken);
  const rowResponse = await client.api.v1.events[':id'].$get({
    param: {
      id: eventId,
    },
  });

  if (!rowResponse.ok) return;

  return rowResponse.json();
};
