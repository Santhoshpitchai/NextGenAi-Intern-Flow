import fs from "fs";
import { FileKind, UserRole } from "@prisma/client";
import { prisma } from "../config/database.js";
import { ApiError } from "../utils/ApiError.js";
import { getUploadPath } from "../utils/file.js";
import { createFileRecord } from "./file.service.js";
import { toPublicUser, userInclude } from "./user.mapper.js";
import cloudinary from "../config/cloudinary.js";
import type { PublicUser } from "../types/api.types.js";

function deleteFileByUrl(publicUrl: string | null | undefined, storageKey?: string | null) {
  if (!publicUrl) return;
  // If it's a Cloudinary URL, delete from Cloudinary
  if (publicUrl.startsWith("https://res.cloudinary.com") && storageKey) {
    cloudinary.uploader.destroy(storageKey).catch(() => {});
    return;
  }
  // Otherwise delete from local disk
  const relative = publicUrl.replace(/^\/uploads\//, "");
  const fullPath = getUploadPath(...relative.split("/"));
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}

export async function uploadResume(userId: string, file: Express.Multer.File): Promise<PublicUser> {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null, role: UserRole.INTERN },
    include: userInclude,
  });

  if (!user?.intern) {
    throw ApiError.forbidden("Only interns can upload a resume");
  }

  deleteFileByUrl(user.intern.resumeFile?.publicUrl, user.intern.resumeFile?.storageKey);

  const record = await createFileRecord(userId, file, FileKind.RESUME, "resumes");

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { intern: { update: { resumeFileId: record.id } } },
    include: userInclude,
  });

  return toPublicUser(updated);
}

export async function uploadProfilePhoto(
  userId: string,
  file: Express.Multer.File,
): Promise<PublicUser> {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null, role: UserRole.INTERN },
    include: userInclude,
  });

  if (!user?.intern) {
    throw ApiError.forbidden("Only interns can upload a profile photo");
  }

  deleteFileByUrl(user.intern.profilePhoto?.publicUrl, user.intern.profilePhoto?.storageKey);

  const record = await createFileRecord(userId, file, FileKind.PROFILE_PHOTO, "photos");

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { intern: { update: { profilePhotoId: record.id } } },
    include: userInclude,
  });

  return toPublicUser(updated);
}

export async function uploadAttachment(userId: string, file: Express.Multer.File) {
  const record = await createFileRecord(userId, file, FileKind.TASK_ATTACHMENT, "attachments");
  return record;
}
