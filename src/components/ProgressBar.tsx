'use client';
import { motion } from 'framer-motion';
export default function ProgressBar({ value, max, className = '' }: { value: number; max: number; className?: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return <div className={`w-full h-2 bg-navy/8 rounded-full overflow-hidden dark:bg-navy-light/50 ${className}`}><motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: 'easeOut' }} className="h-full bg-gradient-to-r from-ruby to-ruby-glow rounded-full" /></div>;
}
