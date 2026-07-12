'use client';
export default function Badge({ children, variant = 'default', className = '' }: { children: React.ReactNode; variant?: 'default' | 'gem'; className?: string }) {
  const v = { default: 'bg-navy/8 text-navy border-navy/15 dark:bg-navy-light/60 dark:text-sky dark:border-sky/20', gem: 'bg-ruby/15 text-ruby border-ruby/25 dark:bg-ruby/20 dark:text-ruby-glow dark:border-ruby/30' };
  return <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full border ${v[variant]} ${className}`}>{children}</span>;
}
