import { db } from "@/db/db";
import { projects, InsertProject, Project } from "@/db/schema/projects";
import { eq } from "drizzle-orm";

export const getProjects = async (userId: string): Promise<Project[]> => {
  return db.select().from(projects).where(eq(projects.userId, userId));
};

export const createProject = async (data: InsertProject): Promise<Project> => {
  const [newProject] = await db.insert(projects).values(data).returning();
  return newProject;
};

// ... other project-related queries ...