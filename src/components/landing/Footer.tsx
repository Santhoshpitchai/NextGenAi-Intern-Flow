import { useState } from "react";
import { Logo } from "@/components/Logo";
import { TermsModal, PrivacyModal } from "@/components/auth/terms-modal";

export function Footer() {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <footer id="contact" className="border-t border-border bg-card pt-20 pb-10 px-6">
      <div className="mx-auto max-w-7xl grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            The definitive platform for future talent management. Scale your intern programs with
            smart automation.
          </p>
        </div>
        {[
          { title: "Product", items: ["Features", "Pricing", "Integrations", "Changelog"] },
          { title: "Company", items: ["About", "Customers", "Careers", "Press"] },
          {
            title: "Resources",
            items: ["Documentation", "Help Center", "API Reference", "Status"],
          },
        ].map((c) => (
          <div key={c.title}>
            <h4 className="font-semibold mb-4 text-sm">{c.title}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {c.items.map((i) => (
                <li key={i} className="hover:text-primary cursor-pointer transition-colors">
                  {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto max-w-7xl mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        <p>© 2026 InternFlow AI Technologies. All rights reserved.</p>
        <div className="flex gap-6">
          <button
            type="button"
            onClick={() => setShowPrivacy(true)}
            className="hover:text-primary cursor-pointer transition-colors bg-transparent border-none p-0 inline align-baseline"
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => setShowTerms(true)}
            className="hover:text-primary cursor-pointer transition-colors bg-transparent border-none p-0 inline align-baseline"
          >
            Terms of Service
          </button>
          <span className="hover:text-primary cursor-pointer transition-colors">Cookies</span>
        </div>
      </div>

      {/* Terms & Privacy Modals */}
      <TermsModal open={showTerms} onOpenChange={setShowTerms} />
      <PrivacyModal open={showPrivacy} onOpenChange={setShowPrivacy} />
    </footer>
  );
}
