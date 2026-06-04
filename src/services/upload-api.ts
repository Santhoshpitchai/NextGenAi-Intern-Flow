import { apiClient } from "@/lib/api/client";

export interface UploadResponse {
  url: string;
  fileId: string;
}

export const uploadApi = {
  async uploadAttachment(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("attachment", file);

    const response = await apiClient.post("/uploads/attachment", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.data;
  },

  async uploadProfilePhoto(file: File): Promise<void> {
    const formData = new FormData();
    formData.append("profilePhoto", file);

    await apiClient.post("/uploads/profile-photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  async uploadResume(file: File): Promise<void> {
    const formData = new FormData();
    formData.append("resume", file);

    await apiClient.post("/uploads/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
