import { randomBytes } from "crypto";
import { FileKind, SessionStatus, UserRole } from "@prisma/client";
import { prisma } from "../config/database.js";
import { ApiError } from "../utils/ApiError.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  getRefreshTokenExpiry,
  signVerificationToken,
  verifyVerificationToken,
} from "../utils/jwt.js";
import { hashToken } from "../utils/tokenHash.js";
import { slugify } from "../utils/slug.js";
import { toPublicUser, userInclude, buildInternBio, type UserWithProfiles } from "./user.mapper.js";
import * as emailService from "./email.service.js";
import type {
  RegisterAdminInput,
  RegisterInternInput,
  LoginInput,
  ChangePasswordInput,
} from "../validators/auth.validator.js";
import type { AuthTokens, PublicUser } from "../types/api.types.js";

export interface AuthResult {
  user: PublicUser;
  tokens?: AuthTokens;
  requiresVerification?: boolean;
}

async function uniqueCompanySlug(base: string): Promise<string> {
  let slug = slugify(base);
  let attempt = 0;
  while (await prisma.company.findUnique({ where: { slug } })) {
    attempt += 1;
    slug = `${slugify(base)}-${attempt}`;
  }
  return slug;
}

async function createSession(
  userId: string,
  refreshTokenId: string,
  meta?: { ip?: string; userAgent?: string },
) {
  await prisma.session.create({
    data: {
      userId,
      refreshTokenId,
      status: SessionStatus.ACTIVE,
      expiresAt: getRefreshTokenExpiry(),
      ipAddress: meta?.ip,
      userAgent: meta?.userAgent,
    },
  });
}

async function issueTokens(
  user: UserWithProfiles,
  meta?: { ip?: string; userAgent?: string },
): Promise<AuthTokens> {
  const accessToken = signAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const expiresAt = getRefreshTokenExpiry();
  const record = await prisma.refreshToken.create({
    data: { userId: user.id, tokenHash: "pending", expiresAt },
  });
  const refreshToken = signRefreshToken(user.id, record.id);
  await prisma.refreshToken.update({
    where: { id: record.id },
    data: { tokenHash: hashToken(refreshToken) },
  });

  await createSession(user.id, record.id, meta);

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  return { accessToken, refreshToken };
}

export async function registerCompanyAdmin(input: RegisterAdminInput): Promise<AuthResult> {
  const email = input.email.toLowerCase();
  const existing = await prisma.user.findFirst({
    where: { email, deletedAt: null },
  });
  if (existing) {
    throw ApiError.conflict("An account with this email already exists");
  }

  const passwordHash = await hashPassword(input.password);
  const slug = await uniqueCompanySlug(input.companyName);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      phone: input.phone,
      role: UserRole.COMPANY_ADMIN,
      companyAdmin: {
        create: {
          fullName: input.adminName,
          department: "General",
          jobTitle: "Administrator",
          isPrimary: true,
          company: {
            create: {
              name: input.companyName,
              slug,
            },
          },
        },
      },
    },
    include: userInclude,
  });

  // Email verification disabled — mark as verified and issue tokens immediately
  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerifiedAt: new Date() },
  });

  const tokens = await issueTokens(user);
  return { user: toPublicUser(user), tokens };
}

export interface InternRegistrationFiles {
  resume?: Express.Multer.File;
  profilePhoto?: Express.Multer.File;
}

