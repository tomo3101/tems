'use server';

import { hcWithType } from 'api/hc';

export const fetchReservations = async (eventId: string) => {
  const client = hcWithType('http://localhost:3001/');
  const rowResponse = await client.api.v1.reservations.$get({
    query: {
      eventId: eventId,
    },
  });

  if (!rowResponse.ok) return;

  return rowResponse.json();
};

export const fetchEvent = async (eventId: string) => {
  const client = hcWithType('http://localhost:3001/');
  const rowResponse = await client.api.v1.events[':id'].$get({
    param: {
      id: eventId,
    },
  });

  if (!rowResponse.ok) return;

  return rowResponse.json();
};
