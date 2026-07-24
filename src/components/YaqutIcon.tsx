'use client';
import { motion } from 'framer-motion';

export default function YaqutIcon({ size = 24, animate = true, className = '' }: { size?: number; animate?: boolean; className?: string }) {
  return (
    <motion.div className={`inline-flex items-center justify-center ${className}`}
      animate={animate ? { filter: ['drop-shadow(0 0 6px rgba(201,184,150,0.4))', 'drop-shadow(0 0 12px rgba(201,184,150,0.6))', 'drop-shadow(0 0 6px rgba(201,184,150,0.4))'] } : undefined}
      transition={animate ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : undefined}>
      <img src="/morvarid.png" alt="مروارید" width={size} height={size} className="object-contain" style={{ width: size, height: size, background: 'transparent' }} />
    </motion.div>
  );
}
