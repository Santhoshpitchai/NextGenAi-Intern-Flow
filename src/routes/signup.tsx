import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, User, Mail, Phone, Lock, Camera, IdCard, Layers } from "lucide-react";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign Up — InternFlow AI" }, { name: "description", content: "Create your InternFlow AI account in under a minute." }] }),
  component: SignupPage,
});

function SignupPage() {
  const [role, setRole] = useState<"admin" | "intern">("admin");
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-mesh">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6"><Logo className="justify-center" /></div>
        <div className="rounded-3xl glass shadow-glass p-8 md:p-10">
          <h1 className="text-3xl font-bold text-center">Create your account</h1>
          <p className="text-center text-muted-foreground text-sm mt-2">Get started with InternFlow AI in under a minute.</p>

          {/* Role tabs */}
          <div className="mt-8 grid grid-cols-2 p-1 bg-muted rounded-xl">
            {(["admin", "intern"] as const).map((r) => (
              <button key={r} onClick={() => setRole(r)}
                className={`h-10 rounded-lg text-sm font-semibold capitalize transition-all ${role === r ? "bg-background shadow-soft text-foreground" : "text-muted-foreground"}`}>
                {r === "admin" ? "Company Admin" : "Intern"}
              </button>
            ))}
          </div>

          {/* Profile photo */}
          <div className="mt-8 flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-glow">
              <Camera className="size-6" />
            </div>
            <div>
              <p className="text-sm font-semibold">Upload profile photo</p>
              <p className="text-xs text-muted-foreground">PNG or JPG, up to 5MB.</p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">Upload</Button>
          </div>

          <form className="mt-8 grid sm:grid-cols-2 gap-5">
            {role === "admin" ? (
              <>
                <Field icon={Building2} label="Company Name" placeholder="Acme Inc." />
                <Field icon={User} label="Admin Name" placeholder="Jane Doe" />
                <Field icon={Mail} label="Work Email" placeholder="jane@acme.com" type="email" />
                <Field icon={Phone} label="Phone Number" placeholder="+1 555 0100" />
                <Field icon={Lock} label="Password" placeholder="••••••••" type="password" className="sm:col-span-2" />
              </>
            ) : (
              <>
                <Field icon={User} label="Full Name" placeholder="Alex Rivera" />
                <Field icon={Mail} label="Email" placeholder="alex@uni.edu" type="email" />
                <Field icon={IdCard} label="Intern ID" placeholder="2026-0042" />
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Department</Label>
                  <Select>
                    <SelectTrigger className="mt-1.5 h-11 bg-background/60"><Layers className="size-4 text-muted-foreground" /><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eng">Engineering</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="ops">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Field icon={Lock} label="Password" placeholder="••••••••" type="password" className="sm:col-span-2" />
              </>
            )}

            <label className="sm:col-span-2 flex items-start gap-2 text-sm text-muted-foreground">
              <Checkbox className="mt-0.5" />
              <span>I agree to the <a className="text-primary hover:underline" href="#">Terms of Service</a> and <a className="text-primary hover:underline" href="#">Privacy Policy</a>.</span>
            </label>

            <Button asChild className="sm:col-span-2 w-full h-11 bg-gradient-primary text-primary-foreground shadow-glow">
              <Link to={role === "admin" ? "/admin" : "/intern"}>Create Account</Link>
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, placeholder, type = "text", className = "" }: { icon: React.ComponentType<{ className?: string }>; label: string; placeholder?: string; type?: string; className?: string }) {
  return (
    <div className={className}>
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>
      <div className="relative mt-1.5">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input type={type} placeholder={placeholder} className="pl-10 h-11 bg-background/60" />
      </div>
    </div>
  );
}