export async function registerIntern(
  input: RegisterInternInput,
  files: InternRegistrationFiles,
): Promise<AuthResult> {
  if (!files.resume) {
    throw ApiError.badRequest("Resume is required", { resume: ["Resume file is required"] });
  }
  if (!files.profilePhoto) {
    throw ApiError.badRequest("Profile photo is required", {
      profilePhoto: ["Profile photo is required"],
    });
  }

  const email = input.email.toLowerCase();
  const existing = await prisma.user.findFirst({
    where: { email, deletedAt: null },
  });
  if (existing) {
    throw ApiError.conflict("An account with this email already exists");
  }

  const passwordHash = await hashPassword(input.password);

  // Determine file URLs — Cloudinary sets file.path to the secure_url in production
  const resumeIsCloudinary = files.resume.path?.startsWith("http");
  const photoIsCloudinary = files.profilePhoto.path?.startsWith("http");

  const resumePublicUrl = resumeIsCloudinary
    ? files.resume.path
    : `/uploads/resumes/${files.resume.filename}`;
  const photoPublicUrl = photoIsCloudinary
    ? files.profilePhoto.path
    : `/uploads/photos/${files.profilePhoto.filename}`;

  const resumeStorageKey = resumeIsCloudinary
    ? files.resume.filename
    : `resumes/${files.resume.filename}`;
  const photoStorageKey = photoIsCloudinary
    ? files.profilePhoto.filename
    : `photos/${files.profilePhoto.filename}`;

  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        email,
        passwordHash,
        phone: input.phone,
        role: UserRole.INTERN,
      },
    });

    // Create file records within transaction
    const resumeFile = await tx.file.create({
      data: {
        ownerId: createdUser.id,
        kind: FileKind.RESUME,
        storageKey: resumeStorageKey,
        publicUrl: resumePublicUrl,
        mimeType: files.resume!.mimetype,
        sizeBytes: files.resume!.size,
        originalName: files.resume!.originalname,
      },
    });

    const photoFile = await tx.file.create({
      data: {
        ownerId: createdUser.id,
        kind: FileKind.PROFILE_PHOTO,
        storageKey: photoStorageKey,
        publicUrl: photoPublicUrl,
        mimeType: files.profilePhoto!.mimetype,
        sizeBytes: files.profilePhoto!.size,
        originalName: files.profilePhoto!.originalname,
      },
    });

    const intern = await tx.intern.create({
      data: {
        user: { connect: { id: createdUser.id } },
        fullName: input.fullName,
        college: input.college,
        degree: input.degree,
        specialization: input.branch,
        githubUrl: input.githubUrl ?? null,
        linkedinUrl: input.linkedinUrl ?? null,
        resumeFile: { connect: { id: resumeFile.id } },
        profilePhoto: { connect: { id: photoFile.id } },
        durationStart: new Date(input.startDate),
        durationEnd: input.endDate ? new Date(input.endDate) : null,
        bio: buildInternBio(input.internshipRole),
      },
    });

    const rawSkills = input.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const uniqueSkills = new Map<string, string>();
    for (const name of rawSkills) {
      const slug = slugify(name) || `skill-${Date.now()}`;
      if (!uniqueSkills.has(slug)) {
        uniqueSkills.set(slug, name);
      }
    }

    // Upsert skills outside transaction to avoid timeout, collect IDs first
    const skillIds: string[] = [];
    for (const [slug, name] of uniqueSkills.entries()) {
      const skill = await tx.skill.upsert({
        where: { slug },
        create: { name, slug },
        update: { name },
      });
      skillIds.push(skill.id);
    }

    for (const skillId of skillIds) {
      await tx.internSkill.create({
        data: { internId: intern.id, skillId },
      });
    }

    return tx.user.findUniqueOrThrow({
      where: { id: createdUser.id },
      include: userInclude,
    });
  }, { timeout: 30000 });

  // Email verification disabled — mark as verified and issue tokens immediately
  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerifiedAt: new Date() },
  });

  const tokens = await issueTokens(user);
  return { user: toPublicUser(user), tokens };
}

export async function login(
  input: LoginInput,
  meta?: { ip?: string; userAgent?: string },
): Promise<AuthResult> {
  const email = input.email.toLowerCase();
  const user = await prisma.user.findFirst({
    where: { email, deletedAt: null, isActive: true },
    include: userInclude,
  });

  if (!user) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  if (!user.emailVerifiedAt) {
    // Auto-verify on login — email verification is disabled
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerifiedAt: new Date() },
    });
  }

  // Validate role selection to prevent cross-login bypass
  if (input.role) {
    if (input.role === "ADMIN") {
      if (user.role !== UserRole.COMPANY_ADMIN && user.role !== UserRole.SUPER_ADMIN) {
        throw ApiError.unauthorized(
          "Access restricted. This account does not have Admin privileges.",
        );
      }
    } else if (input.role === "INTERN") {
      if (user.role !== UserRole.INTERN) {
        throw ApiError.unauthorized(
          "Access restricted. This account does not have Intern privileges.",
        );
      }
    }
  }

  const tokens = await issueTokens(user, meta);
  return { user: toPublicUser(user), tokens };
}

