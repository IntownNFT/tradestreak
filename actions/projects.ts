"use server";

import { createProject, deleteProject, getProjects, updateProject } from "@/db/queries/projects";
import { InsertProject } from "@/db/schema/projects";
import { ActionState } from "@/types";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";

export async function getProjectsAction(): Promise<ActionState> {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return { status: "error", message: "Not authenticated" };
  }

  try {
    const projects = await getProjects(session.user.id);
    return { status: "success", message: "Projects retrieved successfully", data: projects };
  } catch (error) {
    console.error("Failed to get projects:", error);
    return { status: "error", message: "Failed to get projects" };
  }
}

export async function createProjectAction(data: Omit<InsertProject, "userId">): Promise<ActionState> {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return { status: "error", message: "Not authenticated" };
  }

  try {
    const newProject = await createProject({ ...data, userId: session.user.id });
    revalidatePath("/"); // Change this to revalidate the home page
    return { status: "success", message: "Project created successfully", data: newProject };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { status: "error", message: "Failed to create project" };
  }
}

export async function updateProjectAction(id: string, data: Partial<InsertProject>): Promise<ActionState> {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return { status: "error", message: "Not authenticated" };
  }

  try {
    const updatedProject = await updateProject(id, data);
    revalidatePath("/projects");
    return { status: "success", message: "Project updated successfully", data: updatedProject };
  } catch (error) {
    console.error("Failed to update project:", error);
    return { status: "error", message: "Failed to update project" };
  }
}

export async function deleteProjectAction(id: string): Promise<ActionState> {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return { status: "error", message: "Not authenticated" };
  }

  try {
    await deleteProject(id);
    revalidatePath("/projects");
    return { status: "success", message: "Project deleted successfully" };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return { status: "error", message: "Failed to delete project" };
  }
}