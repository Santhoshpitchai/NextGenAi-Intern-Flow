import type { FileKind } from "@prisma/client";
import { prisma } from "../config/database.js";
import { toPublicFileUrl } from "../utils/file.js";

export async function createFileRecord(
  ownerId: string,
  upload: Express.Multer.File,
  kind: FileKind,
  subfolder: string,
) {
  // When using Cloudinary, multer-storage-cloudinary puts the full URL in upload.path
  // and the public_id in upload.filename. Use the Cloudinary URL if available.
  const isCloudinaryUrl =
    upload.path && (upload.path.startsWith("http://") || upload.path.startsWith("https://"));

  const publicUrl = isCloudinaryUrl ? upload.path : toPublicFileUrl(`${subfolder}/${upload.filename}`);
  const storageKey = isCloudinaryUrl ? upload.filename : `${subfolder}/${upload.filename}`;

  return prisma.file.create({
    data: {
      ownerId,
      kind,
      storageKey,
      publicUrl,
      mimeType: upload.mimetype,
      sizeBytes: upload.size,
      originalName: upload.originalname,
    },
  });
}
