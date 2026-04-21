import React from "react";
import { Sparkles, Zap, LineChart } from "lucide-react";
import { FeatureCard } from "@/components/auth/FeatureCard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-white overflow-y-auto">
      {/* Left Section - Marketing (Shared Layout) */}
      <div className="hidden md:flex md:w-1/2 flex-col bg-brand-gradient p-12 text-white relative min-h-screen md:sticky md:top-0 items-center justify-center">
        <div className="w-full max-w-xl">
          {/* Logo and Branding */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <div className="w-6 h-6 bg-brand-gradient rounded-md flex items-center justify-center">
                <div className="w-3 h-3 border-r-2 border-b-2 border-white rotate-45 mb-0.5" />
              </div>
            </div>
            <div>
              <h2 className="font-bold text-xl leading-tight">Invennico TechnoLabs</h2>
              <p className="text-white/80 text-sm font-medium">Lead Portal</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <h1 className="text-2xl lg:text-5xl md:text-3xl font-bold leading-[1.1] mb-6">
              Pre-Sales Lead Qualification & Proposal Automation
            </h1>
            <p className="text-white/90 text-lg mb-12 font-medium leading-relaxed">
              Empower your pre-sales team to qualify leads faster with AI-powered analysis,
              automated proposals, and seamless Zoho CRM integration. Hand off qualified
              leads to sales with confidence.
            </p>

            {/* Feature Cards */}
            <div className="space-y-4">
              <FeatureCard
                icon={<Sparkles className="w-5 h-5 text-brand-orange" />}
                title="AI-Powered Analysis"
                description="Instant lead qualification and tech stack recommendations"
              />
              <FeatureCard
                icon={<Zap className="w-5 h-5 text-brand-orange" />}
                title="Automated Proposals"
                description="Generate scope documents and cost estimates in seconds"
              />
              <FeatureCard
                icon={<LineChart className="w-5 h-5 text-brand-orange" />}
                title="CRM Integration"
                description="Seamless sync with Zoho CRM and Google Drive"
              />
            </div>
          </div>
        </div>

        {/* Subtle Decorative element */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
      </div>

      {/* Right Section - Auth Content (Form) */}
      <div className="w-full md:w-1/2 relative min-h-screen">
        {children}
      </div>
    </div>
  );
}
