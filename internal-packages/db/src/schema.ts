import { boolean, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { integer } from 'drizzle-orm/pg-core';
import { timestamp } from 'drizzle-orm/pg-core';
import { decimal } from 'drizzle-orm/pg-core';

import 'source-map-support';

export const users = pgTable('users', {
  id: text('id')
    .unique()
    .$defaultFn(() => `user_${createId()}`)
    .primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  walletBalance: decimal('wallet_balance')
    .notNull()
    .$defaultFn(() => '1.00'),
  emailVerified: boolean('email_verified').default(false),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
