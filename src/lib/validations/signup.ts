import { z } from "zod";

const PASSWORD_MIN = 8;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

const passwordSchema = z
  .string()
  .min(1, "Password is required")
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
  .or(z.literal(""))
  .refine((val) => !val || z.string().url().safeParse(val).success, {
    message: "Enter a valid URL",
  });

const termsSchema = z.boolean().refine((val) => val === true, {
  message: "You must accept the terms and conditions",
});

function fileSizeRefine(file: File, maxBytes: number) {
  return file.size <= maxBytes;
}

export const adminSignupSchema = z
  .object({
    companyName: z.string().min(1, "Company name is required").min(2, "Company name is too short"),
    adminName: z.string().min(1, "Admin name is required").min(2, "Admin name is too short"),
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: termsSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const internSignupSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required").min(2, "Full name is too short"),
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    phone: phoneSchema,
    college: z.string().min(1, "College/University name is required"),
    degree: z.string().min(1, "Degree is required"),
    branch: z.string().min(1, "Branch/Specialization is required"),
    internshipRole: z.string().min(1, "Internship role is required"),
    skills: z.string().min(1, "Skills are required").min(3, "List at least one skill"),
    linkedinUrl: optionalUrlSchema,
    githubUrl: optionalUrlSchema,
    resume: z
      .unknown()
      .refine((file): file is File => file instanceof File, { message: "Resume is required" })
      .refine((file) => fileSizeRefine(file, MAX_FILE_SIZE), `Resume must be under ${MAX_FILE_SIZE_MB}MB`)
      .refine(
        (file) => {
          const ext = file.name.split(".").pop()?.toLowerCase();
          const allowed =
            file.type === "application/pdf" ||
            file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            ext === "pdf" ||
            ext === "docx";
          return allowed;
        },
        { message: "Resume must be a PDF or DOCX file" },
      ),
    profilePhoto: z
      .unknown()
      .refine((file): file is File => file instanceof File, { message: "Profile photo is required" })
      .refine((file) => fileSizeRefine(file, MAX_FILE_SIZE), `Photo must be under ${MAX_FILE_SIZE_MB}MB`)
      .refine(
        (file) => file.type.startsWith("image/") || /\.(jpe?g|png|webp)$/i.test(file.name),
        { message: "Profile photo must be PNG, JPG, or WEBP" },
      ),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    terms: termsSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end >= start;
    },
    { message: "End date must be on or after start date", path: ["endDate"] },
  );

export type AdminSignupFormValues = z.infer<typeof adminSignupSchema>;
export type InternSignupFormValues = z.infer<typeof internSignupSchema>;
export type SignupRole = "admin" | "intern";

export const INTERNSHIP_ROLES = [
  "Software Engineering",
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "Data Science",
  "Machine Learning",
  "UI/UX Design",
  "Product Management",
  "DevOps",
  "QA / Testing",
  "Cybersecurity",
  "Business Analyst",
  "Marketing",
  "Other",
] as const;

export const DEGREE_OPTIONS = [
  "B.Tech",
  "B.E.",
  "B.Sc.",
  "BCA",
  "M.Tech",
  "M.E.",
  "M.Sc.",
  "MCA",
  "MBA",
  "BBA",
  "Ph.D.",
  "Other",
] as const;
