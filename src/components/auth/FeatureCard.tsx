import React from "react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="glass p-6 rounded-2xl flex items-start gap-4 transition-transform hover:scale-[1.02] duration-300">
      <div className="w-12 h-12 rounded-xl glass flex items-center justify-center shrink-0 shadow-lg border border-white/20">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-lg leading-tight mb-1">{title}</h3>
        <p className="text-white/70 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
