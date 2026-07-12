'use client';
import { motion } from 'framer-motion';
export default function RankBadge({ rank, size = 'md' }: { rank: number; size?: 'sm' | 'md' | 'lg' }) {
  const s = { sm: 'w-8 h-8 text-xs', md: 'w-12 h-12 text-sm', lg: 'w-16 h-16 text-base' };
  const is = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };
  if (rank === 1) return <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`${s[size]} rounded-full bg-gradient-to-br from-beige-light to-beige flex items-center justify-center shadow-lg shadow-beige/30`}><span className={`${is[size]} font-black text-navy-dark`}>۱</span></motion.div>;
  if (rank === 2) return <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`${s[size]} rounded-full bg-gradient-to-br from-sky-light to-sky flex items-center justify-center shadow-lg shadow-sky/30`}><span className={`${is[size]} font-black text-navy-dark`}>۲</span></motion.div>;
  if (rank === 3) return <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`${s[size]} rounded-full bg-gradient-to-br from-ruby-glow to-ruby flex items-center justify-center shadow-lg shadow-ruby/30`}><span className={`${is[size]} font-black text-cream`}>۳</span></motion.div>;
  return <div className={`${s[size]} rounded-full bg-navy/5 border border-navy/10 flex items-center justify-center dark:bg-navy-light/50 dark:border-sky/20`}><span className="font-bold text-navy/40 dark:text-sky">{rank}</span></div>;
}
