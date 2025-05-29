'use client';

import React from 'react';

interface ToolSectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

export const ToolSection: React.FC<ToolSectionProps> = ({ title, icon: Icon, children }) => (
  <div className="mb-10">
    <div className="flex items-center mb-6">
      <Icon className="w-6 h-6 text-purple-700 dark:text-purple-400 mr-3" />
      <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  </div>
);