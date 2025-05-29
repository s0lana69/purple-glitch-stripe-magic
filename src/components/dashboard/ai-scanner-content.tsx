'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalysisResult {
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  id: string;
}

export default function AiScannerContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a YouTube URL, channel name, or topic for AI analysis",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setResult(null);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze the content');
      }

      setResult(data);
      toast({
        title: "Analysis Complete",
        description: "Content has been successfully analyzed.",
      });
    } catch (err: any) {
      toast({
        title: "Analysis Failed",
        description: err.message || 'Failed to analyze the content',
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Main Search Container */}
      <div className="w-full max-w-4xl mx-auto">
        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter YouTube URL, channel name, or content topic for AI analysis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full h-16 px-6 pr-16 text-lg bg-transparent border-2 border-blue-600 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500 focus:ring-0 transition-all duration-300"
              style={{
                boxShadow: '0 0 30px rgba(37, 99, 235, 0.6), 0 0 60px rgba(37, 99, 235, 0.3)',
              }}
              disabled={isSearching}
            />
            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="absolute right-2 top-2 h-12 w-12 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all duration-300"
              style={{
                boxShadow: '0 0 15px rgba(37, 99, 235, 0.5)',
              }}
            >
              {isSearching ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>
          </div>
          
          {/* Animated glow effect */}
          <div 
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/20 via-blue-500/30 to-blue-600/20 -z-10 blur-md animate-pulse"
            style={{
              filter: 'blur(8px)',
            }}
          ></div>
        </div>

        {/* Results */}
        {result && (
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {result.content.map((item, index) => (
                  <div key={index} className="mb-4">
                    {item.text}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
