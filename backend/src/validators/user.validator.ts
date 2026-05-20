import { z } from "zod";

const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-()]{10,}$/, "Enter a valid phone number")
  .optional();

const optionalUrlSchema = z
  .string()
  .optional()
  .transform((val) => (val === "" ? undefined : val))
  .refine((val) => !val || z.string().url().safeParse(val).success, {
    message: "Enter a valid URL",
  });

export const updateInternProfileSchema = z
  .object({
    fullName: z.string().min(2).optional(),
    phone: phoneSchema,
    college: z.string().min(1).optional(),
    degree: z.string().min(1).optional(),
    branch: z.string().min(1).optional(),
    internshipRole: z.string().min(1).optional(),
    skills: z.string().min(3).optional(),
    linkedinUrl: optionalUrlSchema,
    githubUrl: optionalUrlSchema,
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end >= start;
    },
    { message: "End date must be on or after start date", path: ["endDate"] },
  );

export const updateAdminProfileSchema = z.object({
  companyName: z.string().min(2).optional(),
  adminName: z.string().min(2).optional(),
  department: z.string().min(1).optional(),
  phone: phoneSchema,
});

export type UpdateInternProfileInput = z.infer<typeof updateInternProfileSchema>;
export type UpdateAdminProfileInput = z.infer<typeof updateAdminProfileSchema>;
