// This layout applies specifically to the /project/dashboard route segment.
// It assumes parent layouts handle <html>, <body>, and potentially Providers.
import type { Metadata } from 'next';

// We might not need specific providers here if they are in a parent layout.
// If needed, import from the correct path:
// import { Providers } from "../../../components/providers";

// We probably don't need Inter font here if it's in a parent layout.
// import { Inter } from "next/font/google";
// const inter = Inter({ subsets: ["latin"] });

// Metadata specific to this dashboard section
export const metadata: Metadata = {
  title: 'Project Dashboard - TrueViral', // More specific title
  description: "Monitor and manage your project's viral content performance",
};

export default function ProjectDashboardLayout({ children }: { children: React.ReactNode }) {
  // This layout likely just needs to pass children through,
  // or wrap them in a dashboard-specific UI shell component
  // if one exists (e.g., <DashboardShell>{children}</DashboardShell>).
  // For now, just return children.
  return <>{children}</>;

  // If Providers are needed specifically here and not in parent:
  // return <Providers>{children}</Providers>;
}
