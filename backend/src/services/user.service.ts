import { UserRole } from "@prisma/client";
import { prisma } from "../config/database.js";
import { ApiError } from "../utils/ApiError.js";
import { slugify } from "../utils/slug.js";
import { toPublicUser, userInclude, buildInternBio } from "./user.mapper.js";
import { syncInternSkills } from "./skill.service.js";
import type {
  UpdateAdminProfileInput,
  UpdateInternProfileInput,
} from "../validators/user.validator.js";
import type { PublicUser } from "../types/api.types.js";

export async function updateProfile(
  userId: string,
  role: UserRole,
  input: UpdateInternProfileInput | UpdateAdminProfileInput,
): Promise<PublicUser> {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    include: userInclude,
  });

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  if (role === UserRole.INTERN) {
    const data = input as UpdateInternProfileInput;

    if (!user.intern) {
      throw ApiError.notFound("Intern profile not found");
    }

    const internUpdate: Record<string, unknown> = {};
    if (data.fullName !== undefined) internUpdate.fullName = data.fullName;
    if (data.college !== undefined) internUpdate.college = data.college;
    if (data.degree !== undefined) internUpdate.degree = data.degree;
    if (data.branch !== undefined) internUpdate.specialization = data.branch;
    if (data.linkedinUrl !== undefined) internUpdate.linkedinUrl = data.linkedinUrl ?? null;
    if (data.githubUrl !== undefined) internUpdate.githubUrl = data.githubUrl ?? null;
    if (data.startDate !== undefined) internUpdate.durationStart = new Date(data.startDate);
    if (data.endDate !== undefined) internUpdate.durationEnd = new Date(data.endDate);
    if (data.internshipRole !== undefined) {
      internUpdate.bio = buildInternBio(data.internshipRole);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.phone !== undefined && { phone: data.phone }),
        intern: { update: internUpdate },
      },
      include: userInclude,
    });

    if (data.skills !== undefined && updated.intern) {
      await syncInternSkills(updated.intern.id, data.skills);
      const refreshed = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        include: userInclude,
      });
      return toPublicUser(refreshed);
    }

    return toPublicUser(updated);
  }

  const data = input as UpdateAdminProfileInput;

  if (!user.companyAdmin) {
    throw ApiError.notFound("Company admin profile not found");
  }

  const adminUpdate: Record<string, unknown> = {};
  if (data.adminName !== undefined) adminUpdate.fullName = data.adminName;
  if (data.department !== undefined) adminUpdate.department = data.department;

  const companyUpdate: Record<string, unknown> = {};
  if (data.companyName !== undefined) {
    companyUpdate.name = data.companyName;
    companyUpdate.slug = slugify(data.companyName);
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.phone !== undefined && { phone: data.phone }),
      companyAdmin: {
        update: {
          ...adminUpdate,
          ...(Object.keys(companyUpdate).length > 0 && {
            company: { update: companyUpdate },
          }),
        },
      },
    },
    include: userInclude,
  });

  return toPublicUser(updated);
}
