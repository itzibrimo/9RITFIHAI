import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '../../lib/utils';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface CardProps extends HTMLMotionProps<'div'> {
  hoverEffect?: boolean;
  glow?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect = false, glow = false, children, ...props }, ref) => {
    const reducedMotion = useReducedMotion();

    return (
      <motion.div
        ref={ref}
        whileHover={
          hoverEffect && !reducedMotion
            ? { y: -4, boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)' }
            : {}
        }
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'rounded-[20px] glass p-6 relative overflow-hidden',
          'shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]',
          glow && 'glow-emerald',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = 'Card';
