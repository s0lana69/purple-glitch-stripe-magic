'use client';

import React from 'react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { ProfileSecurity } from '@/components/dashboard/settings/profile-security';
import { ApiKeys } from '@/components/dashboard/settings/api-keys';
import { ConnectedAccounts } from '@/components/dashboard/settings/connected-accounts';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function Page() {
  return (
    <AuthGuard>
      <DashboardShell>
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-primary-foreground">Account & API Settings</h1>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <ProfileSecurity />
          <ApiKeys />
        </div>

        <ConnectedAccounts />
      </div>
      </DashboardShell>
    </AuthGuard>
  );
}
