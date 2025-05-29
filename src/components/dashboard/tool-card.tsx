'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface ToolCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  link?: string;
  isNew?: boolean;
  isBeta?: boolean;
  badgeText?: string;
  comingSoon?: boolean;
}

export const ToolCard: React.FC<ToolCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  link, 
  isNew, 
  isBeta, 
  badgeText,
  comingSoon = false
}) => {
  const content = (
    <Card className="h-full flex flex-col group bg-card border-border hover:border-primary/70 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Icon className="w-7 h-7 text-primary mb-2" />
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {isNew && <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">New</Badge>}
          {isBeta && <Badge variant="outline" className="border-blue-500/30 text-blue-400">Beta</Badge>}
          {badgeText && <Badge variant="outline">{badgeText}</Badge>}
        </div>
      </CardContent>
    </Card>
  );

  const handleClick = () => {
    if (comingSoon || (!link && title === "Thumbnail Generator")) {
      toast.info(`The "${title}" tool is coming soon!`);
    } else if (!link) {
      toast.info(`The "${title}" tool is coming soon!`);
    }
  };

  if (link) {
    return <Link href={link} className="h-full block">{content}</Link>;
  }
  return <div onClick={handleClick} className="h-full block">{content}</div>;
};