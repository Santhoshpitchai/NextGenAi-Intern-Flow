import { apiClient, unwrap } from "@/lib/api/client";
import type { ApiSuccess } from "@/types/auth";

export interface Assignment {
  id: string;
  title: string;
  department?: string;
  status: string;
  startDate: string;
  endDate: string;
  notes?: string;
  company: {
    id: string;
    name: string;
  };
  manager?: {
    id: string;
    email: string;
  };
  tasks: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    dueDate?: string;
    completedAt?: string;
  }>;
  intern?: {
    id: string;
    userId: string;
    fullName: string;
    college?: string;
    specialization?: string;
  };
}

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
  status?: string;
  startDate?: string;
  endDate?: string;
  managerId?: string;
  notes?: string;
}

export const assignmentApi = {
  // Intern endpoints
  async getMyAssignments(): Promise<Assignment[]> {
    const res = await apiClient.get<ApiSuccess<Assignment[]>>("/assignments/my/assignments");
    return unwrap(res);
  },

  async getAssignmentById(id: string): Promise<Assignment> {
    const res = await apiClient.get<ApiSuccess<Assignment>>(`/assignments/${id}`);
    return unwrap(res);
  },

  // Admin endpoints
  async getAllAssignments(params?: {
    page?: number;
    limit?: number;
    status?: string;
    internId?: string;
  }): Promise<{ assignments: Assignment[]; pagination: any }> {
    const res = await apiClient.get<ApiSuccess<{ assignments: Assignment[]; pagination: any }>>(
      "/assignments",
      { params },
    );
    return unwrap(res);
  },

  async createAssignment(data: CreateAssignmentInput): Promise<Assignment> {
    const res = await apiClient.post<ApiSuccess<Assignment>>("/assignments", data);
    return unwrap(res);
  },

  async updateAssignment(id: string, data: UpdateAssignmentInput): Promise<Assignment> {
    const res = await apiClient.patch<ApiSuccess<Assignment>>(`/assignments/${id}`, data);
    return unwrap(res);
  },

  async deleteAssignment(id: string): Promise<void> {
    await apiClient.delete(`/assignments/${id}`);
  },
};
