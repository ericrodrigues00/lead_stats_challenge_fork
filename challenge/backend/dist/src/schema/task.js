"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tasks = exports.statusEnum = exports.priorityEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.priorityEnum = (0, pg_core_1.pgEnum)('priority', ['LOW', 'MEDIUM', 'HIGH']);
exports.statusEnum = (0, pg_core_1.pgEnum)('status', ['TODO', 'IN_PROGRESS', 'DONE']);
exports.tasks = (0, pg_core_1.pgTable)('tasks', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    title: (0, pg_core_1.varchar)('title', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description').notNull(),
    priority: (0, exports.priorityEnum)('priority').notNull(),
    status: (0, exports.statusEnum)('status').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    dueDate: (0, pg_core_1.timestamp)('due_date', { withTimezone: true }),
    assignedTo: (0, pg_core_1.varchar)('assigned_to', { length: 255 }).notNull(),
    tags: (0, pg_core_1.jsonb)('tags').notNull().default([]),
    estimatedHours: (0, pg_core_1.numeric)('estimated_hours').notNull()
});
