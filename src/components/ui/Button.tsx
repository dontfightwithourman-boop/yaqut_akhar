'use client';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps { variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; size?: 'sm' | 'md' | 'lg'; loading?: boolean; disabled?: boolean; children: React.ReactNode; className?: string; type?: 'button' | 'submit' | 'reset'; onClick?: () => void; }

const v = {
  primary: 'bg-ruby hover:bg-ruby-glow text-cream shadow-lg shadow-ruby/25',
  secondary: 'bg-white/60 hover:bg-white/80 text-navy border border-navy/15 dark:bg-navy-light/60 dark:hover:bg-navy-light dark:text-cream dark:border-beige/20',
  ghost: 'bg-transparent hover:bg-navy/5 text-navy dark:hover:bg-navy-light/40 dark:text-cream',
  danger: 'bg-red-700 hover:bg-red-600 text-cream',
};

export default function Button({ variant = 'primary', size = 'md', loading = false, disabled = false, children, className = '', type = 'button', onClick }: ButtonProps) {
  return (
    <motion.button whileHover={{ scale: disabled || loading ? 1 : 1.02 }} whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`relative rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${v[variant]} ${size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'lg' ? 'px-8 py-3.5 text-base' : 'px-5 py-2.5 text-sm'} ${className}`}
      disabled={disabled || loading} type={type} onClick={onClick}>
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}{children}
    </motion.button>
  );
}
