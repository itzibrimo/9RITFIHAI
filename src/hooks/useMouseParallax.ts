import { useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

export function useMouseParallax(intensity = 0.03) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;

    const handler = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * intensity * 100;
      const y = (e.clientY / window.innerHeight - 0.5) * intensity * 100;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, [intensity, reducedMotion]);

  return ref;
}
