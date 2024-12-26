import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import * as adminsSchema from '../schemas/admins.js';
import * as eventsSchema from '../schemas/events.js';
import * as membersSchema from '../schemas/members.js';
import * as reservationsSchema from '../schemas/reservations.js';
import * as temporaryMembersSchema from '../schemas/temporaryMembers.js';
import * as tokensSchema from '../schemas/tokens.js';

export const db = drizzle(process.env.DATABASE_URL!, {
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
