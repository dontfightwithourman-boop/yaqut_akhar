'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
export default function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title?: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {isOpen && <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-navy/40 backdrop-blur-sm dark:bg-navy-dark/70" onClick={onClose} />
        <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }}
          className="relative w-full sm:max-w-lg bg-white/95 sm:bg-white/90 backdrop-blur-xl sm:rounded-2xl rounded-t-2xl border-t sm:border border-navy/10 shadow-2xl p-4 sm:p-6 dark:bg-navy/95 dark:border-beige/15 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            {title && <h3 className="text-base sm:text-lg font-bold text-navy dark:text-cream">{title}</h3>}
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-navy/5 text-sky hover:text-navy transition-colors dark:hover:bg-navy-light/40 dark:hover:text-cream"><X className="w-5 h-5" /></button>
          </div>
          {children}
        </motion.div>
      </div>}
    </AnimatePresence>
  );
}
