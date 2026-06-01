import { useState } from "react";
import { useForm, Controller, type DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { SignupEmailPending } from "@/components/signup/signup-email-pending";
import {
  BookOpen,
  Briefcase,
  Calendar,
  Github,
  GraduationCap,
  Layers,
  Linkedin,
  Loader2,
  Mail,
  Phone,
  User,
} from "lucide-react";
import {
  internSignupSchema,
  type InternSignupFormValues,
  INTERNSHIP_ROLES,
  DEGREE_OPTIONS,
} from "@/lib/validations/signup";
import { FormInput } from "@/components/signup/form-input";
import { PasswordField } from "@/components/signup/password-field";
import { FileUpload } from "@/components/signup/file-upload";
import { ProfilePhotoUpload } from "@/components/signup/profile-photo-upload";
import { TermsCheckbox } from "@/components/signup/terms-checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRegisterInternMutation } from "@/hooks/api/use-auth-mutations";
import { useAuthLoginRedirect } from "@/contexts/auth-context";
import { applyApiFieldErrors } from "@/lib/api/form-errors";
import { ApiRequestError } from "@/lib/api/errors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const defaultValues: DefaultValues<InternSignupFormValues> = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  college: "",
  degree: "",
  branch: "",
  internshipRole: "",
  skills: "",
  linkedinUrl: "",
  githubUrl: "",
  startDate: "",
  endDate: "",
  resume: undefined,
  profilePhoto: undefined,
  terms: false,
};

