import { Injectable } from '@nestjs/common';
import { db } from '../db/drizzle-client';
import { tasks } from '../schema/task';
import { eq, gte, lte } from 'drizzle-orm';

@Injectable()
export class TasksService {
  async findAll(filters: any = {}) {
    // Por enquanto, retorna todas as tasks
    // Os filtros podem ser implementados posteriormente com uma lógica mais robusta
    return db.select().from(tasks);
  }

  async findOne(id: string) {
    const result = await db.select().from(tasks).where(eq(tasks.id, id));
    return result[0] || null;
  }

  async create(data: any) {
    // Mapear dados do frontend para o schema do backend
    const mappedData = {
      title: data.title,
      description: data.description,
      priority: this.mapUrgencyToPriority(data.urgency),
      status: data.status || 'TODO',
      assignedTo: data.assignedTo || 'Unassigned',
      estimatedHours: data.estimatedHours || 1,
      tags: data.tags || [],
      dueDate: data.dueDate ? new Date(data.dueDate) : null
    };

    const [created] = await db.insert(tasks).values(mappedData).returning();
    return created;
  }

  async update(id: string, data: any) {
    // Mapear dados do frontend para o schema do backend
    const mappedData: any = {};
    
    if (data.title) mappedData.title = data.title;
    if (data.description) mappedData.description = data.description;
    if (data.urgency) mappedData.priority = this.mapUrgencyToPriority(data.urgency);
    if (data.status) mappedData.status = data.status as 'TODO' | 'IN_PROGRESS' | 'DONE';
    if (data.assignedTo) mappedData.assignedTo = data.assignedTo;
    if (data.estimatedHours) mappedData.estimatedHours = data.estimatedHours;
    if (data.tags) mappedData.tags = data.tags;
    if (data.dueDate) mappedData.dueDate = new Date(data.dueDate);

    const [updated] = await db.update(tasks).set(mappedData).where(eq(tasks.id, id)).returning();
    return updated;
  }

  async remove(id: string) {
    await db.delete(tasks).where(eq(tasks.id, id));
    return { id };
  }

  private mapUrgencyToPriority(urgency: string): 'LOW' | 'MEDIUM' | 'HIGH' {
    switch (urgency?.toLowerCase()) {
      case 'high':
        return 'HIGH';
      case 'medium':
        return 'MEDIUM';
      case 'low':
        return 'LOW';
      default:
        return 'MEDIUM'; // Valor padrão
    }
  }
}