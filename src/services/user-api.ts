import { apiClient } from "@/lib/api/client";

export interface User {
  id: string;
  email: string;
  phone?: string;
  role: string;
  intern?: {
    id: string;
    fullName: string;
    college: string;
    degree: string;
    specialization: string;
    githubUrl?: string;
    linkedinUrl?: string;
    durationStart: string;
    durationEnd: string;
    bio?: string;
    skills?: Array<{
      id: string;
      name: string;
      proficiency?: number;
    }>;
  };
  companyAdmin?: {
    id: string;
    fullName: string;
    department: string;
    jobTitle?: string;
    company: {
      id: string;
      name: string;
    };
  };
  internProfile?: {
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
  } | null;
  companyAdminProfile?: {
    id: string;
    companyId: string;
    companyName: string;
    adminName: string;
    department: string;
    logoUrl: string | null;
  } | null;
}

export interface GetAllUsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const mapProfileFields = (u: any): User => {
  if (!u) return u;
  const mapped = { ...u };
  
  if (u.internProfile && !u.intern) {
    mapped.intern = {
      id: u.internProfile.id,
      fullName: u.internProfile.fullName,
      college: u.internProfile.college,
      degree: u.internProfile.degree,
      specialization: u.internProfile.branch, // Map branch to specialization
      linkedinUrl: u.internProfile.linkedinUrl ?? undefined,
      githubUrl: u.internProfile.githubUrl ?? undefined,
      durationStart: u.internProfile.startDate,
      durationEnd: u.internProfile.endDate,
      bio: u.internProfile.internshipRole,
      skills: u.internProfile.skills
        ? u.internProfile.skills.split(", ").map((s: string) => ({ id: s, name: s }))
        : [],
    };
  }
  
  if (u.companyAdminProfile && !u.companyAdmin) {
    mapped.companyAdmin = {
      id: u.companyAdminProfile.id,
      fullName: u.companyAdminProfile.adminName,
      department: u.companyAdminProfile.department,
      company: {
        id: u.companyAdminProfile.companyId,
        name: u.companyAdminProfile.companyName,
      },
    };
  }

  return mapped;
};

export const userApi = {
  async getAllUsers(params?: {
    role?: string;
    page?: number;
    limit?: number;
  }): Promise<GetAllUsersResponse> {
    const response = await apiClient.get("/users", { params });
    const data = response.data.data;
    if (data && Array.isArray(data.users)) {
      data.users = data.users.map(mapProfileFields);
    }
    return data;
  },

  async getChatDirectory(): Promise<User[]> {
    const response = await apiClient.get("/users/directory");
    const data = response.data.data;
    if (data && Array.isArray(data)) {
      return data.map(mapProfileFields);
    }
    return [];
  },

  async getUserById(userId: string): Promise<User> {
    const response = await apiClient.get(`/users/${userId}`);
    return mapProfileFields(response.data.data);
  },

  async updateProfile(data: any): Promise<User> {
    const response = await apiClient.put("/users/profile", data);
    return mapProfileFields(response.data.data);
  },

  async getAdminDashboardStats(): Promise<any> {
    const response = await apiClient.get("/users/admin/dashboard-stats");
    return response.data.data;
  },
};
