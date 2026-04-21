"use client";

import React from "react";
import { 
  Users, 
  CheckCircle2, 
  FileStack, 
  Wallet, 
  BarChart3, 
  Trophy 
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { LeadsChart } from "@/components/dashboard/charts/LeadsChart";
import { ProposalsChart } from "@/components/dashboard/charts/ProposalsChart";
import { PipelineTrendChart } from "@/components/dashboard/charts/PipelineTrend";
import { SourceBreakdown } from "@/components/dashboard/charts/SourceBreakdown";
import { TechStacksChart } from "@/components/dashboard/charts/TechStacksChart";
import { RecentLeads } from "@/components/dashboard/feed/RecentLeads";
import { RecentActivity } from "@/components/dashboard/feed/RecentActivity";
import { UpcomingFollowUps } from "@/components/dashboard/feed/UpcomingFollowUps";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export default function DashboardPage() {
  // const [activeTab, setActiveTab] = React.useState("This Month");

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Pre-Sales Dashboard</h3>
          <p className="text-sm text-ternary font-medium mt-1">Track lead qualification and proposal automation metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            label="Today" 
            variant="secondary"
            onClick={() => console.log("Today")}
            className="h-9 px-4 text-sm"
          />
          <Button 
            label="This Week" 
            variant="secondary"
            onClick={() => console.log("This Week")}
            className="h-9 px-4 text-sm"  
          />
          <Button 
            label="This Month" 
            variant="secondary"
            onClick={() => console.log("This Month")}
            className="h-9 px-4 text-sm"
          />
          <Button 
            label="This Year" 
            variant="secondary"
            onClick={() => console.log("This Year")}
            className="h-9 px-4 text-sm"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          label="Total Leads Received" 
          value="147" 
          trend={{ value: 12.5, isUp: true }}
          icon={<Image src="/assets/icons/total_leads.svg" alt="Total Leads" width={24} height={24} />}
        />
        <StatCard 
          label="Qualified by Pre-Sales" 
          value="89" 
          trend={{ value: 8.3, isUp: true }}
          icon={<Image src="/assets/icons/qulified_pre_sales.svg" alt="Qualified" width={24} height={24} />}
        />
        <StatCard 
          label="Proposals Sent" 
          value="64" 
          trend={{ value: 15.2, isUp: true }}
          icon={<Image src="/assets/icons/proposal_sent.svg" alt="Proposals" width={24} height={24} />}
        />
        <StatCard 
          label="Qualified Pipeline Value" 
          value="$428K" 
          trend={{ value: 22.4, isUp: true }}
          icon={<Image src="/assets/icons/qulified_pipeline_valued.svg" alt="Pipeline Value" width={24} height={24} />}
        />
        <StatCard 
          label="Qualification Rate" 
          value="61%" 
          trend={{ value: 3.2, isUp: false }}
          icon={<Image src="/assets/icons/qulification_rate.svg" alt="Qualification Rate" width={24} height={24} />}
        />
        <StatCard 
          label="Won (From Zoho CRM)" 
          value="23" 
          trend={{ value: 18.7, isUp: true }}
          icon={<Image src="/assets/icons/won.svg" alt="Won" width={24} height={24} />}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadsChart />
        <ProposalsChart />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PipelineTrendChart />
        </div>
        <SourceBreakdown />
      </div>

      {/* Tech Stacks Chart */}
      <TechStacksChart />

      {/* Bottom Section: Feed & Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentLeads />
        <RecentActivity />
        <UpcomingFollowUps />
      </div>
    </div>
  );
}
