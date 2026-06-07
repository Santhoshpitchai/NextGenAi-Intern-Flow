import { apiClient } from "@/lib/api/client";
import { tokenStorage } from "@/lib/storage/token-storage";

export interface AttendanceRecord {
  id: string;
  userId: string;
  checkIn: string;
  checkOut?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    intern?: {
      fullName: string;
      college: string;
      specialization: string;
    };
  };
}

export const attendanceApi = {
  async checkIn(): Promise<AttendanceRecord> {
    const response = await apiClient.post("/attendance/check-in");
    return response.data;
  },

  async checkOut(): Promise<AttendanceRecord> {
    const response = await apiClient.post("/attendance/check-out");
    return response.data;
  },

  async getMyRecords(limit = 30): Promise<AttendanceRecord[]> {
    if (!tokenStorage.getAccessToken()) return [];
    const response = await apiClient.get("/attendance/my", {
      params: { limit },
    });
    return response.data;
  },

  async getTodayRecords(): Promise<AttendanceRecord[]> {
    const response = await apiClient.get("/attendance/today");
    return response.data;
  },

  async getAllRecords(limit = 100): Promise<AttendanceRecord[]> {
    const response = await apiClient.get("/attendance/all", {
      params: { limit },
    });
    return response.data;
  },
};
