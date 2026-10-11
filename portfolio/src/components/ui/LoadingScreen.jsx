import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useReducedMotion } from '@/hooks/useReducedMotion.js';
import { HAJWordmark } from '@/components/ui/HAJWordmark.jsx';

/**
 * Futuristic boot screen: starfield canvas, rotating HUD rings around the
 * HAJ core, circular progress, terminal-style boot log and scanline sweep.
 *
 * Design rules:
 *  - fast by default (~1.6 s total) — a loader must never waste time
 *  - skippable: any click / Enter / Escape dismisses it instantly
 *  - prefers-reduced-motion: renders a static state and exits in ~300 ms
 *  - role="status" + aria-live so screen readers hear the boot progress
 */

const BOOT_LOG = [
  '» initializing core systems',
  '» loading design tokens',
  '» compiling experience modules',
  '» establishing secure link',
  '» rendering interface',
  '» access granted',
];

const PARTICLES = 70;

function Starfield({ reduced }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: PARTICLES }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.00012,
      vy: (Math.random() - 0.5) * 0.00012,
      tw: Math.random() * Math.PI * 2,
      twSpeed: 0.015 + Math.random() * 0.02,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        s.x += s.vx;
        s.y += s.vy;
        s.tw += s.twSpeed;
        if (s.x < -0.02) s.x = 1.02;
        if (s.x > 1.02) s.x = -0.02;
        if (s.y < -0.02) s.y = 1.02;
        if (s.y > 1.02) s.y = -0.02;
        const alpha = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(s.tw));
        ctx.beginPath();
        ctx.arc(s.x * width, s.y * height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 139, 250, ${alpha.toFixed(3)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    if (!reduced) {
      raf = requestAnimationFrame(draw);
    } else {
      // static frame for reduced motion
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        ctx.beginPath();
        ctx.arc(s.x * width, s.y * height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(167, 139, 250, 0.4)';
        ctx.fill();
      }
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

function BootLog({ lines, reduced }) {
  return (
    <div
      className="mt-8 w-full max-w-sm space-y-1 text-left font-mono text-[11px] leading-5 text-violet-400/80"
      aria-hidden="true"
    >
      {lines.map((line, i) => (
        <motion.p
          key={line}
          initial={reduced ? false : { opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="truncate"
        >
          {line}
          {i === lines.length - 1 && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="ml-1 inline-block h-3 w-1.5 translate-y-0.5 bg-violet-400"
            />
          )}
        </motion.p>
      ))}
    </div>
  );
}

export function LoadingScreen({ onComplete }) {
  const { t: tc } = useTranslation('common');
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [logLines, setLogLines] = useState([BOOT_LOG[0]]);
  const [exiting, setExiting] = useState(false);
  const announcedRef = useRef(0);
  const [announcement, setAnnouncement] = useState('');

  const finish = useCallback(() => {
    setExiting(true);
    window.setTimeout(() => onComplete(), reduced ? 120 : 450);
  }, [onComplete, reduced]);

  useEffect(() => {
    // Skip on any click or key — the loader must never trap the user.
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [finish]);

  useEffect(() => {
    const total = reduced ? 4 : BOOT_LOG.length;

    const logTimer = setInterval(() => {
      setLogLines((prev) => {
        if (prev.length >= total) {
          clearInterval(logTimer);
          return prev;
        }
        return [...prev, BOOT_LOG[prev.length]];
      });
    }, reduced ? 60 : 260);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (reduced ? 25 : 5 + Math.random() * 7);
        const clamped = Math.min(next, 100);
        // Announce quarter milestones for screen readers
        const quarters = [25, 50, 75, 100];
        for (const q of quarters) {
          if (prev < q && clamped >= q && announcedRef.current < q) {
            announcedRef.current = q;
            setAnnouncement(`${q}%`);
          }
        }
        if (clamped >= 100) {
          clearInterval(progressTimer);
          window.setTimeout(finish, reduced ? 60 : 350);
        }
        return clamped;
      });
    }, reduced ? 60 : 90);

    return () => {
      clearInterval(logTimer);
      clearInterval(progressTimer);
    };
  }, [reduced, finish]);

  const ringCircumference = 2 * Math.PI * 54;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={false}
        animate={{ opacity: exiting ? 0 : 1, scale: exiting ? 1.04 : 1 }}
        exit={{ opacity: 0, scale: 1.04 }}
        transition={{ duration: reduced ? 0.1 : 0.45, ease: 'easeOut' }}
        className="fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center bg-[#05050c] overflow-hidden"
        role="status"
        aria-live="polite"
        aria-label={tc('loading.screenLabel')}
        onClick={finish}
      >
        {/* Screen-reader progress announcements */}
        <span className="sr-only">{announcement}</span>

        {/* Background layers */}
        <div className="absolute inset-0" aria-hidden="true">
          <Starfield reduced={reduced} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#05050c] via-transparent to-[#05050c]" />
          <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
          {/* HUD grid */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(139, 92, 246, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.4) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
            }}
          />
          {/* Scanline sweep */}
          {!reduced && (
            <motion.div
              animate={{ y: ['-10%', '110%'] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-violet-500/[0.06] to-transparent"
            />
          )}
          {/* HUD corner brackets */}
          {[
            'left-4 top-4 border-l border-t',
            'right-4 top-4 border-r border-t',
            'bottom-4 left-4 border-b border-l',
            'bottom-4 right-4 border-b border-r',
          ].map((pos) => (
            <div
              key={pos}
              className={`absolute h-8 w-8 border-violet-500/40 ${pos}`}
            />
          ))}
          {/* HUD readouts */}
          <div className="absolute bottom-6 left-6 font-mono text-[10px] tracking-widest text-violet-500/50">
            SYS.HAJ v1.0
          </div>
          <div className="absolute bottom-6 right-6 font-mono text-[10px] tracking-widest text-violet-500/50">
            RW · EAT+2
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center px-6 text-center">
          {/* Core: HAJ monogram inside rotating rings */}
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduced ? 0.1 : 0.7, ease: 'easeOut' }}
            className="relative mb-6 flex h-36 w-36 items-center justify-center"
            aria-hidden="true"
          >
            {/* rotating dashed rings */}
            {!reduced && (
              <>
                <motion.svg
                  viewBox="0 0 120 120"
                  className="absolute inset-0 h-full w-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                >
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="rgba(139, 92, 246, 0.35)"
                    strokeWidth="1"
                    strokeDasharray="4 7"
                  />
                </motion.svg>
                <motion.svg
                  viewBox="0 0 120 120"
                  className="absolute inset-0 h-full w-full"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                >
                  <circle
                    cx="60"
                    cy="60"
                    r="44"
                    fill="none"
                    stroke="rgba(167, 139, 250, 0.25)"
                    strokeWidth="1"
                    strokeDasharray="2 5"
                  />
                </motion.svg>
              </>
            )}
            {/* glow core */}
            <div className="absolute h-24 w-24 rounded-full bg-violet-600/20 blur-2xl" />
            <span className="relative font-display text-4xl font-bold tracking-[0.15em] text-white" style={{ textShadow: '0 0 30px rgba(139, 92, 246, 0.8)' }}>
              HAJ
            </span>
          </motion.div>

          {/* Wordmark + identity */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0.1 : 0.6, ease: 'easeOut', delay: reduced ? 0 : 0.15 }}
          >
            <HAJWordmark size="hero" animate={!reduced} stagger={0.1} />
          </motion.div>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0.1 : 0.5, ease: 'easeOut', delay: reduced ? 0 : 0.3 }}
            className="mt-2 font-display text-xl font-semibold tracking-wide text-white sm:text-2xl"
          >
            HIRWA AIME JOSPIN
          </motion.p>
          <motion.p
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduced ? 0.1 : 0.5, ease: 'easeOut', delay: reduced ? 0 : 0.4 }}
            className="mt-1 font-mono text-xs tracking-[0.35em] text-violet-400 uppercase"
          >
            Full-Stack Developer
          </motion.p>

          {/* Boot log */}
          <BootLog lines={logLines} reduced={reduced} />

          {/* Circular progress */}
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduced ? 0.1 : 0.4, delay: reduced ? 0 : 0.35 }}
            className="mt-8 flex items-center gap-4"
            aria-hidden="true"
          >
            <div className="relative h-16 w-16">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="rgba(139, 92, 246, 0.15)"
                  strokeWidth="4"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="url(#hajProgress)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringCircumference * (1 - progress / 100)}
                  className="transition-[stroke-dashoffset] duration-150 ease-out"
                />
                <defs>
                  <linearGradient id="hajProgress" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-mono text-sm font-semibold text-white">
                {Math.floor(progress)}
              </span>
            </div>
            <div className="text-left">
              <p className="font-mono text-[10px] uppercase tracking-widest text-violet-500/70">
                {tc('loading.screenLabel')}
              </p>
              <p className="font-mono text-xs text-violet-300">
                {progress < 100 ? tc('loading.statusLoading') : tc('loading.statusReady')}
              </p>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: reduced ? 0 : 1, duration: 0.4 }}
            className="mt-6 font-mono text-[10px] tracking-widest text-violet-500/50 uppercase"
            aria-hidden="true"
          >
            click or press any key to skip
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
