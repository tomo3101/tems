import { hcWithType } from 'api/hc';
import { adminSchema } from 'api/schema/adminSchema';
import { eventSchema } from 'api/schema/eventSchema';
import { memberSchema } from 'api/schema/memberSchema';
import {
  reservationSchema,
  reservationWithEventSchema,
} from 'api/schema/reservationSchema';
import { z } from 'zod';

const API_URL = process.env.API_URL;

if (!API_URL) {
  throw new Error('API_URL is undefined');
}

export const hc = hcWithType(API_URL, {
  fetch: (input: RequestInfo | URL, requestInit?: RequestInit) =>
    fetch(input, {
      cache: 'no-cache',
      ...requestInit,
    }),
});

export const hcWithAuth = (accessToken: string) => {
  return hcWithType(API_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export type Event = z.infer<typeof eventSchema>;

export type Reservation = z.infer<typeof reservationSchema>;
export type ReservationWithEvent = z.infer<typeof reservationWithEventSchema>;

export type Member = z.infer<typeof memberSchema>;

export type Admin = z.infer<typeof adminSchema>;
