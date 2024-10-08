import {
  boolean,
  index,
  pgEnum,
  pgTable,
  serial,
  text,
  decimal,
  timestamp,
  jsonb,
  integer,
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
  name: text('name').notNull(),
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

// Enum for log levels
export const LogLevelEnum = pgEnum('log_level', [
  'debug',
  'info',
  'warn',
  'error',
  'fatal',
]);

// Helper function to create prefixed IDs
const createPrefixedId = (prefix: string) =>
  text('id')
    .primaryKey()
    .$defaultFn(() => `${prefix}_${createId()}`);

// Request logs table (serves as the base table)
export const requestLogs = pgTable('request_logs', {
  id: createPrefixedId('rl'),
  projectId: text('project_id')
    .references(() => projects.id)
    .notNull(),
  apiKeyId: text('api_key_id')
    .references(() => ApiKeys.id)
    .notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  method: text('method').notNull(),
  url: text('url').notNull(),
  statusCode: text('status_code'),
  requestBody: jsonb('request_body'),
  responseBody: jsonb('response_body'),
  requestHeaders: jsonb('request_headers'),
  responseHeaders: jsonb('response_headers'),
  cookies: jsonb('cookies'),
  ip: text('ip'),
  userAgent: text('user_agent'),
});

// Application logs table
export const applicationLogs = pgTable('application_logs', {
  id: createPrefixedId('al'),
  requestId: text('request_id')
    .references(() => requestLogs.id)
    .notNull(),
  projectId: text('project_id')
    .references(() => projects.id)
    .notNull(),
  apiKeyId: text('api_key_id')
    .references(() => ApiKeys.id)
    .notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  level: LogLevelEnum('level').notNull(),
  message: text('message').notNull(),
  component: text('component'),
  functionName: text('function_name'),
  additionalInfo: jsonb('additional_info'),
});

// System logs table
export const systemLogs = pgTable('system_logs', {
  id: createPrefixedId('sl'),
  requestId: text('request_id')
    .references(() => requestLogs.id)
    .notNull(),
  projectId: text('project_id')
    .references(() => projects.id)
    .notNull(),
  apiKeyId: text('api_key_id').references(() => ApiKeys.id),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  level: LogLevelEnum('level').notNull(),
  message: text('message').notNull(),
  eventType: text('event_type'),
  details: jsonb('details'),
});

// Relationships
export const projectsRelations = relations(projects, ({ many }) => ({
  apiKeys: many(ApiKeys),
  requestLogs: many(requestLogs),
  applicationLogs: many(applicationLogs),
  systemLogs: many(systemLogs),
}));

export const apiKeysRelations = relations(ApiKeys, ({ one, many }) => ({
  project: one(projects, {
    fields: [ApiKeys.projectId],
    references: [projects.id],
  }),
  requestLogs: many(requestLogs),
  applicationLogs: many(applicationLogs),
  systemLogs: many(systemLogs),
}));

export const requestLogsRelations = relations(requestLogs, ({ one, many }) => ({
  project: one(projects, {
    fields: [requestLogs.projectId],
    references: [projects.id],
  }),
  apiKey: one(ApiKeys, {
    fields: [requestLogs.apiKeyId],
    references: [ApiKeys.id],
  }),
  applicationLogs: many(applicationLogs),
  systemLogs: many(systemLogs),
}));

export const applicationLogsRelations = relations(
  applicationLogs,
  ({ one }) => ({
    request: one(requestLogs, {
      fields: [applicationLogs.requestId],
      references: [requestLogs.id],
    }),
    project: one(projects, {
      fields: [applicationLogs.projectId],
      references: [projects.id],
    }),
    apiKey: one(ApiKeys, {
      fields: [applicationLogs.apiKeyId],
      references: [ApiKeys.id],
    }),
  }),
);

export const systemLogsRelations = relations(systemLogs, ({ one }) => ({
  request: one(requestLogs, {
    fields: [systemLogs.requestId],
    references: [requestLogs.id],
  }),
  project: one(projects, {
    fields: [systemLogs.projectId],
    references: [projects.id],
  }),
  apiKey: one(ApiKeys, {
    fields: [systemLogs.apiKeyId],
    references: [ApiKeys.id],
  }),
}));
