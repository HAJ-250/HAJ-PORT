import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion.js';

/**
 * Reveal-on-scroll wrapper. Animates once, small translateY + fade.
 * With prefers-reduced-motion, content renders instantly with no wrapper.
 */
export function Reveal({ children, delay = 0, y = 16, className = '', ...rest }) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className={className} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
