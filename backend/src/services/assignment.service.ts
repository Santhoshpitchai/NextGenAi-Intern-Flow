import { AssignmentStatus, UserRole } from "@prisma/client";
import { prisma } from "../config/database.js";
import { ApiError } from "../utils/ApiError.js";
import { createNotification } from "./notification.service.js";

export interface CreateAssignmentInput {
  internId: string;
  title: string;
  department?: string;
  startDate: string;
  endDate: string;
  managerId?: string;
  notes?: string;
}

export interface UpdateAssignmentInput {
  title?: string;
  department?: string;
  status?: AssignmentStatus;
  startDate?: string;
  endDate?: string;
  managerId?: string;
  notes?: string;
}

export interface GetAssignmentsOptions {
  userId: string;
  userRole: UserRole;
  page?: number;
  limit?: number;
  status?: string;
  internId?: string;
}

export async function createAssignment(input: CreateAssignmentInput, createdById: string) {
  // Verify intern exists
  const intern = await prisma.intern.findFirst({
    where: { id: input.internId, deletedAt: null },
    include: { user: true },
  });

  if (!intern) {
    throw ApiError.notFound("Intern not found");
  }

  // Get company from creator
  const creator = await prisma.user.findFirst({
    where: { id: createdById, deletedAt: null },
    include: { companyAdmin: true },
  });

  if (!creator?.companyAdmin) {
    throw ApiError.forbidden("Only company admins can create assignments");
  }

  const assignment = await prisma.internshipAssignment.create({
    data: {
      internId: input.internId,
      companyId: creator.companyAdmin.companyId,
      title: input.title,
      department: input.department,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
      managerId: input.managerId,
      notes: input.notes,
      status: AssignmentStatus.PENDING,
      createdById,
    },
    include: {
      intern: {
        include: {
          user: true,
        },
      },
      company: true,
      manager: true,
    },
  });

  // Create notification for intern
  await createNotification({
    userId: intern.userId,
    type: "ASSIGNMENT_UPDATE",
    title: "New Assignment",
    body: `You have been assigned to: ${input.title}`,
    actionUrl: `/intern/assignments/${assignment.id}`,
  });

  return assignment;
}

