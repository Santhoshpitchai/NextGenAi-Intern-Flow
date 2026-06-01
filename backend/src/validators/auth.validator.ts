import { z } from "zod";

const PASSWORD_MIN = 8;

const passwordSchema = z
  .string()
  .min(PASSWORD_MIN, `Password must be at least ${PASSWORD_MIN} characters`)
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .regex(/^\+?[\d\s\-()]{10,}$/, "Enter a valid phone number");

const optionalUrlSchema = z
  .string()
  .optional()
  .transform((val) => (val === "" ? undefined : val))
  .refine((val) => !val || z.string().url().safeParse(val).success, {
    message: "Enter a valid URL",
  });

export const registerAdminSchema = z
  .object({
    companyName: z.string().min(2, "Company name is required"),
    adminName: z.string().min(2, "Admin name is required"),
    email: z.string().email("Enter a valid email address"),
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z
      .union([z.boolean(), z.string()])
      .transform((v) => v === true || v === "true")
      .refine((v) => v === true, { message: "You must accept the terms and conditions" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const registerInternSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Enter a valid email address"),
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    college: z.string().min(1, "College/University name is required"),
    degree: z.string().min(1, "Degree is required"),
    branch: z.string().min(1, "Branch/Specialization is required"),
    internshipRole: z.string().min(1, "Internship role is required"),
    skills: z.string().min(3, "Skills are required"),
    linkedinUrl: optionalUrlSchema,
    githubUrl: optionalUrlSchema,
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    terms: z
      .union([z.boolean(), z.string()])
      .transform((v) => v === true || v === "true")
      .refine((v) => v === true, { message: "You must accept the terms and conditions" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (!data.endDate) return true;
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end >= start;
    },
    { message: "End date must be on or after start date", path: ["endDate"] },
  );

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["INTERN", "ADMIN"]).optional(),
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  role: z.enum(["INTERN", "ADMIN"]).optional(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: passwordSchema,
});

export type RegisterAdminInput = z.infer<typeof registerAdminSchema>;
export type RegisterInternInput = z.infer<typeof registerInternSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

export const resendVerificationSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
