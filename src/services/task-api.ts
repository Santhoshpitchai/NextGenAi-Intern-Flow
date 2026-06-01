import { apiClient, unwrap } from "@/lib/api/client";
import type { ApiSuccess } from "@/types/auth";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  completedAt?: string;
  assignment: {
    id: string;
    title: string;
    company: {
      name: string;
    };
  };
  progressEntries?: Array<{
    id: string;
    percentComplete: number;
    summary: string;
    recordedAt: string;
  }>;
}

export const taskApi = {
  async getMyTasks(status?: string): Promise<Task[]> {
    const res = await apiClient.get<ApiSuccess<Task[]>>("/tasks/my/tasks", {
      params: { status },
    });
    return unwrap(res);
  },

  async getAllTasks(params?: {
    assignmentId?: string;
    status?: string;
    priority?: string;
  }): Promise<Task[]> {
    const res = await apiClient.get<ApiSuccess<Task[]>>("/tasks", { params });
    return unwrap(res);
  },

  async createTask(data: {
    assignmentId: string;
    assigneeId: string;
    title: string;
    description?: string;
    priority?: string;
    dueDate?: string;
  }): Promise<Task> {
    const res = await apiClient.post<ApiSuccess<Task>>("/tasks", data);
    return unwrap(res);
  },

  async getTaskById(id: string): Promise<Task> {
    const res = await apiClient.get<ApiSuccess<Task>>(`/tasks/${id}`);
    return unwrap(res);
  },

  async updateTask(id: string, data: any): Promise<Task> {
    const res = await apiClient.patch<ApiSuccess<Task>>(`/tasks/${id}`, data);
    return unwrap(res);
  },

  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },

  async addProgress(
    taskId: string,
    data: {
      percentComplete: number;
      summary: string;
      details?: string;
      blockers?: string;
    },
  ): Promise<any> {
    const res = await apiClient.post(`/tasks/${taskId}/progress`, data);
    return unwrap(res);
  },
};