export async function getAssignments(options: GetAssignmentsOptions) {
  const { userId, userRole, page = 1, limit = 10, status, internId } = options;
  const skip = (page - 1) * limit;

  let where: any = { deletedAt: null };

  // Role-based filtering
  if (userRole === UserRole.INTERN) {
    const intern = await prisma.intern.findFirst({
      where: { userId, deletedAt: null },
    });
    if (!intern) throw ApiError.notFound("Intern profile not found");
    where.internId = intern.id;
  } else if (userRole === UserRole.COMPANY_ADMIN) {
    const admin = await prisma.companyAdmin.findFirst({
      where: { userId, deletedAt: null },
    });
    if (!admin) throw ApiError.notFound("Admin profile not found");
    where.companyId = admin.companyId;
  }

  if (status) {
    where.status = status;
  }

  if (internId) {
    where.internId = internId;
  }

  const [assignments, total] = await Promise.all([
    prisma.internshipAssignment.findMany({
      where,
      include: {
        intern: {
          include: {
            user: { select: { email: true, phone: true } },
            skills: { include: { skill: true } },
          },
        },
        company: true,
        manager: { select: { id: true, email: true, role: true } },
        tasks: {
          where: { deletedAt: null },
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            dueDate: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.internshipAssignment.count({ where }),
  ]);

  return {
    assignments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getAssignmentById(id: string, userId: string, userRole: UserRole) {
  const assignment = await prisma.internshipAssignment.findFirst({
    where: { id, deletedAt: null },
    include: {
      intern: {
        include: {
          user: { select: { email: true, phone: true } },
          skills: { include: { skill: true } },
        },
      },
      company: true,
      manager: { select: { id: true, email: true, role: true } },
      tasks: {
        where: { deletedAt: null },
        include: {
          assignee: { select: { id: true, email: true } },
          progressEntries: {
            where: { deletedAt: null },
            orderBy: { recordedAt: "desc" },
            take: 5,
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!assignment) {
    throw ApiError.notFound("Assignment not found");
  }

  // Check access
  if (userRole === UserRole.INTERN) {
    const intern = await prisma.intern.findFirst({
      where: { userId, deletedAt: null },
    });
    if (assignment.internId !== intern?.id) {
      throw ApiError.forbidden("You can only view your own assignments");
    }
  } else if (userRole === UserRole.COMPANY_ADMIN) {
    const admin = await prisma.companyAdmin.findFirst({
      where: { userId, deletedAt: null },
    });
    if (assignment.companyId !== admin?.companyId) {
      throw ApiError.forbidden("You can only view assignments from your company");
    }
  }

  return assignment;
}

export async function updateAssignment(
  id: string,
  input: UpdateAssignmentInput,
  userId: string,
  userRole: UserRole
) {
  const existing = await prisma.internshipAssignment.findFirst({
    where: { id, deletedAt: null },
    include: { intern: { include: { user: true } } },
  });

  if (!existing) {
    throw ApiError.notFound("Assignment not found");
  }

  // Only admins can update
  if (userRole !== UserRole.COMPANY_ADMIN && userRole !== UserRole.SUPER_ADMIN) {
    throw ApiError.forbidden("Only admins can update assignments");
  }

  const admin = await prisma.companyAdmin.findFirst({
    where: { userId, deletedAt: null },
  });

  if (userRole === UserRole.COMPANY_ADMIN && existing.companyId !== admin?.companyId) {
    throw ApiError.forbidden("You can only update assignments from your company");
  }

  const updated = await prisma.internshipAssignment.update({
    where: { id },
    data: {
      ...(input.title && { title: input.title }),
      ...(input.department && { department: input.department }),
      ...(input.status && { status: input.status }),
      ...(input.startDate && { startDate: new Date(input.startDate) }),
      ...(input.endDate && { endDate: new Date(input.endDate) }),
      ...(input.managerId !== undefined && { managerId: input.managerId }),
      ...(input.notes !== undefined && { notes: input.notes }),
      updatedById: userId,
    },
    include: {
      intern: { include: { user: true } },
      company: true,
      manager: true,
    },
  });

  // Notify intern of update
  await createNotification({
    userId: existing.intern.userId,
    type: "ASSIGNMENT_UPDATE",
    title: "Assignment Updated",
    body: `Your assignment "${updated.title}" has been updated`,
    actionUrl: `/intern/assignments/${updated.id}`,
  });

  return updated;
}

export async function deleteAssignment(id: string, userId: string, userRole: UserRole) {
  const existing = await prisma.internshipAssignment.findFirst({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    throw ApiError.notFound("Assignment not found");
  }

  if (userRole !== UserRole.COMPANY_ADMIN && userRole !== UserRole.SUPER_ADMIN) {
    throw ApiError.forbidden("Only admins can delete assignments");
  }

  const admin = await prisma.companyAdmin.findFirst({
    where: { userId, deletedAt: null },
  });

  if (userRole === UserRole.COMPANY_ADMIN && existing.companyId !== admin?.companyId) {
    throw ApiError.forbidden("You can only delete assignments from your company");
  }

  await prisma.internshipAssignment.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

export async function getInternAssignments(userId: string, status?: string) {
  const intern = await prisma.intern.findFirst({
    where: { userId, deletedAt: null },
  });

  if (!intern) {
    throw ApiError.notFound("Intern profile not found");
  }

  const where: any = {
    internId: intern.id,
    deletedAt: null,
  };

  if (status) {
    where.status = status;
  }

  return prisma.internshipAssignment.findMany({
    where,
    include: {
      company: true,
      manager: { select: { id: true, email: true } },
      tasks: {
        where: { deletedAt: null },
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          dueDate: true,
          completedAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
