import { cn } from '@/lib/utils';

interface OnlyPipeIconProps {
  className?: string;
}

export default function OnlyPipeIcon({ className }: OnlyPipeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('w-6 h-6', className)}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16V12" />
      <path d="M12 8h.01" />
    </svg>
  );
}
