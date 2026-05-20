import type { Prisma } from "@prisma/client";
import type { PublicUser } from "../types/api.types.js";

const TARGET_ROLE_PREFIX = "Desired role:";

export const userInclude = {
  intern: {
    include: {
      resumeFile: true,
      profilePhoto: true,
      skills: { include: { skill: true } },
    },
  },
  companyAdmin: {
    include: {
      company: { include: { logoFile: true } },
    },
  },
} satisfies Prisma.UserInclude;

export type UserWithProfiles = Prisma.UserGetPayload<{ include: typeof userInclude }>;

function parseTargetRole(bio: string | null | undefined): string {
  if (!bio) return "";
  const line = bio.split("\n").find((l) => l.startsWith(TARGET_ROLE_PREFIX));
  return line ? line.replace(TARGET_ROLE_PREFIX, "").trim() : "";
}

export function toPublicUser(user: UserWithProfiles): PublicUser {
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    internProfile: user.intern
      ? {
          id: user.intern.id,
          fullName: user.intern.fullName,
          college: user.intern.college,
          degree: user.intern.degree,
          branch: user.intern.specialization,
          internshipRole: parseTargetRole(user.intern.bio),
          skills: user.intern.skills.map((s) => s.skill.name).join(", "),
          linkedinUrl: user.intern.linkedinUrl,
          githubUrl: user.intern.githubUrl,
          resumeUrl: user.intern.resumeFile?.publicUrl ?? null,
          profilePhotoUrl: user.intern.profilePhoto?.publicUrl ?? null,
          startDate: user.intern.durationStart.toISOString().slice(0, 10),
          endDate: user.intern.durationEnd.toISOString().slice(0, 10),
        }
      : null,
    companyAdminProfile: user.companyAdmin
      ? {
          id: user.companyAdmin.id,
          companyId: user.companyAdmin.companyId,
          companyName: user.companyAdmin.company.name,
          adminName: user.companyAdmin.fullName,
          department: user.companyAdmin.department,
          logoUrl: user.companyAdmin.company.logoFile?.publicUrl ?? null,
        }
      : null,
  };
}

export function buildInternBio(internshipRole: string): string {
  return `${TARGET_ROLE_PREFIX} ${internshipRole}`;
}
