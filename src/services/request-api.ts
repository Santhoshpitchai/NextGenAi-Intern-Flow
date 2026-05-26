import { apiClient } from "@/lib/api/client";

export interface Request {
  id: string;
  type: "TIME_OFF" | "RESOURCE" | "HELP" | "OTHER";
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  title: string;
  description: string;
  response?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    email: string;
    intern?: {
      fullName: string;
    };
  };
  reviewedBy?: {
    id: string;
    email: string;
    companyAdmin?: {
      fullName: string;
    };
  };
}

export interface CreateRequestDto {
  type: "TIME_OFF" | "RESOURCE" | "HELP" | "OTHER";
  title: string;
  description: string;
}

export const requestApi = {
  async createRequest(data: CreateRequestDto): Promise<Request> {
    const response = await apiClient.post("/requests", data);
    return response.data;
  },

  async getMyRequests(): Promise<Request[]> {
    const response = await apiClient.get("/requests/my");
    return response.data;
  },

  async getAllRequests(): Promise<Request[]> {
    const response = await apiClient.get("/requests/all");
    return response.data;
  },

  async getRequestById(id: string): Promise<Request> {
    const response = await apiClient.get(`/requests/${id}`);
    return response.data;
  },

  async updateRequest(
    id: string,
    data: { status?: string; response?: string }
  ): Promise<Request> {
    const response = await apiClient.patch(`/requests/${id}`, data);
    return response.data;
  },

  async deleteRequest(id: string): Promise<void> {
    await apiClient.delete(`/requests/${id}`);
  },
};
