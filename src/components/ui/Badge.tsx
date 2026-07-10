import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'gold' | 'success' | 'danger';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-[rgba(255,255,255,0.06)] text-[var(--color-text-body)] border-[var(--color-border-subtle)]',
    accent: 'bg-[rgba(46,204,154,0.1)] text-[var(--color-accent)] border-[rgba(46,204,154,0.2)]',
    gold: 'bg-[rgba(201,169,98,0.1)] text-[var(--color-accent-gold)] border-[rgba(201,169,98,0.2)]',
    success: 'bg-[rgba(52,211,153,0.1)] text-[var(--color-success)] border-[rgba(52,211,153,0.2)]',
    danger: 'bg-[rgba(248,113,113,0.1)] text-[var(--color-danger)] border-[rgba(248,113,113,0.2)]',
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
