'use client';

import { useState } from 'react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Overview } from '@/components/dashboard/overview';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { TopPosts } from '@/components/dashboard/top-posts';
import { PlatformMetrics } from '@/components/dashboard/platform-metrics';

export function DashboardView() {
  return (
    <DashboardShell>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <PlatformMetrics />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Overview className="col-span-4" />
        <TopPosts className="lg:col-span-3" />
      </div>
      <RecentActivity />
    </DashboardShell>
  );
}
