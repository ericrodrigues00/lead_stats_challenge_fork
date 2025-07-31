import { pgTable, uuid, varchar, text, timestamp, numeric, pgEnum, jsonb } from 'drizzle-orm/pg-core';

export const priorityEnum = pgEnum('priority', ['LOW', 'MEDIUM', 'HIGH']);
export const statusEnum = pgEnum('status', ['TODO', 'IN_PROGRESS', 'DONE']);

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  priority: priorityEnum('priority').notNull(),
  status: statusEnum('status').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  dueDate: timestamp('due_date', { withTimezone: true }),
  assignedTo: varchar('assigned_to', { length: 255 }).notNull(),
  tags: jsonb('tags').notNull().default([]),
  estimatedHours: numeric('estimated_hours').notNull()
});