export async function logout(refreshToken: string): Promise<void> {
  try {
    const payload = verifyRefreshToken(refreshToken);
    const tokenHash = hashToken(refreshToken);

    await prisma.refreshToken.updateMany({
      where: {
        id: payload.jti,
        userId: payload.sub,
        tokenHash,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });

    await prisma.session.updateMany({
      where: { refreshTokenId: payload.jti, revokedAt: null },
      data: { status: SessionStatus.REVOKED, revokedAt: new Date() },
    });
  } catch {
    throw ApiError.unauthorized("Invalid refresh token");
  }
}

export async function refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
  const payload = verifyRefreshToken(refreshToken);
  const tokenHash = hashToken(refreshToken);

  const stored = await prisma.refreshToken.findFirst({
    where: {
      id: payload.jti,
      userId: payload.sub,
      tokenHash,
      revokedAt: null,
      deletedAt: null,
      expiresAt: { gt: new Date() },
    },
  });

  if (!stored) {
    throw ApiError.unauthorized("Invalid or expired refresh token");
  }

  const user = await prisma.user.findFirst({
    where: { id: payload.sub, deletedAt: null, isActive: true },
  });

  if (!user) {
    throw ApiError.unauthorized("User not found");
  }

  const accessToken = signAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return { accessToken, refreshToken };
}

export async function getCurrentUser(userId: string): Promise<PublicUser> {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    include: userInclude,
  });

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  return toPublicUser(user);
}

export async function changePassword(userId: string, input: ChangePasswordInput): Promise<void> {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
  });

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  const valid = await comparePassword(input.oldPassword, user.passwordHash);
  if (!valid) {
    throw ApiError.badRequest("Incorrect old password");
  }

  const newPasswordHash = await hashPassword(input.newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newPasswordHash },
  });
}

export async function forgotPassword(email: string, role?: "INTERN" | "ADMIN"): Promise<void> {
  const normalizedEmail = email.toLowerCase();
  const user = await prisma.user.findFirst({
    where: {
      email: normalizedEmail,
      deletedAt: null,
      ...(role && {
        role: role === "ADMIN"
          ? { in: [UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN] }
          : UserRole.INTERN,
      }),
    },
  });

  if (!user) {
    // Return silently to prevent email enumeration
    return;
  }

  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  });

  emailService.sendPasswordResetEmail(user.email, token).catch((err) => {
    console.error("Failed to send password reset email asynchronously:", err);
  });
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const tokenHash = hashToken(token);

  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
  });

  if (!resetToken) {
    throw ApiError.badRequest("Invalid or expired password reset token");
  }

  const newPasswordHash = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash: newPasswordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
  ]);
}

export async function verifyEmail(token: string): Promise<void> {
  try {
    const payload = verifyVerificationToken(token);
    const user = await prisma.user.findFirst({
      where: { id: payload.sub, email: payload.email, deletedAt: null },
    });

    if (!user) {
      throw ApiError.badRequest("Invalid verification token or user not found");
    }

    if (user.emailVerifiedAt) {
      return; // Idempotent success
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerifiedAt: new Date() },
    });
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw ApiError.badRequest("Invalid or expired verification token");
  }
}

export async function resendVerificationEmail(email: string): Promise<void> {
  const normalizedEmail = email.toLowerCase();
  const user = await prisma.user.findFirst({
    where: { email: normalizedEmail, deletedAt: null },
  });

  if (!user) {
    throw ApiError.notFound("No account found with this email address.");
  }

  if (user.emailVerifiedAt) {
    throw ApiError.badRequest("This email is already verified. Please sign in.");
  }

  const token = signVerificationToken(user.id, user.email);
  emailService.sendVerificationEmail(user.email, token).catch((err) => {
    console.error("Failed to resend verification email:", err);
  });
}
