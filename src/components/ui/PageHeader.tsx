import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, badge, action, className }: PageHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn('flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10', className)}
    >
      <div className="space-y-3">
        {badge && (
          <span className="label-caps inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
            {badge}
          </span>
        )}
        <h1 className="text-3xl md:text-4xl font-display font-light tracking-tight text-[var(--color-text-page-title)]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[15px] text-[var(--color-text-body)] max-w-xl leading-relaxed">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </motion.header>
  );
}
