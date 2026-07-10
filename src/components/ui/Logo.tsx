import { cn } from '../../lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-7 h-7 text-sm', text: 'text-base' },
    md: { icon: 'w-8 h-8 text-sm', text: 'text-lg' },
    lg: { icon: 'w-10 h-10 text-base', text: 'text-xl' },
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn(
        sizes[size].icon,
        'rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dark)] flex items-center justify-center font-bold text-[#060608] shadow-[0_4px_20px_rgba(46,204,154,0.35)]'
      )}>
        9
      </div>
      <span className={cn(sizes[size].text, 'font-display font-light tracking-wide text-[var(--color-text-page-title)]')}>
        9RITFIH
      </span>
    </div>
  );
}
