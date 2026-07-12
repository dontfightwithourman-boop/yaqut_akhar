'use client';
import { motion } from 'framer-motion';
export default function Card({ children, className = '', glow = false }: { children: React.ReactNode; className?: string; hover?: boolean; glow?: boolean }) {
  return <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
    className={`relative rounded-2xl overflow-hidden bg-white/70 backdrop-blur-sm border border-navy/10 shadow-lg shadow-black/5 dark:bg-navy/60 dark:border-beige/10 dark:shadow-black/30 ${glow ? 'shadow-xl shadow-ruby/10' : ''} ${className}`}>{children}</motion.div>;
}
