import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { ToolsContent } from '@/components/dashboard/tools-content';

export default function Page() {
  return (
    <DashboardShell>
      <ToolsContent />
    </DashboardShell>
  );
}
