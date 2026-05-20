import type { UserRole } from "@prisma/client";

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface PublicUser {
  id: string;
  email: string;
  phone: string | null;
  role: UserRole;
  createdAt: string;
  internProfile?: InternProfilePublic | null;
  companyAdminProfile?: CompanyAdminProfilePublic | null;
}

export interface InternProfilePublic {
  id: string;
  fullName: string;
  college: string;
  degree: string;
  branch: string;
  internshipRole: string;
  skills: string;
  linkedinUrl: string | null;
  githubUrl: string | null;
  resumeUrl: string | null;
  profilePhotoUrl: string | null;
  startDate: string;
  endDate: string;
}

export interface CompanyAdminProfilePublic {
  id: string;
  companyId: string;
  companyName: string;
  adminName: string;
  department: string;
  logoUrl: string | null;
}
