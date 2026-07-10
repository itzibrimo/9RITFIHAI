import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '../../lib/utils';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const reducedMotion = useReducedMotion();

    const baseStyles =
      'inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40 focus:ring-offset-2 focus:ring-offset-[var(--color-bg-base)] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

    const variants = {
      primary:
        'bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dark)] text-[#060608] shadow-[0_4px_24px_rgba(46,204,154,0.35)] hover:shadow-[0_8px_32px_rgba(46,204,154,0.45)]',
      secondary:
        'glass text-[var(--color-text-page-title)] hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.12)]',
      ghost:
        'text-[var(--color-text-meta)] hover:text-[var(--color-text-page-title)] hover:bg-[rgba(255,255,255,0.05)]',
      gold:
        'bg-gradient-to-r from-[var(--color-accent-gold)] to-[#A8893E] text-[#060608] shadow-[0_4px_24px_rgba(201,169,98,0.3)] hover:shadow-[0_8px_32px_rgba(201,169,98,0.4)]',
    };

    const sizes = {
      sm: 'h-9 px-4 text-[13px] gap-1.5',
      md: 'h-11 px-6 text-[14px] gap-2',
      lg: 'h-13 px-8 text-[15px] gap-2.5',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={reducedMotion ? {} : { scale: 1.02 }}
        whileTap={reducedMotion ? {} : { scale: 0.97 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
