import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Save, User as UserIcon, Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { userApi } from "@/services/user-api";
import { authApi } from "@/services/auth-api";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().optional(),
  college: z.string().min(1, "College name is required"),
  degree: z.string().min(1, "Degree is required"),
  branch: z.string().min(1, "Specialization is required"),
  linkedinUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export const Route = createFileRoute("/intern/settings")({
  head: () => ({ meta: [{ title: "Settings — InternFlow AI" }] }),
  component: InternSettingsPage,
});

function InternSettingsPage() {
  const { user, refetchUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.internProfile?.fullName || "",
      phone: user?.phone || "",
      college: user?.internProfile?.college || "",
      degree: user?.internProfile?.degree || "",
      branch: user?.internProfile?.branch || "",
      linkedinUrl: user?.internProfile?.linkedinUrl || "",
      githubUrl: user?.internProfile?.githubUrl || "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onProfileSubmit = async (values: ProfileFormValues) => {
    try {
      setIsUpdatingProfile(true);
      await userApi.updateProfile({
        fullName: values.fullName,
        phone: values.phone,
        college: values.college,
        degree: values.degree,
        branch: values.branch,
        linkedinUrl: values.linkedinUrl || undefined,
        githubUrl: values.githubUrl || undefined,
      });
      await refetchUser();
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onPasswordSubmit = async (values: PasswordFormValues) => {
    try {
      setIsUpdatingPassword(true);
      await authApi.changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      toast.success("Password changed successfully! Logging you out...");
      setTimeout(() => {
        logout();
      }, 1500);
    } catch (error: any) {
      toast.error(error?.message || "Failed to change password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage your personal information and security preferences."
      />

      <div className="mx-auto max-w-4xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserIcon className="size-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="size-4" />
              <span>Security</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="rounded-2xl glass border border-border/50 p-6 shadow-glass">
              <h3 className="mb-4 text-lg font-bold">Personal Information</h3>

              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      {...profileForm.register("fullName")}
                      className="bg-background/50"
                    />
                    {profileForm.formState.errors.fullName && (
                      <p className="text-xs text-destructive">
                        {profileForm.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      {...profileForm.register("phone")}
                      className="bg-background/50"
                    />
                    {profileForm.formState.errors.phone && (
                      <p className="text-xs text-destructive">
                        {profileForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="college">College/University</Label>
                    <Input
                      id="college"
                      {...profileForm.register("college")}
                      className="bg-background/50"
                    />
                    {profileForm.formState.errors.college && (
                      <p className="text-xs text-destructive">
                        {profileForm.formState.errors.college.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="degree">Degree</Label>
                    <Input
                      id="degree"
                      {...profileForm.register("degree")}
                      className="bg-background/50"
                    />
                    {profileForm.formState.errors.degree && (
                      <p className="text-xs text-destructive">
                        {profileForm.formState.errors.degree.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="branch">Specialization / Branch</Label>
                    <Input
                      id="branch"
                      {...profileForm.register("branch")}
                      className="bg-background/50"
                    />
                    {profileForm.formState.errors.branch && (
                      <p className="text-xs text-destructive">
                        {profileForm.formState.errors.branch.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl">LinkedIn URL (Optional)</Label>
                    <Input
                      id="linkedinUrl"
                      {...profileForm.register("linkedinUrl")}
                      className="bg-background/50"
                      placeholder="https://linkedin.com/in/..."
                    />
                    {profileForm.formState.errors.linkedinUrl && (
                      <p className="text-xs text-destructive">
                        {profileForm.formState.errors.linkedinUrl.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="githubUrl">GitHub URL (Optional)</Label>
                    <Input
                      id="githubUrl"
                      {...profileForm.register("githubUrl")}
                      className="bg-background/50"
                      placeholder="https://github.com/..."
                    />
                    {profileForm.formState.errors.githubUrl && (
                      <p className="text-xs text-destructive">
                        {profileForm.formState.errors.githubUrl.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end border-t border-border/40 pt-5 mt-6">
                  <Button type="submit" disabled={isUpdatingProfile} className="gap-2 bg-primary">
                    {isUpdatingProfile ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Save className="size-4" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="rounded-2xl glass border border-border/50 p-6 shadow-glass">
              <h3 className="mb-4 text-lg font-bold">Change Password</h3>

              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-5">
                <div className="max-w-md space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="oldPassword">Current Password</Label>
                    <Input
                      id="oldPassword"
                      type="password"
                      {...passwordForm.register("oldPassword")}
                      className="bg-background/50"
                    />
                    {passwordForm.formState.errors.oldPassword && (
                      <p className="text-xs text-destructive">
                        {passwordForm.formState.errors.oldPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      {...passwordForm.register("newPassword")}
                      className="bg-background/50"
                    />
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-xs text-destructive">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...passwordForm.register("confirmPassword")}
                      className="bg-background/50"
                    />
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-xs text-destructive">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-start border-t border-border/40 pt-5 mt-6">
                  <Button type="submit" disabled={isUpdatingPassword} className="gap-2 bg-primary">
                    {isUpdatingPassword ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Save className="size-4" />
                    )}
                    Update Password
                  </Button>
                </div>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
