"use server";

import { createTask, deleteTask, getTasks, updateTask } from "@/db/queries/tasks";
import { InsertTask } from "@/db/schema/tasks";
import { ActionState } from "@/types";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";

export async function getTasksAction(projectId: string): Promise<ActionState> {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return { status: "error", message: "Not authenticated" };
  }

  try {
    const tasks = await getTasks(session.user.id, projectId);
    return { status: "success", message: "Tasks retrieved successfully", data: tasks };
  } catch (error) {
    console.error("Failed to get tasks:", error);
    return { status: "error", message: "Failed to get tasks" };
  }
}

export async function createTaskAction(data: Omit<InsertTask, "userId">): Promise<ActionState> {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return { status: "error", message: "Not authenticated" };
  }

  try {
    const newTask = await createTask({ ...data, userId: session.user.id });
    revalidatePath("/"); // Change this to revalidate the home page
    return { status: "success", message: "Task created successfully", data: newTask };
  } catch (error) {
    console.error("Failed to create task:", error);
    return { status: "error", message: "Failed to create task" };
  }
}

export async function updateTaskAction(id: string, data: Partial<InsertTask>): Promise<ActionState> {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return { status: "error", message: "Not authenticated" };
  }

  try {
    const updatedTask = await updateTask(id, data);
    revalidatePath(`/projects/${updatedTask.projectId}`);
    return { status: "success", message: "Task updated successfully", data: updatedTask };
  } catch (error) {
    console.error("Failed to update task:", error);
    return { status: "error", message: "Failed to update task" };
  }
}

export async function deleteTaskAction(id: string, projectId: string): Promise<ActionState> {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return { status: "error", message: "Not authenticated" };
  }

  try {
    await deleteTask(id);
    revalidatePath(`/projects/${projectId}`);
    return { status: "success", message: "Task deleted successfully" };
  } catch (error) {
    console.error("Failed to delete task:", error);
    return { status: "error", message: "Failed to delete task" };
  }
}