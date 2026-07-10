import { cn } from '../../lib/utils';

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  className?: string;
  color?: string;
}

export function ProgressRing({
  value,
  max = 100,
  size = 160,
  strokeWidth = 6,
  label,
  sublabel,
  className,
  color = 'var(--color-accent)',
}: ProgressRingProps) {
  const percent = Math.min(Math.round((value / max) * 100), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full opacity-20 blur-xl" style={{ background: color }} />
      <svg width={size} height={size} className="transform -rotate-90 relative z-10">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        {label !== undefined ? (
          <>
            <span className="text-3xl font-display font-light text-[var(--color-text-page-title)]">{label}</span>
            {sublabel && <span className="text-[11px] font-semibold text-[var(--color-text-meta)] uppercase tracking-widest mt-1">{sublabel}</span>}
          </>
        ) : (
          <>
            <span className="text-3xl font-display font-light text-[var(--color-text-page-title)]">{percent}%</span>
            {sublabel && <span className="text-[11px] font-semibold text-[var(--color-text-meta)] uppercase tracking-widest mt-1">{sublabel}</span>}
          </>
        )}
      </div>
    </div>
  );
}
