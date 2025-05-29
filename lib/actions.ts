"use server"

import { revalidatePath } from "next/cache"
import { sql } from "drizzle-orm"
import { TaskRepository, UserRepository } from "@/lib/repositories"
import type { Task, User, CreateTaskInput, UpdateTaskInput, TaskWithTypedAssignees } from "@/db/schema"
import { db } from "@/db"
import { users, tasks } from "@/db/schema"
import { eq } from "drizzle-orm"
import { Assignee } from "./types"

// Helper: safely parse a date
function safeParseDate(value: Date | string | null): Date {
  return value ? new Date(value) : new Date(0)
}

// Task actions
export async function getTasksByUserId(id : number): Promise<TaskWithTypedAssignees[]> {
  try {
    let rawTasks: any[] = [];

    rawTasks = await TaskRepository.findByAssigner(id);
    // Safely type-cast assignees after query
    const typedTasks: TaskWithTypedAssignees[] = rawTasks.map(task => ({
      ...task,
      assignees: task.assignees as Assignee[],
    }));

    return typedTasks;
  } catch (error) {
    console.error("Error in getTasks:", error);
    throw new Error(
      `Failed to get tasks: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function getTasks(filters?: {
  assigneeId?: number
  assignerId?: number
  status?: "pending" | "in-progress" | "completed"
  priority?: "low" | "medium" | "high"
  search?: string
}): Promise<TaskWithTypedAssignees[]> {
  try {
    let rawTasks: any[] = [];

    if (filters?.assigneeId) {
      rawTasks = await TaskRepository.findByAssignee(filters.assigneeId);
    } else if (filters?.assignerId) {
      rawTasks = await TaskRepository.findByAssigner(filters.assignerId);
    } else if (filters?.status) {
      rawTasks = await TaskRepository.findByStatus(filters.status);
    } else if (filters?.priority) {
      rawTasks = await TaskRepository.findByPriority(filters.priority);
    } else if (filters?.search) {
      rawTasks = await TaskRepository.search(filters.search);
    } else {
      rawTasks = await TaskRepository.findAll();
    }

    // Safely type-cast assignees after query
    const typedTasks: TaskWithTypedAssignees[] = rawTasks.map(task => ({
      ...task,
      assignees: task.assignees as Assignee[],
    }));

    return typedTasks;
  } catch (error) {
    console.error("Error in getTasks:", error);
    throw new Error(
      `Failed to get tasks: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}


export async function getTask(id: number): Promise<Task | null> {
  try {
    const task = await TaskRepository.findById(id);
    return task ?? null;
  } catch (error) {
    console.error("getTask error:", error);
    throw new Error(
      error instanceof Error
        ? `Failed to fetch task: ${error.message}`
        : "Failed to fetch task"
    );
  }
}

interface CreateTaskInputExtended extends CreateTaskInput {
  assignee: Assignee;
}

export async function createTask(taskData: CreateTaskInputExtended): Promise<Task> {
  try {
    const assignee = await UserRepository.findById(Number(taskData.assignee.id))
    if (!assignee) throw new Error("Assignee not found")

    const assigner = await UserRepository.findById(Number(taskData.assignerId))
    if (!assigner) throw new Error("Assigner not found")

    const task = await TaskRepository.create({
      title: taskData.title,
      description: taskData.description,
      status: taskData.status || "pending",
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      assignerId: Number(taskData.assignerId),
      assignerName: assigner.name,
      assignees: [
        {
          id: Number(taskData.assignee.id),
          name: assignee.name,
          assignedAt: taskData.assignee.assignedAt || new Date(),
        }
      ]
      // assigneeId: Number(taskData.assigneeId),
      // assigneeName: assignee.name,
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/tasks")

    return task
  } catch (error) {
    console.error("Error in createTask:", error)
    throw new Error(`Failed to create task: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function updateTask(id: number, updates: Partial<Omit<CreateTaskInputExtended, "assignerId">>): Promise<Task | null> {
  try {
    // if (updates.assignee) {
    //   const assignee = await UserRepository.findById(Number(updates?.assignee.id))
    //   if (!assignee) throw new Error("Assignee not found")
    //   updates.assignee.name = assignee.name
    //   updates.assignee.assignedAt = updates.assignee.assignedAt || new Date()
    // }

    const task = await TaskRepository.update(id, updates)

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/tasks")
    revalidatePath(`/dashboard/tasks/${id}`)

    return task
  } catch (error) {
    console.error("Error in updateTask:", error)
    throw new Error(`Failed to update task: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function addAssigneeToTask(id: number, assignee: Assignee): Promise<Task | null> {
  try {
    const task = await TaskRepository.findById(id);
    if (!task) throw new Error("Task not found");

    const assigner = await UserRepository.findById(task.assignerId);
    if (!assigner) throw new Error("Assigner not found");

    const currentAssignees = (task.assignees ?? []) as Assignee[];

    const alreadyExists = currentAssignees.some(a => a.id === assignee.id);
    if (alreadyExists) {
      throw new Error("Assignee already exists in this task");
    }


    const updatedTask = await TaskRepository.update(id, {
      assignees: [...currentAssignees, assignee],
    });

    // Invalidate pages
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/tasks");
    revalidatePath(`/dashboard/tasks/${id}`);

    return updatedTask;
  } catch (error) {
    console.error("Error in addAssigneeToTask:", error);
    throw new Error(
      `Failed to add assignee to task: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}


export async function updateTaskStatus(id: number, status: "pending" | "in-progress" | "completed"): Promise<Task | null> {
  try {
    const task = await TaskRepository.findById(id)
    if (!task) throw new Error("Task not found")

    const updatedTask = await TaskRepository.update(id, { status })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/tasks")
    revalidatePath(`/dashboard/tasks/${id}`)

    return updatedTask
  } catch (error) {
    console.error("Error in updateTaskStatus:", error)
    throw new Error(`Failed to update task status: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function deleteTask(id: number): Promise<boolean> {
  try {
    const success = await TaskRepository.delete(id)

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/tasks")

    return !!success
  } catch (error) {
    console.error("Error in deleteTask:", error)
    throw new Error(`Failed to delete task: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function getAssignees(user_id : number): Promise<User[]> {
  try {
    return await UserRepository.findAssignees(user_id)
  } catch (error) {
    console.error("Error in getAssignees:", error)
    throw new Error(`Failed to get assignees: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function getTaskStats() {
  try {
    return await TaskRepository.getStats()
  } catch (error) {
    console.error("Error in getTaskStats:", error)
    return {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      highPriority: 0,
      mediumPriority: 0,
      lowPriority: 0,
    }
  }
}

export async function getNotifications(userId: number): Promise<any[]> {
  try {
    const user = await db.query.users.findFirst({
      columns: {
        lastNotificationReadAt: true,
      },
      where: eq(users.id, userId),
    })

    const lastRead = safeParseDate(user?.lastNotificationReadAt ?? null)

    const allTasks = await db.query.tasks.findMany()

    const notifications = allTasks
      .map((task) => {
        const isAssignee = task.assignees === userId
        const isAssigner = task.assignerId === userId

        if (isAssignee) {
          return {
            id: `task-${task.id}-assigned`,
            title: "New task assigned to you",
            message: `"${task.title}" has been assigned to you by ${task.assignerName}`,
            timestamp: task.createdAt,
            type: "taskAssigned",
          }
        } else if (isAssigner && task.status === "completed") {
          return {
            id: `task-${task.id}-completed`,
            title: "Task completed",
            message: `"${task.title}" has been completed by ${(task.assignees as Assignee[]).at(-1)?.name}`,
            timestamp: task.updatedAt,
            type: "task_completed",
          }
        } else if (isAssigner && task.status === "in-progress") {
          return {
            id: `task-${task.id}-progress`,
            title: "Task in progress",
            message: `"${task.title}" is now in progress by ${(task.assignees as Assignee[]).at(-1)?.name}`,
            timestamp: task.updatedAt,
            type: "task_updated",
          }
        }

        return null
      })
      .filter((n): n is NonNullable<typeof n> => n !== null)
      .filter((n) => safeParseDate(n.timestamp) > lastRead)
      .sort((a, b) => safeParseDate(b.timestamp).getTime() - safeParseDate(a.timestamp).getTime())

    return notifications
  } catch (error) {
    console.error("Error in getNotifications:", error)
    return []
  }
}

export async function markNotificationsAsRead(userId: number) {
  await db
    .update(users)
    .set({ lastNotificationReadAt: new Date() })
    .where(eq(users.id, userId))
}
