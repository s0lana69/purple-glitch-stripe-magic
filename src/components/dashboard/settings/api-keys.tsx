'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

export function ApiKeys() {
  const [apiKey, setApiKey] = useState<string | null>(null);

  const handleGenerateNewKey = () => {
    const newKey = `tv_sk_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    setApiKey(newKey);
    toast.success('New API Key Generated (Simulated)', {
      description: `Your new key is displayed below. Please copy and store it securely.`,
    });
  };

  const handleCopyApiKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey)
        .then(() => toast.success('API Key copied to clipboard!'))
        .catch(() => toast.error('Failed to copy API Key.'));
    }
  };

  const handleViewAllKeys = () => {
    toast.info('Viewing all API keys (Placeholder). This section would typically display a list or table of your active API keys with management options.');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Access & Integrations</CardTitle>
        <CardDescription>Manage your API keys for integrating TrueViral.ai with your applications and other services.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-foreground">Your API Keys</h3>
          <p className="text-sm text-muted-foreground">
            Create and manage API keys for programmatic access to TrueViral.ai's content analysis and generation features.
          </p>
          {apiKey && (
            <div className="flex items-center space-x-2 mt-2">
              <Input type="text" value={apiKey} readOnly className="bg-secondary border-border" />
              <Button variant="ghost" size="icon" onClick={handleCopyApiKey} aria-label="Copy API Key">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button variant="default" onClick={handleGenerateNewKey}>
              {apiKey ? 'Regenerate API Key' : 'Generate New API Key'}
            </Button>
            <Button variant="outline" onClick={handleViewAllKeys}>
              View Existing Keys
            </Button>
          </div>
          <p className="text-xs text-muted-foreground pt-2">
            Note: Treat your API keys like passwords. Do not share them publicly or embed them directly in client-side code.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}