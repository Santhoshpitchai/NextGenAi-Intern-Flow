import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Save, User as UserIcon, Lock, Loader2, Building2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { userApi } from "@/services/user-api";
import { authApi } from "@/services/auth-api";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const profileSchema = z.object({
  adminName: z.string().min(2, "Full name is required"),
  companyName: z.string().min(2, "Company name is required"),
  department: z.string().min(1, "Department is required"),
  phone: z.string().optional(),
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

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — InternFlow AI" }] }),
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const { user, refetchUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      adminName: user?.companyAdminProfile?.adminName || "",
      companyName: user?.companyAdminProfile?.companyName || "",
      department: user?.companyAdminProfile?.department || "",
      phone: user?.phone || "",
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
        adminName: values.adminName,
        companyName: values.companyName,
        department: values.department,
        phone: values.phone,
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
              <Building2 className="size-4" />
              <span>Company & Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="size-4" />
              <span>Security</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="rounded-2xl glass border border-border/50 p-6 shadow-glass">
              <h3 className="mb-4 text-lg font-bold">Admin Information</h3>

              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="adminName">Full Name</Label>
                    <Input
                      id="adminName"
                      {...profileForm.register("adminName")}
                      className="bg-background/50"
                    />
                    {profileForm.formState.errors.adminName && (
                      <p className="text-xs text-destructive">
                        {profileForm.formState.errors.adminName.message}
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
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      {...profileForm.register("companyName")}
                      className="bg-background/50"
                    />
                    {profileForm.formState.errors.companyName && (
                      <p className="text-xs text-destructive">
                        {profileForm.formState.errors.companyName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      {...profileForm.register("department")}
                      className="bg-background/50"
                    />
                    {profileForm.formState.errors.department && (
                      <p className="text-xs text-destructive">
                        {profileForm.formState.errors.department.message}
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
