'use client';

import React from 'react';
import {
  Lightbulb,
  Search,
  MessageSquare,
  Film,
  FileText,
  Sparkles,
  UploadCloud,
  Tags,
  Captions,
  ImageIcon,
  Zap,
  PenTool,
  Upload,
  ScanLine,
} from 'lucide-react';
import { ToolSection } from '@/components/dashboard/tool-section';
import { ToolCard } from '@/components/dashboard/tool-card';

export function ToolsContent() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tools</h1>
          <p className="text-muted-foreground">Your AI-powered toolkit for viral content creation and optimization.</p>
        </div>
      </div>

      <ToolSection title="Ideate & Research" icon={Zap}>
        <ToolCard
          icon={ScanLine}
          title="AI in-depth Scanner"
          description="Perform comprehensive AI-powered analysis of YouTube channels and content."
          link="/dashboard/ai-scanner"
          isNew
          isBeta
        />
        <ToolCard
          icon={Lightbulb}
          title="Video Ideas"
          description="Generate a new viral video idea based on any YouTube channel."
          isBeta
        />
        <ToolCard
          icon={MessageSquare}
          title="Community Posts"
          description="Generate community posts or polls for any YouTube channel."
        />
        <ToolCard
          icon={Film}
          title="Video Research"
          description="Conduct in-depth research on any YouTube keyword."
          isBeta
        />
        <ToolCard
          icon={Search}
          title="Keyword Research"
          description="Discover the best keywords for your YouTube content."
          isBeta
        />
        <ToolCard
          icon={Sparkles}
          title="Niche Explorer"
          description="Explore and analyze top YouTube niches, with relevant RPM."
        />
      </ToolSection>

      <ToolSection title="Scripting" icon={PenTool}>
        <ToolCard
          icon={FileText}
          title="Video Scripts"
          description="Generate scripts for your videos in seconds, now available with templates."
          isBeta
        />
        <ToolCard
          icon={FileText}
          title="Video to New Script"
          description="Rewrite the original script of any YouTube video."
        />
        <ToolCard
          icon={FileText}
          title="Article to Script"
          description="Transform articles into engaging video scripts effortlessly."
          isNew
          isBeta
        />
      </ToolSection>

      <ToolSection title="Upload & Optimize" icon={Upload}>
        <ToolCard
          icon={ImageIcon}
          title="Thumbnail Generator"
          description="Generate an amazing thumbnail for the amazing video you created."
          isNew
          comingSoon
        />
        <ToolCard
          icon={UploadCloud}
          title="Warp Upload"
          description="Generate video titles, descriptions and tags, all at once."
        />
        <ToolCard
          icon={Captions}
          title="Video Titles"
          description="Generate three high-CTR titles for your videos."
        />
        <ToolCard
          icon={FileText}
          title="Video Descriptions"
          description="Generate well-written video descriptions for your videos in seconds."
          badgeText="Now with Timestamps"
        />
        <ToolCard
          icon={Tags}
          title="Video Tags"
          description="Generate tags for your YouTube videos in seconds."
        />
      </ToolSection>
    </div>
  );
}