export function InternSignupForm() {
  const registerMutation = useRegisterInternMutation();
  const onAuthSuccess = useAuthLoginRedirect();
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<InternSignupFormValues>({
    resolver: zodResolver(internSignupSchema) as any,
    defaultValues,
    mode: "onBlur",
  });

  const terms = watch("terms");

  const isSubmitting = registerMutation.isPending;

  const onSubmit = async (data: any) => {
    try {
      const result = await registerMutation.mutateAsync(data);
      if (result.requiresVerification) {
        setRegisteredEmail(data.email);
        toast.success("Account created! Please check your email to verify.");
      } else {
        onAuthSuccess(result, true, "Welcome to InternFlow AI!");
      }
    } catch (err) {
      if (applyApiFieldErrors(err, setError)) {
        toast.error(err.message);
      } else if (err instanceof ApiRequestError) {
        toast.error(err.message);
      } else {
        toast.error("Unable to create account. Please try again.");
      }
    }
  };

  if (registeredEmail) {
    return (
      <div className="max-w-md mx-auto py-4">
        <SignupEmailPending email={registeredEmail} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <Controller
        name="profilePhoto"
        control={control}
        render={({ field }) => (
          <ProfilePhotoUpload
            id="profilePhoto"
            value={field.value}
            onChange={field.onChange}
            error={errors.profilePhoto?.message}
            disabled={isSubmitting}
          />
        )}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormInput
          id="fullName"
          label="Full Name"
          icon={User}
          placeholder="Alex Rivera"
          disabled={isSubmitting}
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <FormInput
          id="email"
          label="Email"
          type="email"
          icon={Mail}
          placeholder="alex@uni.edu"
          disabled={isSubmitting}
          error={errors.email?.message}
          {...register("email")}
        />
        <FormInput
          id="phone"
          label="Phone Number"
          icon={Phone}
          placeholder="+1 555 0100"
          disabled={isSubmitting}
          error={errors.phone?.message}
          {...register("phone")}
        />
        <FormInput
          id="college"
          label="College / University"
          icon={GraduationCap}
          placeholder="State University"
          disabled={isSubmitting}
          error={errors.college?.message}
          {...register("college")}
        />

        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Degree
          </Label>
          <Controller
            name="degree"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                <SelectTrigger
                  className={cn(
                    "mt-1.5 h-11 bg-background/60",
                    errors.degree && "border-destructive",
                  )}
                >
                  <BookOpen className="size-4 text-muted-foreground" />
                  <SelectValue placeholder="Select degree" />
                </SelectTrigger>
                <SelectContent>
                  {DEGREE_OPTIONS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.degree && (
            <p className="mt-1.5 text-[0.8rem] font-medium text-destructive">
              {errors.degree.message}
            </p>
          )}
        </div>

        <FormInput
          id="branch"
          label="Branch / Specialization"
          icon={Layers}
          placeholder="Computer Science"
          disabled={isSubmitting}
          error={errors.branch?.message}
          {...register("branch")}
        />

        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Internship Role
          </Label>
          <Controller
            name="internshipRole"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                <SelectTrigger
                  className={cn(
                    "mt-1.5 h-11 bg-background/60",
                    errors.internshipRole && "border-destructive",
                  )}
                >
                  <Briefcase className="size-4 text-muted-foreground" />
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {INTERNSHIP_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.internshipRole && (
            <p className="mt-1.5 text-[0.8rem] font-medium text-destructive">
              {errors.internshipRole.message}
            </p>
          )}
        </div>

        <FormInput
          id="skills"
          label="Skills"
          icon={Layers}
          placeholder="React, TypeScript, Node.js"
          multiline
          className="sm:col-span-2"
          disabled={isSubmitting}
          error={errors.skills?.message}
          {...register("skills")}
        />

        <FormInput
          id="linkedinUrl"
          label="LinkedIn URL"
          icon={Linkedin}
          type="url"
          placeholder="https://linkedin.com/in/you"
          disabled={isSubmitting}
          error={errors.linkedinUrl?.message}
          {...register("linkedinUrl")}
        />
        <FormInput
          id="githubUrl"
          label="GitHub URL"
          icon={Github}
          type="url"
          placeholder="https://github.com/you"
          disabled={isSubmitting}
          error={errors.githubUrl?.message}
          {...register("githubUrl")}
        />

        <PasswordField
          id="password"
          label="Password"
          disabled={isSubmitting}
          error={errors.password?.message}
          {...register("password")}
        />
        <PasswordField
          id="confirmPassword"
          label="Confirm Password"
          disabled={isSubmitting}
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <div>
          <Label
            htmlFor="startDate"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Start Date
          </Label>
          <div className="relative mt-1.5">
            <Calendar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="startDate"
              type="date"
              disabled={isSubmitting}
              className={cn(
                "h-11 bg-background/60 pl-10",
                errors.startDate && "border-destructive",
              )}
              {...register("startDate")}
            />
          </div>
          {errors.startDate && (
            <p className="mt-1.5 text-[0.8rem] font-medium text-destructive">
              {errors.startDate.message}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="endDate"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            End Date (Optional)
          </Label>
          <div className="relative mt-1.5">
            <Calendar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="endDate"
              type="date"
              disabled={isSubmitting}
              className={cn("h-11 bg-background/60 pl-10", errors.endDate && "border-destructive")}
              {...register("endDate")}
            />
          </div>
          {errors.endDate && (
            <p className="mt-1.5 text-[0.8rem] font-medium text-destructive">
              {errors.endDate.message}
            </p>
          )}
        </div>

        <Controller
          name="resume"
          control={control}
          render={({ field }) => (
            <FileUpload
              id="resume"
              label="Resume Upload"
              description="PDF or DOCX — up to 5MB"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              value={field.value}
              onChange={field.onChange}
              error={errors.resume?.message}
              disabled={isSubmitting}
              className="sm:col-span-2"
            />
          )}
        />
      </div>

      <TermsCheckbox
        id="intern-terms"
        checked={!!terms}
        disabled={isSubmitting}
        error={errors.terms?.message}
        onCheckedChange={(v) => setValue("terms", v, { shouldValidate: true })}
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full bg-gradient-primary text-primary-foreground shadow-glow"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Creating your profile…
          </span>
        ) : (
          "Create Intern Account"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
