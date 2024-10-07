import {
  boolean,
  index,
  pgEnum,
  pgTable,
  serial,
  text,
  decimal,
  timestamp,
} from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

import 'source-map-support';
import { relations } from 'drizzle-orm';

export const users = pgTable(
  'users',
  {
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
  },
  (table) => ({
    emailIdx: index('user_email').on(table.email),
  }),
);

export const projectMode = pgEnum('project_mode', ['test', 'live']);
export const projects = pgTable('projects', {
  id: text('id')
    .unique()
    .$defaultFn(() => `pj_${createId()}`)
    .primaryKey(),
  name: text('name').notNull(),
  description: text('description').default(null),
  url: text('url').default(null),
  // start a project by default in test mode, live mode needs email verification. Test logs live for only 1hr and incur no extra cost
  mode: projectMode('project_mode').default('test'),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const ApiKeys = pgTable('api_keys', {
  id: text('id')
    .unique()
    .$defaultFn(() => `ak_${createId()}`),
  key: text('key').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  mode: projectMode('project_mode').default('test'),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
});

export const UserKeysRelation = relations(users, ({ many }) => ({
  keys: many(ApiKeys),
}));

export const KeysUserRelation = relations(ApiKeys, ({ one }) => ({
  user: one(users, { fields: [ApiKeys.userId], references: [users.id] }),
}));

export const ProjectKeysRelation = relations(projects, ({ many }) => ({
  keys: many(ApiKeys),
}));

export const KeysProjectRelation = relations(ApiKeys, ({ one }) => ({
  project: one(projects, {
    fields: [ApiKeys.projectId],
    references: [projects.id],
  }),
}));

export const UserProjectRelation = relations(users, ({ many }) => ({
  projects: many(projects),
}));

export const ProjectUserRelation = relations(projects, ({ one }) => ({
  author: one(users, { fields: [projects.userId], references: [users.id] }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
