'use client';

import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function ContentHeader() {
  const handleCreateNewContent = () => {
    toast.info('Content creation tools are integrated into the "Tools" page. This section will provide an overview of your generated and managed content.');
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-primary-foreground">Content Hub</h1>
        <p className="text-muted-foreground">Manage, review, and organize all your AI-generated and optimized content.</p>
      </div>
      <Button onClick={handleCreateNewContent}>
        <PlusCircle className="mr-2 h-4 w-4" /> Create New (via Tools)
      </Button>
    </div>
  );
}