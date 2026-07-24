'use client';
export default function Badge({ children, variant = 'default', className = '' }: { children: React.ReactNode; variant?: 'default' | 'gem'; className?: string }) {
  const v = { default: 'bg-navy/8 text-navy border-navy/15 dark:bg-navy-light/60 dark:text-sky dark:border-sky/20', gem: 'bg-pearl/15 text-pearl border-pearl/25 dark:bg-pearl/20 dark:text-pearl-glow dark:border-pearl/30' };
  return <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full border ${v[variant]} ${className}`}>{children}</span>;
}
