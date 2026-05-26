import { z } from "zod";
import { AssignmentStatus } from "@prisma/client";

export const createAssignmentSchema = z.object({
  internId: z.string().uuid("Invalid intern ID"),
  title: z.string().min(3, "Title must be at least 3 characters").max(160),
  department: z.string().max(120).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  managerId: z.string().uuid().optional(),
  notes: z.string().optional(),
});

export const updateAssignmentSchema = z.object({
  title: z.string().min(3).max(160).optional(),
  department: z.string().max(120).optional(),
  status: z.nativeEnum(AssignmentStatus).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  managerId: z.string().uuid().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
export type UpdateAssignmentInput = z.infer<typeof updateAssignmentSchema>;
