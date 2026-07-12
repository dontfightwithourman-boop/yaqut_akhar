'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, FolderPlus, Gem, BarChart3 } from 'lucide-react';
const links = [
  { href: '/admin', label: 'داشبورد', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'پروژه‌ها', icon: FolderPlus },
  { href: '/admin/award', label: 'اعطای یاقوت', icon: Gem },
  { href: '/leaderboard', label: 'رتبه‌بندی', icon: BarChart3 },
];
export default function Sidebar() {
  const pathname = usePathname();
  return <aside className="w-64 min-h-screen bg-white/50 border-l border-navy/10 p-4 dark:bg-navy-dark/50 dark:border-beige/10">
    <div className="space-y-2">{links.map((l) => {
      const active = pathname === l.href;
      const I = l.icon;
      return <Link key={l.href} href={l.href} className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active ? 'bg-ruby/15 text-ruby dark:bg-ruby/20 dark:text-ruby-glow' : 'text-navy/60 hover:text-navy hover:bg-navy/5 dark:text-beige-light dark:hover:text-cream dark:hover:bg-navy-light/30'}`}>
        {active && <motion.div layoutId="activeTab" className="absolute inset-0 bg-ruby/10 rounded-xl border border-ruby/15 dark:border-ruby/20" transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} />}
        <I className="w-5 h-5 relative z-10" /><span className="font-medium relative z-10">{l.label}</span>
      </Link>;
    })}</div>
  </aside>;
}
