import { apiClient } from "@/lib/api/client";

export interface Message {
  id: string;
  content: string;
  type: "TEXT" | "FILE" | "SYSTEM";
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: string;
    email: string;
    role: string;
    intern?: {
      fullName: string;
      profilePhoto?: {
        publicUrl: string;
      };
    };
    companyAdmin?: {
      fullName: string;
    };
  };
}

export interface CreateMessageDto {
  content: string;
  type?: "TEXT" | "FILE" | "SYSTEM";
  metadata?: any;
}

export const messageApi = {
  async createMessage(data: CreateMessageDto): Promise<Message> {
    const response = await apiClient.post("/messages", data);
    return response.data;
  },

  async getMessages(limit = 100, before?: Date): Promise<Message[]> {
    const response = await apiClient.get("/messages", {
      params: { limit, before: before?.toISOString() },
    });
    return response.data;
  },

  async deleteMessage(id: string): Promise<void> {
    await apiClient.delete(`/messages/${id}`);
  },
};
