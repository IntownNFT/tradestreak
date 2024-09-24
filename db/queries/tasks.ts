import { db } from "@/db/db";
import { tasks, InsertTask, Task } from "@/db/schema/tasks";
import { eq, and } from "drizzle-orm";

export const getTasks = async (userId: string, projectId: string): Promise<Task[]> => {
  return db.select().from(tasks).where(and(eq(tasks.userId, userId), eq(tasks.projectId, projectId)));
};

export const createTask = async (data: InsertTask): Promise<Task> => {
  const [newTask] = await db.insert(tasks).values(data).returning();
  return newTask;
};

export const updateTask = async (id: string, data: Partial<InsertTask>): Promise<Task> => {
  const [updatedTask] = await db
    .update(tasks)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(tasks.id, id))
    .returning();
  return updatedTask;
};

export const deleteTask = async (id: string): Promise<void> => {
  await db.delete(tasks).where(eq(tasks.id, id));
};