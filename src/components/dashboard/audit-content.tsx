'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSearch, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

export function AuditContent() {
  const handleStartNewAudit = () => {
    toast.info('Content Audit feature is coming soon! Stay tuned for powerful insights.');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-foreground">Content Audits</h1>
          <p className="text-muted-foreground">Analyze your existing content for SEO and viral potential.</p>
        </div>
        <Button onClick={handleStartNewAudit}>
          <PlusCircle className="mr-2 h-4 w-4" /> Start New Audit
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Audits</CardTitle>
          <CardDescription>Review your past content analysis reports.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center py-12 border-2 border-dashed border-border rounded-lg">
            <FileSearch className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Audits Yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't performed any content audits. Click "Start New Audit" to analyze your content.
            </p>
            <Button variant="outline" onClick={handleStartNewAudit}>
              Run Your First Audit
            </Button>
          </div>
          {/* Placeholder for a list of past audits */}
        </CardContent>
      </Card>
    </div>
  );
}