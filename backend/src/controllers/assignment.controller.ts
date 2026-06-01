import type { Request, Response } from "express";
import * as assignmentService from "../services/assignment.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";
import type { CreateAssignmentInput } from "../validators/assignment.validator.js";

export const createAssignment = asyncHandler(async (req: Request, res: Response) => {
  const assignment = await assignmentService.createAssignment(
    req.body as CreateAssignmentInput,
    req.user!.id,
  );
  sendSuccess(res, 201, "Assignment created successfully", assignment);
});

export const getAssignments = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10", status, internId } = req.query;

  const assignments = await assignmentService.getAssignments({
    userId: req.user!.id,
    userRole: req.user!.role,
    page: parseInt(typeof page === "string" ? page : "1", 10),
    limit: parseInt(typeof limit === "string" ? limit : "10", 10),
    status: typeof status === "string" ? status : undefined,
    internId: typeof internId === "string" ? internId : undefined,
  });

  sendSuccess(res, 200, "Assignments retrieved successfully", assignments);
});

export const getAssignmentById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const assignmentId = typeof id === "string" ? id : id[0];
  const assignment = await assignmentService.getAssignmentById(
    assignmentId,
    req.user!.id,
    req.user!.role,
  );
  sendSuccess(res, 200, "Assignment retrieved successfully", assignment);
});

export const updateAssignment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const assignmentId = typeof id === "string" ? id : id[0];
  const assignment = await assignmentService.updateAssignment(
    assignmentId,
    req.body,
    req.user!.id,
    req.user!.role,
  );
  sendSuccess(res, 200, "Assignment updated successfully", assignment);
});

export const deleteAssignment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const assignmentId = typeof id === "string" ? id : id[0];
  await assignmentService.deleteAssignment(assignmentId, req.user!.id, req.user!.role);
  sendSuccess(res, 200, "Assignment deleted successfully", null);
});

export const getMyAssignments = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query;
  const assignments = await assignmentService.getInternAssignments(
    req.user!.id,
    typeof status === "string" ? status : undefined,
  );
  sendSuccess(res, 200, "My assignments retrieved successfully", assignments);
});
