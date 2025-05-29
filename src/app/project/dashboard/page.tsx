"use client";

import { DashboardShell } from '@/components/dashboard/dashboard-shell'; // Changed import
import { Overview } from '@/components/dashboard/overview';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { TopPosts } from '@/components/dashboard/top-posts';
import { PlatformMetrics } from '@/components/dashboard/platform-metrics';
import { ClientSuspenseWrapper } from '@/components/dashboard/ClientSuspenseWrapper';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function ProjectDashboardPage() {
  return (
    <AuthGuard>
      <DashboardShell>
      <div className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <ClientSuspenseWrapper>
            <PlatformMetrics />
          </ClientSuspenseWrapper>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <ClientSuspenseWrapper>
            <Overview className="col-span-4" />
          </ClientSuspenseWrapper>
          <ClientSuspenseWrapper>
            <TopPosts className="lg:col-span-3" />
          </ClientSuspenseWrapper>
        </div>
        <ClientSuspenseWrapper>
          <RecentActivity />
        </ClientSuspenseWrapper>
      </div>
      </DashboardShell>
    </AuthGuard>
  );
}
