'use client';
import { motion } from 'framer-motion';
export default function SparkleEffect({ count = 5, className = '' }: { count?: number; className?: string }) {
  return <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>{Array.from({ length: count }).map((_, i) => (
    <motion.div key={i} className="absolute w-1 h-1 rounded-full" style={{ background: i % 2 === 0 ? '#C79B69' : '#C9B896' }}
      initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%', opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
      transition={{ duration: 2, delay: Math.random() * 3, repeat: Infinity, repeatDelay: Math.random() * 4 + 2 }} />
  ))}</div>;
}
