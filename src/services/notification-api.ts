import { apiClient, unwrap } from "@/lib/api/client";
import { tokenStorage } from "@/lib/storage/token-storage";
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
    if (!tokenStorage.getAccessToken()) return [];
    const res = await apiClient.get<ApiSuccess<Notification[]>>("/notifications", {
      params: { unreadOnly },
    });
    return unwrap(res);
  },

  async getUnreadCount(): Promise<number> {
    if (!tokenStorage.getAccessToken()) return 0;
    const res = await apiClient.get<ApiSuccess<{ count: number }>>("/notifications/unread");
    return unwrap<{ count: number }>(res).count;
  },

  async markAsRead(id: string): Promise<void> {
    await apiClient.put(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.put("/notifications/mark-all-read");
  },
};
