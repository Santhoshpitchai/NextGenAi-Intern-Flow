// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Link } from "@tanstack/react-router";
// import { Building2, Loader2, Mail, Phone, User } from "lucide-react";
// import { toast } from "sonner";
// import { adminSignupSchema, type AdminSignupFormValues } from "@/lib/validations/signup";
// import { FormInput } from "@/components/signup/form-input";
// import { PasswordField } from "@/components/signup/password-field";
// import { TermsCheckbox } from "@/components/signup/terms-checkbox";
// import { Button } from "@/components/ui/button";
// import { useRegisterAdminMutation } from "@/hooks/api/use-auth-mutations";
// import { useAuthLoginRedirect } from "@/contexts/auth-context";
// import { applyApiFieldErrors } from "@/lib/api/form-errors";
// import { ApiRequestError } from "@/lib/api/errors";

// const defaultValues: AdminSignupFormValues = {
//   companyName: "",
//   adminName: "",
//   email: "",
//   phone: "",
//   password: "",
//   confirmPassword: "",
//   terms: false,
// };

// export function AdminSignupForm() {
//   const registerMutation = useRegisterAdminMutation();
//   const onAuthSuccess = useAuthLoginRedirect();

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     setError,
//     formState: { errors },
//   } = useForm<AdminSignupFormValues>({
//     resolver: zodResolver(adminSignupSchema),
//     defaultValues,
//     mode: "onBlur",
//   });

//   const terms = watch("terms");
//   const isSubmitting = registerMutation.isPending;

//   const onSubmit = async (data: AdminSignupFormValues) => {
//     try {
//       const result = await registerMutation.mutateAsync(data);
//       onAuthSuccess(result, "Company account created successfully!");
//     } catch (err) {
//       if (applyApiFieldErrors(err, setError)) {
//         toast.error(err.message);
//       } else if (err instanceof ApiRequestError) {
//         toast.error(err.message);
//       } else {
//         toast.error("Unable to create account. Please try again.");
//       }
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 sm:grid-cols-2" noValidate>
//       <FormInput
//         id="companyName"
//         label="Company Name"
//         icon={Building2}
//         placeholder="Acme Inc."
//         disabled={isSubmitting}
//         error={errors.companyName?.message}
//         {...register("companyName")}
//       />
//       <FormInput
//         id="adminName"
//         label="Admin Name"
//         icon={User}
//         placeholder="Jane Doe"
//         disabled={isSubmitting}
//         error={errors.adminName?.message}
//         {...register("adminName")}
//       />
//       <FormInput
//         id="email"
//         label="Work Email"
//         type="email"
//         icon={Mail}
//         placeholder="jane@acme.com"
//         disabled={isSubmitting}
//         error={errors.email?.message}
//         {...register("email")}
//       />
//       <FormInput
//         id="phone"
//         label="Phone Number"
//         icon={Phone}
//         placeholder="+1 555 0100"
//         disabled={isSubmitting}
//         error={errors.phone?.message}
//         {...register("phone")}
//       />
//       <PasswordField
//         id="password"
//         label="Password"
//         className="sm:col-span-2"
//         disabled={isSubmitting}
//         error={errors.password?.message}
//         {...register("password")}
//       />
//       <PasswordField
//         id="confirmPassword"
//         label="Confirm Password"
//         className="sm:col-span-2"
//         disabled={isSubmitting}
//         error={errors.confirmPassword?.message}
//         {...register("confirmPassword")}
//       />

//       <TermsCheckbox
//         id="admin-terms"
//         className="sm:col-span-2"
//         checked={!!terms}
//         disabled={isSubmitting}
//         error={errors.terms?.message}
//         onCheckedChange={(v) => setValue("terms", v, { shouldValidate: true })}
//       />

//       <Button
//         type="submit"
//         disabled={isSubmitting}
//         className="sm:col-span-2 h-11 w-full bg-gradient-primary text-primary-foreground shadow-glow"
//       >
//         {isSubmitting ? (
//           <span className="flex items-center justify-center gap-2">
//             <Loader2 className="size-4 animate-spin" />
//             Creating account…
//           </span>
//         ) : (
//           "Create Company Account"
//         )}
//       </Button>

//       <p className="sm:col-span-2 text-center text-sm text-muted-foreground">
//         Already have an account?{" "}
//         <Link to="/login" className="font-semibold text-primary hover:underline">
//           Sign in
//         </Link>
//       </p>
//     </form>
//   );
// }

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { Building2, Loader2, Mail, Phone, User } from "lucide-react";
import { toast } from "sonner";

import {
  adminSignupSchema,
  type AdminSignupFormValues,
} from "@/lib/validations/signup";

import { FormInput } from "@/components/signup/form-input";
import { PasswordField } from "@/components/signup/password-field";
import { TermsCheckbox } from "@/components/signup/terms-checkbox";
import { Button } from "@/components/ui/button";

import { useRegisterAdminMutation } from "@/hooks/api/use-auth-mutations";
import { useAuthLoginRedirect } from "@/contexts/auth-context";

import { applyApiFieldErrors } from "@/lib/api/form-errors";
import { ApiRequestError } from "@/lib/api/errors";

const defaultValues: AdminSignupFormValues = {
  companyName: "",
  adminName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  terms: false,
};

export function AdminSignupForm() {
  const registerMutation = useRegisterAdminMutation();
  const onAuthSuccess = useAuthLoginRedirect();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<AdminSignupFormValues>({
    resolver: zodResolver(adminSignupSchema),
    defaultValues,
    mode: "onBlur",
  });

  const isSubmitting = registerMutation.isPending;

  const onSubmit = async (data: AdminSignupFormValues) => {
    try {
      const result = await registerMutation.mutateAsync(data);

      onAuthSuccess(
        result,
        "Company account created successfully!"
      );
    } catch (err: any) {
      if (applyApiFieldErrors(err, setError)) {
        toast.error(err.message);
      } else if (err instanceof ApiRequestError) {
        toast.error(err.message);
      } else {
        toast.error(
          "Unable to create account. Please try again."
        );
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-5 sm:grid-cols-2"
      noValidate
    >
      <FormInput
        id="companyName"
        label="Company Name"
        icon={Building2}
        placeholder="Acme Inc."
        disabled={isSubmitting}
        error={errors.companyName?.message}
        {...register("companyName")}
      />

      <FormInput
        id="adminName"
        label="Admin Name"
        icon={User}
        placeholder="Jane Doe"
        disabled={isSubmitting}
        error={errors.adminName?.message}
        {...register("adminName")}
      />

      <FormInput
        id="email"
        label="Work Email"
        type="email"
        icon={Mail}
        placeholder="jane@acme.com"
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

      <PasswordField
        id="password"
        label="Password"
        className="sm:col-span-2"
        disabled={isSubmitting}
        error={errors.password?.message}
        {...register("password")}
      />

      <PasswordField
        id="confirmPassword"
        label="Confirm Password"
        className="sm:col-span-2"
        disabled={isSubmitting}
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Controller
        name="terms"
        control={control}
        rules={{
          required: "You must accept the terms and conditions",
        }}
        render={({ field }) => (
          <TermsCheckbox
            id="admin-terms"
            className="sm:col-span-2"
            checked={!!field.value}
            disabled={isSubmitting}
            error={errors.terms?.message}
            onCheckedChange={field.onChange}
          />
        )}
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="sm:col-span-2 h-11 w-full bg-gradient-primary text-primary-foreground shadow-glow"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Creating account…
          </span>
        ) : (
          "Create Company Account"
        )}
      </Button>

      <p className="sm:col-span-2 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
