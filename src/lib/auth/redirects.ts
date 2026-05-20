import type { User, UserRole } from "@/types/auth";

export function getDashboardPath(role: UserRole): "/intern" | "/admin" {
  switch (role) {
    case "COMPANY_ADMIN":
    case "SUPER_ADMIN":
      return "/admin";
    case "INTERN":
    default:
      return "/intern";
  }
}

export function getDisplayName(user: User): string {
  if (user.internProfile?.fullName) return user.internProfile.fullName;
  if (user.companyAdminProfile?.adminName) return user.companyAdminProfile.adminName;
  return user.email.split("@")[0];
}

export function getDisplayRole(user: User): string {
  if (user.role === "INTERN" && user.internProfile) {
    const role = user.internProfile.internshipRole;
    return role ? `Intern · ${role}` : "Intern";
  }
  if (user.role === "COMPANY_ADMIN" && user.companyAdminProfile) {
    return `Admin · ${user.companyAdminProfile.companyName}`;
  }
  if (user.role === "SUPER_ADMIN") return "Super Admin";
  return user.role;
}
