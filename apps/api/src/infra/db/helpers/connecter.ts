import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import * as adminsSchema from '../schemas/admins.js';
import * as eventsSchema from '../schemas/events.js';
import * as membersSchema from '../schemas/members.js';
import * as reservationsSchema from '../schemas/reservations.js';
import * as temporaryMembersSchema from '../schemas/temporaryMembers.js';
import * as tokensSchema from '../schemas/tokens.js';

const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl === undefined) {
  throw new Error('DATABASE_URL is not defined');
}

export const db = drizzle(databaseUrl, {
  schema: {
    ...adminsSchema,
    ...eventsSchema,
    ...membersSchema,
    ...reservationsSchema,
    ...temporaryMembersSchema,
    ...tokensSchema,
  },
  mode: 'default',
});
