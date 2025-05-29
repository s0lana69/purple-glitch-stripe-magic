import { cn } from '@/lib/utils';

interface ProBadgeProps {
  className?: string;
  size?: 'sm' | 'md';
}

export function ProBadge({ className, size = 'sm' }: ProBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold uppercase tracking-wide',
        'bg-gradient-to-r from-purple-500 to-purple-600',
        'text-white shadow-sm',
        size === 'sm' && 'px-2 py-0.5 text-xs',
        size === 'md' && 'px-2.5 py-1 text-sm',
        className
      )}
    >
      PRO
    </span>
  );
}
