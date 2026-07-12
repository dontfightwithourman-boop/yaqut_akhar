'use client';
import { motion } from 'framer-motion';
export default function YaqutIcon({ size = 24, animate = true, className = '' }: { size?: number; animate?: boolean; className?: string }) {
  return (
    <motion.div className={`inline-flex items-center justify-center ${className}`}
      animate={animate ? { filter: ['drop-shadow(0 0 6px rgba(193,89,89,0.4))', 'drop-shadow(0 0 12px rgba(193,89,89,0.6))', 'drop-shadow(0 0 6px rgba(193,89,89,0.4))'] } : undefined}
      transition={animate ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : undefined}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#D47979"/><stop offset="50%" stopColor="#C15959"/><stop offset="100%" stopColor="#A04040"/></linearGradient>
        <linearGradient id="rs" x1="0%" y1="0%" x2="50%" y2="50%"><stop offset="0%" stopColor="#FDF0D5" stopOpacity="0.5"/><stop offset="100%" stopColor="#FDF0D5" stopOpacity="0"/></linearGradient></defs>
        <polygon points="12,2 22,9 18,22 6,22 2,9" fill="url(#rg)" stroke="#A04040" strokeWidth="0.5"/>
        <polygon points="12,2 22,9 12,14 2,9" fill="url(#rg)" opacity="0.9"/>
        <polygon points="12,2 17,6 12,14 7,6" fill="url(#rs)"/>
      </svg>
    </motion.div>
  );
}
