import type { MySqlSelect } from 'drizzle-orm/mysql-core';

export const withLimit = <T extends MySqlSelect>(qb: T, limit?: number) => {
  if (limit) {
    return qb.limit(limit);
  }
  return qb;
};
