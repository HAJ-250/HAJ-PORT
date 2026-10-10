import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion.js';

const letters = ['H', 'A', 'J'];

export function HAJWordmark({
  size = 'hero',
  className = '',
  animate = true,
  stagger = 0.12,
  drift = false,
  letterSpacing = '0.08em',
  fontWeight = 800,
}) {
  const reduced = useReducedMotion();

  const sizeConfig = {
    hero: { fontSize: 'clamp(8rem, 18vw, 16rem)', lineHeight: 1 },
    nav: { fontSize: '1.5rem', lineHeight: 1 },
    footer: { fontSize: 'clamp(6rem, 12vw, 10rem)', lineHeight: 1 },
    small: { fontSize: '3rem', lineHeight: 1 },
  };

  const config = sizeConfig[size] || sizeConfig.hero;

  const letterStyle = {
    display: 'inline-block',
    fontFamily: 'var(--font-display)',
    fontSize: config.fontSize,
    lineHeight: config.lineHeight,
    fontWeight,
    letterSpacing,
    color: 'var(--text)',
    textShadow: '0 0 40px rgba(139, 92, 246, 0.5), 0 0 80px rgba(139, 92, 246, 0.3)',
  };

  const containerStyle = {
    display: 'inline-flex',
    alignItems: 'flex-end',
    gap: size === 'hero' ? '0.02em' : '0',
    whiteSpace: 'nowrap',
  };

  if (!animate || reduced) {
    return (
      <span style={containerStyle} className={className} aria-hidden="true">
        {letters.map((letter, i) => (
          <span key={i} style={letterStyle}>
            {letter}
          </span>
        ))}
      </span>
    );
  }

  const letterVariants = {
    initial: { y: drift ? 20 : 60, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -40, opacity: 0 },
  };

  const transition = {
    duration: drift ? 6 : 0.8,
    ease: drift ? 'easeInOut' : 'easeOut',
    repeat: drift ? Infinity : 0,
    repeatType: drift ? 'mirror' : undefined,
  };

  return (
    <span style={containerStyle} className={className} aria-hidden="true">
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          style={letterStyle}
          initial="initial"
          animate="animate"
          variants={letterVariants}
          transition={{
            ...transition,
            delay: drift ? i * 0.3 : i * stagger,
          }}
        >
          {letter}
        </motion.span>
      ))}
    </span>
  );
}

export function HAJWordmarkCanvas({ className = '', size = 400 }) {
  const reduced = useReducedMotion();

  return (
    <canvas
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      data-reduced={reduced}
    />
  );
}