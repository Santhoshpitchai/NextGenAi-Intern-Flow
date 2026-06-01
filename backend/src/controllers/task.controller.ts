import type { Request, Response } from "express";
import * as taskService from "../services/task.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.createTask(req.body, req.user!.id);
  sendSuccess(res, 201, "Task created successfully", task);
});

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const { assignmentId, status, priority } = req.query;
  const tasks = await taskService.getTasks({
    userId: req.user!.id,
    userRole: req.user!.role,
    assignmentId: typeof assignmentId === "string" ? assignmentId : undefined,
    status: typeof status === "string" ? status : undefined,
    priority: typeof priority === "string" ? priority : undefined,
  });
  sendSuccess(res, 200, "Tasks retrieved successfully", tasks);
});

export const getMyTasks = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query;
  const tasks = await taskService.getMyTasks(
    req.user!.id,
    typeof status === "string" ? status : undefined,
  );
  sendSuccess(res, 200, "My tasks retrieved successfully", tasks);
});

export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const taskId = typeof id === "string" ? id : id[0];
  const task = await taskService.getTaskById(taskId, req.user!.id, req.user!.role);
  sendSuccess(res, 200, "Task retrieved successfully", task);
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const taskId = typeof id === "string" ? id : id[0];
  const task = await taskService.updateTask(taskId, req.body, req.user!.id, req.user!.role);
  sendSuccess(res, 200, "Task updated successfully", task);
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const taskId = typeof id === "string" ? id : id[0];
  await taskService.deleteTask(taskId, req.user!.id, req.user!.role);
  sendSuccess(res, 200, "Task deleted successfully", null);
});

export const addProgress = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const taskId = typeof id === "string" ? id : id[0];
  const progress = await taskService.addProgressEntry(taskId, req.body, req.user!.id);
  sendSuccess(res, 201, "Progress added successfully", progress);
});
