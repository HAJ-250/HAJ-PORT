import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion.js';

/**
 * Canvas-based HAJ wordmark with subtle upward drift and glow.
 * Used as a decorative background element behind the hero portrait.
 */
export function HAJWordmarkCanvas({ className = '', width = 600, height = 600 }) {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();

  // Skip canvas entirely in test environments without canvas support
  const isTestEnv = typeof window === 'undefined' || !window.HTMLCanvasElement || !window.HTMLCanvasElement.prototype.getContext;

  useEffect(() => {
    if (isTestEnv) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = Math.min(width, height);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const baseFontSize = size * 0.22;
    const letters = ['H', 'A', 'J'];

    let time = 0;
    let raf;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);

      if (reduced) {
        ctx.font = `800 ${baseFontSize}px 'Space Grotesk', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(139, 92, 246, 0.08)';
        ctx.fillText('HAJ', centerX, centerY);
        return;
      }

      time += 0.003;

      ctx.font = `800 ${baseFontSize}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Draw glow layers
      for (let layer = 3; layer >= 0; layer--) {
        const alpha = 0.02 * (layer + 1);
        const blur = (layer + 1) * 8;
        const offset = Math.sin(time * 0.5 + layer) * 4;

        ctx.shadowBlur = blur;
        ctx.shadowColor = `rgba(139, 92, 246, ${alpha})`;
        ctx.fillStyle = `rgba(139, 92, 246, ${alpha * 2})`;

        letters.forEach((letter, i) => {
          const x = centerX - baseFontSize * 0.6 + i * baseFontSize * 0.55;
          const y = centerY + offset + Math.sin(time * 0.8 + i * 0.5) * 6;
          ctx.fillText(letter, x, y);
        });
      }

      // Main letters
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(139, 92, 246, 0.15)';
      letters.forEach((letter, i) => {
        const x = centerX - baseFontSize * 0.6 + i * baseFontSize * 0.55;
        const y = centerY + Math.sin(time * 0.7 + i * 0.4) * 8;
        ctx.fillText(letter, x, y);
      });

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [width, height, reduced, isTestEnv]);

  if (isTestEnv) {
    return <div className={className} aria-hidden="true" data-testid="haj-wordmark-canvas" />;
  }

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}