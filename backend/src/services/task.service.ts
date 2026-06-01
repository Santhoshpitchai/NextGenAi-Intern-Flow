import { TaskStatus, TaskPriority, UserRole } from "@prisma/client";
import { prisma } from "../config/database.js";
import { ApiError } from "../utils/ApiError.js";
import { createNotification } from "./notification.service.js";

export interface CreateTaskInput {
  assignmentId: string;
  assigneeId: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface AddProgressInput {
  percentComplete: number;
  summary: string;
  details?: string;
  blockers?: string;
}

export async function createTask(input: CreateTaskInput, createdById: string) {
  // Verify assignment exists
  const assignment = await prisma.internshipAssignment.findFirst({
    where: { id: input.assignmentId, deletedAt: null },
    include: { intern: { include: { user: true } } },
  });

  if (!assignment) {
    throw ApiError.notFound("Assignment not found");
  }

  const task = await prisma.task.create({
    data: {
      assignmentId: input.assignmentId,
      assigneeId: input.assigneeId,
      createdById,
      title: input.title,
      description: input.description,
      priority: input.priority || TaskPriority.MEDIUM,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      status: TaskStatus.TODO,
    },
    include: {
      assignment: { include: { company: true } },
      assignee: { select: { id: true, email: true } },
      createdBy: { select: { id: true, email: true } },
    },
  });

  // Notify assignee
  await createNotification({
    userId: input.assigneeId,
    type: "TASK_ASSIGNED",
    title: "New Task Assigned",
    body: `You have been assigned: ${task.title}`,
    actionUrl: `/intern/tasks/${task.id}`,
  });

  return task;
}

export async function getTasks(options: {
  userId: string;
  userRole: UserRole;
  assignmentId?: string;
  status?: string;
  priority?: string;
}) {
  const { userId, userRole, assignmentId, status, priority } = options;

  const where: any = { deletedAt: null };

  if (userRole === UserRole.INTERN) {
    where.assigneeId = userId;
  } else if (userRole === UserRole.COMPANY_ADMIN) {
    const admin = await prisma.companyAdmin.findFirst({
      where: { userId, deletedAt: null },
    });
    if (admin) {
      where.assignment = { companyId: admin.companyId };
    }
  }

  if (assignmentId) where.assignmentId = assignmentId;
  if (status) where.status = status;
  if (priority) where.priority = priority;

  return prisma.task.findMany({
    where,
    include: {
      assignment: { include: { company: true, intern: { include: { user: true } } } },
      assignee: { select: { id: true, email: true } },
      createdBy: { select: { id: true, email: true } },
      progressEntries: {
        where: { deletedAt: null },
        orderBy: { recordedAt: "desc" },
        take: 3,
      },
    },
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
  });
}

export async function getMyTasks(userId: string, status?: string) {
  const where: any = {
    assigneeId: userId,
    deletedAt: null,
  };

  if (status) where.status = status;

  return prisma.task.findMany({
    where,
    include: {
      assignment: { include: { company: true } },
      progressEntries: {
        where: { deletedAt: null },
        orderBy: { recordedAt: "desc" },
        take: 1,
      },
    },
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
  });
}

export async function getTaskById(id: string, userId: string, userRole: UserRole) {
  const task = await prisma.task.findFirst({
    where: { id, deletedAt: null },
    include: {
      assignment: { include: { company: true, intern: { include: { user: true } } } },
      assignee: { select: { id: true, email: true } },
      createdBy: { select: { id: true, email: true } },
      progressEntries: {
        where: { deletedAt: null },
        include: { author: { select: { id: true, email: true } } },
        orderBy: { recordedAt: "desc" },
      },
    },
  });

  if (!task) {
    throw ApiError.notFound("Task not found");
  }

  // Check access
  if (userRole === UserRole.INTERN && task.assigneeId !== userId) {
    throw ApiError.forbidden("You can only view your own tasks");
  }

  return task;
}

export async function updateTask(
  id: string,
  input: UpdateTaskInput,
  userId: string,
  userRole: UserRole,
) {
  const existing = await prisma.task.findFirst({
    where: { id, deletedAt: null },
    include: { assignee: true },
  });

  if (!existing) {
    throw ApiError.notFound("Task not found");
  }

  // Interns can only update their own tasks
  if (userRole === UserRole.INTERN && existing.assigneeId !== userId) {
    throw ApiError.forbidden("You can only update your own tasks");
  }

  const updated = await prisma.task.update({
    where: { id },
    data: {
      ...(input.title && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.status && { status: input.status }),
      ...(input.priority && { priority: input.priority }),
      ...(input.dueDate !== undefined && {
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
      }),
      ...(input.status === TaskStatus.DONE && { completedAt: new Date() }),
    },
    include: {
      assignment: { include: { company: true } },
      assignee: { select: { id: true, email: true } },
    },
  });

  // Notify on status change
  if (input.status && input.status !== existing.status) {
    await createNotification({
      userId: existing.createdById,
      type: "TASK_ASSIGNED",
      title: "Task Status Updated",
      body: `Task "${updated.title}" is now ${updated.status}`,
      actionUrl: `/admin/tasks/${updated.id}`,
    });
  }

  return updated;
}

export async function deleteTask(id: string, _userId: string, userRole: UserRole) {
  const existing = await prisma.task.findFirst({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    throw ApiError.notFound("Task not found");
  }

  if (userRole !== UserRole.COMPANY_ADMIN && userRole !== UserRole.SUPER_ADMIN) {
    throw ApiError.forbidden("Only admins can delete tasks");
  }

  await prisma.task.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

export async function addProgressEntry(taskId: string, input: AddProgressInput, userId: string) {
  const task = await prisma.task.findFirst({
    where: { id: taskId, deletedAt: null },
    include: { assignment: { include: { intern: true } } },
  });

  if (!task) {
    throw ApiError.notFound("Task not found");
  }

  if (task.assigneeId !== userId) {
    throw ApiError.forbidden("You can only add progress to your own tasks");
  }

  const progress = await prisma.progressEntry.create({
    data: {
      taskId,
      internId: task.assignment.internId,
      authorId: userId,
      percentComplete: input.percentComplete,
      summary: input.summary,
      details: input.details,
      blockers: input.blockers,
    },
    include: {
      task: true,
      author: { select: { id: true, email: true } },
    },
  });

  // Notify task creator
  await createNotification({
    userId: task.createdById,
    type: "PROGRESS_UPDATE",
    title: "Progress Update",
    body: `${input.percentComplete}% complete: ${input.summary}`,
    actionUrl: `/admin/tasks/${taskId}`,
  });

  return progress;
}
