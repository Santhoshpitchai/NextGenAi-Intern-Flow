import { apiClient, unwrap } from "@/lib/api/client";
import { tokenStorage } from "@/lib/storage/token-storage";
import type { AdminSignupFormValues, InternSignupFormValues } from "@/lib/validations/signup";
import type { ApiSuccess, AuthResponse, User } from "@/types/auth";

export interface LoginPayload {
  email: string;
  password: string;
}

function buildInternFormData(data: InternSignupFormValues): FormData {
  const form = new FormData();
  form.append("fullName", data.fullName);
  form.append("email", data.email);
  form.append("password", data.password);
  form.append("confirmPassword", data.confirmPassword);
  form.append("phone", data.phone);
  form.append("college", data.college);
  form.append("degree", data.degree);
  form.append("branch", data.branch);
  form.append("internshipRole", data.internshipRole);
  form.append("skills", data.skills);
  if (data.linkedinUrl) form.append("linkedinUrl", data.linkedinUrl);
  if (data.githubUrl) form.append("githubUrl", data.githubUrl);
  form.append("startDate", data.startDate);
  form.append("endDate", data.endDate);
  form.append("terms", String(data.terms));
  form.append("resume", data.resume);
  form.append("profilePhoto", data.profilePhoto);
  return form;
}

export const authApi = {
  async registerAdmin(data: AdminSignupFormValues): Promise<AuthResponse> {
    const res = await apiClient.post<ApiSuccess<AuthResponse>>("/auth/register/admin", {
      companyName: data.companyName,
      adminName: data.adminName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      confirmPassword: data.confirmPassword,
      terms: data.terms,
    });
    return unwrap(res);
  },

  async registerIntern(data: InternSignupFormValues): Promise<AuthResponse> {
    const form = buildInternFormData(data);
    const res = await apiClient.post<ApiSuccess<AuthResponse>>("/auth/register/intern", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return unwrap(res);
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await apiClient.post<ApiSuccess<AuthResponse>>("/auth/login", payload);
    return unwrap(res);
  },

  async logout(): Promise<void> {
    const refreshToken = tokenStorage.getRefreshToken();
    if (refreshToken) {
      await apiClient.post("/auth/logout", { refreshToken }).catch(() => undefined);
    }
  },

  async getMe(): Promise<User> {
    const res = await apiClient.get<ApiSuccess<User>>("/auth/me");
    return unwrap(res);
  },
};
