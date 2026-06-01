export type UserRole = "INTERN" | "COMPANY_ADMIN" | "SUPER_ADMIN";

export interface InternProfile {
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
  endDate: string | null;
}

export interface CompanyAdminProfile {
  id: string;
  companyId: string;
  companyName: string;
  adminName: string;
  department: string;
  logoUrl: string | null;
}

export interface User {
  id: string;
  email: string;
  phone: string | null;
  role: UserRole;
  createdAt: string;
  internProfile?: InternProfile | null;
  companyAdminProfile?: CompanyAdminProfile | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens?: AuthTokens;
  requiresVerification?: boolean;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorBody {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
