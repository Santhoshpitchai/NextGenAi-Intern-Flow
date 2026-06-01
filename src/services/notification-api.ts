import { apiClient, unwrap } from "@/lib/api/client";
import type { ApiSuccess } from "@/types/auth";

export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  actionUrl?: string;
  readAt?: string;
  createdAt: string;
}

export const notificationApi = {
  async getNotifications(unreadOnly = false): Promise<Notification[]> {
    const res = await apiClient.get<ApiSuccess<Notification[]>>("/notifications", {
      params: { unreadOnly },
    });
    return unwrap(res);
  },

  async getUnreadCount(): Promise<number> {
    const res = await apiClient.get<ApiSuccess<{ count: number }>>("/notifications/unread");
    return unwrap(res).count;
  },

  async markAsRead(id: string): Promise<void> {
    await apiClient.put(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.put("/notifications/mark-all-read");
  },
};
