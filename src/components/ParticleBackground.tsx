'use client';
import { motion } from 'framer-motion';
export default function ParticleBackground({ count = 20 }: { count?: number }) {
  return <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">{Array.from({ length: count }).map((_, i) => (
    <motion.div key={i} className="absolute rounded-full bg-navy/5 dark:bg-navy/5"
      initial={{ x: Math.random() * 1920, y: Math.random() * 1080, width: Math.random() * 4 + 2, height: Math.random() * 4 + 2 }}
      animate={{ y: [null, Math.random() * -200 - 50], opacity: [0, 0.3, 0] }}
      transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, delay: Math.random() * 5, ease: 'linear' }} />
  ))}</div>;
}
