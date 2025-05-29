import React from 'react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { AuditContent } from '@/components/dashboard/audit-content';

export default function Page() {
  return (
    <DashboardShell>
      <AuditContent />
    </DashboardShell>
  );
}
