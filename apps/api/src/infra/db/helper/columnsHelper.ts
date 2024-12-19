import { sql } from 'drizzle-orm';
import { datetime } from 'drizzle-orm/mysql-core';

export const datetimes = {
  created_at: datetime()
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updated_at: datetime()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
    .notNull(),
};

export const created_at = {
  created_at: datetime()
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
};
