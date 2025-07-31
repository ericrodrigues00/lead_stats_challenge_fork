"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const task_1 = require("../schema/task");
const drizzle_orm_1 = require("drizzle-orm");
const drizzle_client_1 = require("../db/drizzle-client");
let TasksService = class TasksService {
    async createTask(createTaskDto) {
        const [task] = await drizzle_client_1.db
            .insert(task_1.tasks)
            .values({
            title: createTaskDto.title,
            description: createTaskDto.description,
            priority: createTaskDto.priority,
            status: createTaskDto.status,
            dueDate: createTaskDto.dueDate,
            assignedTo: createTaskDto.assignedTo,
            tags: createTaskDto.tags || [],
            estimatedHours: createTaskDto.estimatedHours.toString(),
        })
            .returning();
        return task;
    }
    async findAllTasks() {
        return await drizzle_client_1.db.select().from(task_1.tasks).orderBy((0, drizzle_orm_1.desc)(task_1.tasks.createdAt));
    }
    async findTaskById(id) {
        const [task] = await drizzle_client_1.db
            .select()
            .from(task_1.tasks)
            .where((0, drizzle_orm_1.eq)(task_1.tasks.id, id));
        return task;
    }
    async updateTask(updateTaskDto) {
        const { id, estimatedHours, ...updateData } = updateTaskDto;
        const processedUpdateData = {
            ...updateData,
        };
        if (estimatedHours !== undefined) {
            processedUpdateData.estimatedHours = estimatedHours.toString();
        }
        const [task] = await drizzle_client_1.db
            .update(task_1.tasks)
            .set(processedUpdateData)
            .where((0, drizzle_orm_1.eq)(task_1.tasks.id, id))
            .returning();
        return task;
    }
    async deleteTask(id) {
        const [task] = await drizzle_client_1.db
            .delete(task_1.tasks)
            .where((0, drizzle_orm_1.eq)(task_1.tasks.id, id))
            .returning();
        return task;
    }
    async findTasksByStatus(status) {
        return await drizzle_client_1.db
            .select()
            .from(task_1.tasks)
            .where((0, drizzle_orm_1.eq)(task_1.tasks.status, status))
            .orderBy((0, drizzle_orm_1.desc)(task_1.tasks.createdAt));
    }
    async findTasksByPriority(priority) {
        return await drizzle_client_1.db
            .select()
            .from(task_1.tasks)
            .where((0, drizzle_orm_1.eq)(task_1.tasks.priority, priority))
            .orderBy((0, drizzle_orm_1.desc)(task_1.tasks.createdAt));
    }
    async findTasksByAssignee(assignedTo) {
        return await drizzle_client_1.db
            .select()
            .from(task_1.tasks)
            .where((0, drizzle_orm_1.eq)(task_1.tasks.assignedTo, assignedTo))
            .orderBy((0, drizzle_orm_1.desc)(task_1.tasks.createdAt));
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)()
], TasksService);
