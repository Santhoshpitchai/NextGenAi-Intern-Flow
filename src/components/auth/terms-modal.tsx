import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TermsModal({ open, onOpenChange }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Terms of Service</DialogTitle>
          <DialogDescription>
            Please read these terms carefully before using InternFlow AI.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[350px] pr-4 my-4 text-sm text-muted-foreground space-y-4">
          <div className="space-y-4">
            <section className="space-y-2">
              <h4 className="font-semibold text-foreground">1. Acceptance of Terms</h4>
              <p>
                By creating an account, logging in, or using InternFlow AI (the
                &quot;Service&quot;), you agree to be bound by these Terms of Service. If you do not
                agree to these terms, you may not access or use the Service.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="font-semibold text-foreground">2. Description of Service</h4>
              <p>
                InternFlow AI is a web application designed to facilitate internship program
                management, task assignment, productivity tracking, daily update loops, and
                collaboration between administrators and interns. The Service is developed and
                maintained in collaboration with NextGen AI Automation.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="font-semibold text-foreground">3. Account Registration & Roles</h4>
              <p>
                You must provide accurate, complete, and current information when registering. You
                are responsible for safeguarding your login credentials. You agree not to disclose
                your password to any third party. Mismatched role authentication (e.g., trying to
                access admin portals with intern credentials) is strictly monitored and restricted.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="font-semibold text-foreground">4. Code of Conduct</h4>
              <p>
                Users agree not to use the Service for any unlawful activities, upload malicious
                code, disrupt the operations of other workspaces, or spam messaging channels. Admins
                and interns are expected to maintain professional standards during communications.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="font-semibold text-foreground">5. Limitation of Liability</h4>
              <p>
                In no event shall InternFlow AI or NextGen AI Automation be liable for any indirect,
                incidental, special, consequential, or punitive damages, including loss of profits,
                data, or workspace availability, arising out of your use of the Service.
              </p>
            </section>

            <p className="text-xs italic pt-2">Last Updated: May 2026</p>
          </div>
        </ScrollArea>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              className="bg-gradient-primary text-primary-foreground font-bold shadow-glow"
            >
              Understood
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function PrivacyModal({ open, onOpenChange }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Privacy Policy</DialogTitle>
          <DialogDescription>
            Your privacy matters to us. Learn how we handle your personal data.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[350px] pr-4 my-4 text-sm text-muted-foreground space-y-4">
          <div className="space-y-4">
            <section className="space-y-2">
              <h4 className="font-semibold text-foreground">1. Information We Collect</h4>
              <p>
                We collect personal information that you voluntarily provide to us when you register
                on the Service. This includes:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Full Name, email address, phone number, and password.</li>
                <li>College/University name, degree, branch, and internship specialization.</li>
                <li>Uploaded documents including resumes (PDF/DOCX) and profile photos.</li>
                <li>System metadata including IP addresses and login logs.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h4 className="font-semibold text-foreground">2. How We Use Your Data</h4>
              <p>
                We use the collected data to operate, maintain, and optimize the Service.
                Specifically:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>To build your intern profile card and showcase achievements to managers.</li>
                <li>To log attendance, verify check-ins, and compile weekly activity reports.</li>
                <li>To deliver instant in-app tag loops and message alerts.</li>
                <li>To enforce portal security controls and role authorization.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h4 className="font-semibold text-foreground">3. Security Measures</h4>
              <p>
                We implement industry-standard cryptographic hashing and access control mechanisms
                to secure your credentials and private files from unauthorized access, leakage, or
                loss.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="font-semibold text-foreground">4. Third-Party Sharing</h4>
              <p>
                We do not sell, rent, or trade your personal data. Sharing only occurs with core
                storage integrations required for profile image hosting and resume storage.
              </p>
            </section>

            <p className="text-xs italic pt-2">Last Updated: May 2026</p>
          </div>
        </ScrollArea>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              className="bg-gradient-primary text-primary-foreground font-bold shadow-glow"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
