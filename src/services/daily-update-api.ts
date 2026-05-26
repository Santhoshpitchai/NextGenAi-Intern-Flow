import { apiClient } from "@/lib/api/client";

export interface DailyUpdate {
  id: string;
  summary: string;
  accomplishments?: string;
  challenges?: string;
  nextSteps?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    email: string;
    intern?: {
      fullName: string;
    };
  };
}

export interface CreateDailyUpdateDto {
  summary: string;
  accomplishments?: string;
  challenges?: string;
  nextSteps?: string;
  date?: Date;
}

export const dailyUpdateApi = {
  async createUpdate(data: CreateDailyUpdateDto): Promise<DailyUpdate> {
    const response = await apiClient.post("/daily-updates", data);
    return response.data;
  },

  async getMyUpdates(limit = 30): Promise<DailyUpdate[]> {
    const response = await apiClient.get("/daily-updates/my", {
      params: { limit },
    });
    return response.data;
  },

  async getAllUpdates(limit = 100): Promise<DailyUpdate[]> {
    const response = await apiClient.get("/daily-updates/all", {
      params: { limit },
    });
    return response.data;
  },

  async getUpdateById(id: string): Promise<DailyUpdate> {
    const response = await apiClient.get(`/daily-updates/${id}`);
    return response.data;
  },

  async deleteUpdate(id: string): Promise<void> {
    await apiClient.delete(`/daily-updates/${id}`);
  },
};
