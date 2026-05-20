import type { FileKind } from "@prisma/client";
import { prisma } from "../config/database.js";
import { toPublicFileUrl } from "../utils/file.js";

export async function createFileRecord(
  ownerId: string,
  upload: Express.Multer.File,
  kind: FileKind,
  subfolder: string,
) {
  const storageKey = `${subfolder}/${upload.filename}`;
  return prisma.file.create({
    data: {
      ownerId,
      kind,
      storageKey,
      publicUrl: toPublicFileUrl(storageKey),
      mimeType: upload.mimetype,
      sizeBytes: upload.size,
      originalName: upload.originalname,
    },
  });
}
