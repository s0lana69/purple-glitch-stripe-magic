'use client';

import React from 'react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Overview } from '@/components/dashboard/overview';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { TopPosts } from '@/components/dashboard/top-posts';
import { PlatformMetrics } from '@/components/dashboard/platform-metrics';
import { YouTubeChannelCard } from '@/components/dashboard/youtube-channel-card';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function DashboardOverviewPage() {
  return (
    <AuthGuard>
      <DashboardShell>
      {/* Row 1: Platform Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
        <PlatformMetrics />
      </div>

      {/* Row 2: Overview (with ChannelCard) | TopPosts | RecentActivity */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        <Overview className="lg:col-span-1"> {/* Overview now takes 1/3 */}
          <div className="mt-4"> {/* Wrapper for YouTubeChannelCard inside Overview */}
            <YouTubeChannelCard /> 
          </div>
        </Overview>
        <TopPosts className="lg:col-span-1" /> {/* TopPosts takes 1/3 */}
        <RecentActivity className="lg:col-span-1" /> {/* RecentActivity takes 1/3 */}
      </div>
      
      {/* Removed Row 3 and Row 4 as their components are now in Row 2 */}
      </DashboardShell>
    </AuthGuard>
  );
}
