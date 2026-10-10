import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useReducedMotion } from '@/hooks/useReducedMotion.js';
import { HAJWordmark } from '@/components/ui/HAJWordmark.jsx';
import { Avatar } from '@/components/ui/Avatar.jsx';

const LOADING_MESSAGES = [
  'Initializing my digital world...',
  'Preparing creative experiences...',
  'Loading projects and innovations...',
  'Building something extraordinary...',
];

export function LoadingScreen({ onComplete }) {
  const { t: tc } = useTranslation('common');
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1500);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setShowContent(true);
          const exitTimer = setTimeout(() => {
            setIsExiting(true);
            const completeTimer = setTimeout(() => {
              onComplete();
            }, reduced ? 100 : 600);
            return () => clearTimeout(completeTimer);
          }, reduced ? 100 : 800);
          return () => clearTimeout(exitTimer);
        }
        return prev + Math.random() * 8 + 2;
      });
    }, 200);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete, reduced]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={false}
        animate={{ opacity: isExiting ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduced ? 0.1 : 0.5, ease: 'easeOut' }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#07070B] overflow-hidden"
        role="status"
        aria-live="polite"
        aria-label={tc('loading.screenLabel')}
      >
        <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-[#07070B] via-[#10101A] to-[#07070B]" />
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-violet-500/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-purple-600/10 blur-3xl" />
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: reduced ? 0.1 : 0.6, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-2xl px-6 text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0.1 : 0.5, ease: 'easeOut', delay: 0.1 }}
            className="font-mono text-xs uppercase tracking-widest text-violet-500/70 mb-6"
          >
            HAJ — DIGITAL EXPERIENCE
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: reduced ? 0.1 : 0.8, ease: 'easeOut', delay: 0.2 }}
            className="relative mb-8"
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
              <div className="w-72 h-72 rounded-full border border-violet-500/20" />
              <div className="w-80 h-80 rounded-full border border-violet-500/10" />
            </div>
            <Avatar size="hero" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: reduced ? 0.1 : 0.7, ease: 'easeOut', delay: 0.3 }}
            className="mb-4"
          >
            <HAJWordmark size="hero" animate={true} stagger={0.12} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: reduced ? 0.1 : 0.5, ease: 'easeOut', delay: 0.5 }}
            className="font-display text-2xl sm:text-3xl font-semibold text-white mb-2"
          >
            HIRWA AIME JOSPIN
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: reduced ? 0.1 : 0.5, ease: 'easeOut', delay: 0.55 }}
            className="font-mono text-sm text-violet-400 mb-1"
          >
            FULL-STACK DEVELOPER
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: reduced ? 0.1 : 0.6, ease: 'easeOut', delay: 0.6 }}
            className="mt-10 w-full max-w-md mx-auto"
          >
            <div className="relative h-1.5 rounded-full bg-[#1a1a2e] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-violet-500 via-violet-400 to-purple-500 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </motion.div>
            </div>
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0.1 : 0.3, ease: 'easeInOut' }}
              className="mt-4 font-mono text-xs text-muted text-center min-h-[20px]"
            >
              {LOADING_MESSAGES[messageIndex]}
            </motion.p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.1 : 0.5, ease: 'easeOut', delay: 0.8 }}
            className="mt-8 font-display text-lg font-medium text-violet-400 tracking-wide"
          >
            WELCOME TO MY WORLD.
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}