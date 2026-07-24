'use client';
import { motion } from 'framer-motion';
export default function Card({ children, className = '', glow = false }: { children: React.ReactNode; className?: string; hover?: boolean; glow?: boolean }) {
  return <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
    className={`relative rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm border border-sky/20 shadow-lg shadow-sky/5 dark:bg-navy/60 dark:border-beige/10 dark:shadow-black/30 ${glow ? 'shadow-xl shadow-pearl/15' : ''} ${className}`}>{children}</motion.div>;
}
