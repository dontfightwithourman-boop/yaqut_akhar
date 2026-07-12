'use client';
import { forwardRef } from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; icon?: React.ReactNode; }
const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, icon, className = '', ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="block text-sm font-medium text-navy dark:text-beige-light">{label}</label>}
    <div className="relative">
      {icon && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sky">{icon}</div>}
      <input ref={ref} className={`w-full px-4 py-3 rounded-xl bg-white/80 border border-navy/15 text-navy placeholder-navy/30 focus:outline-none focus:ring-2 focus:ring-ruby/50 focus:border-ruby/50 transition-all duration-200 dark:bg-navy-light/40 dark:border-beige/15 dark:text-cream dark:placeholder-sky/40 ${icon ? 'pr-10' : ''} ${error ? 'border-ruby/50' : ''} ${className}`} dir="auto" {...props} />
    </div>
    {error && <p className="text-sm text-ruby-glow">{error}</p>}
  </div>
));
Input.displayName = 'Input';
export default Input;
