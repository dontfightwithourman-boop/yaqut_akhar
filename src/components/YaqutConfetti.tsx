'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
const COLORS = ['#C9B896', '#D4C5A8', '#C79B69', '#D4B08A', '#669BBC', '#FDF0D5'];
export default function YaqutConfetti({ trigger, onComplete }: { trigger: boolean; onComplete?: () => void }) {
  const [p, setP] = useState<{ id: number; x: number; y: number; r: number; s: number; c: string; d: number }[]>([]);
  useEffect(() => {
    if (trigger) {
      const np = Array.from({ length: 30 }, (_, i) => ({ id: i, x: (Math.random() - 0.5) * 400, y: -(Math.random() * 300 + 100), r: Math.random() * 720 - 360, s: Math.random() * 0.5 + 0.5, c: COLORS[Math.floor(Math.random() * COLORS.length)], d: Math.random() * 0.3 }));
      setP(np);
      const t = setTimeout(() => { setP([]); onComplete?.(); }, 2000);
      return () => clearTimeout(t);
    }
  }, [trigger, onComplete]);
  return <AnimatePresence>{p.map((q) => <motion.div key={q.id} initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }} animate={{ x: q.x, y: q.y, opacity: 0, scale: q.s, rotate: q.r }} exit={{ opacity: 0 }} transition={{ duration: 1.5, delay: q.d, ease: 'easeOut' }} className="absolute pointer-events-none z-50" style={{ left: '50%', top: '50%' }}><svg width="12" height="14" viewBox="0 0 24 24" fill={q.c}><polygon points="12,2 22,9 18,22 6,22 2,9" /></svg></motion.div>)}</AnimatePresence>;
}
