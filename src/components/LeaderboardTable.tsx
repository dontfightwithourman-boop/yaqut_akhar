'use client';
import { motion } from 'framer-motion';
import { Users, Eye } from 'lucide-react';
import RankBadge from './RankBadge';
import YaqutIcon from './YaqutIcon';
import { toPersianNumber } from '@/lib/helpers';
import type { LeaderboardEntry } from '@/lib/types';
import Link from 'next/link';

export default function LeaderboardTable({ entries, maxYaqut }: { entries: LeaderboardEntry[]; maxYaqut: number }) {
  return <div className="space-y-3">{entries.map((e, i) => (
    <Link key={e.id} href={`/project/${e.id}`}>
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
        className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-navy/8 hover:bg-white/80 hover:shadow-lg hover:shadow-navy/5 transition-all duration-300 dark:bg-navy/60 dark:border-beige/10 dark:hover:bg-navy-light/30 dark:hover:shadow-ruby/5 cursor-pointer ${e.rank === 1 ? 'bg-gradient-to-r from-beige/8 to-transparent border-beige/15 dark:from-beige/10 dark:border-beige/20' : ''} ${e.rank === 2 ? 'bg-gradient-to-r from-sky/8 to-transparent border-sky/15 dark:from-sky/10 dark:border-sky/20' : ''} ${e.rank === 3 ? 'bg-gradient-to-r from-ruby/5 to-transparent border-ruby/10 dark:from-ruby/10 dark:border-ruby/20' : ''}`}>
        <RankBadge rank={e.rank} size="md" />
        {e.logo ? (
          <img src={e.logo} alt={e.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover border border-navy/10 dark:border-beige/20 shrink-0" />
        ) : (
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-ruby/20 to-beige/20 flex items-center justify-center border border-navy/10 dark:border-beige/20 shrink-0">
            <YaqutIcon size={20} animate={false} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1"><h3 className="font-bold text-navy dark:text-cream truncate text-sm sm:text-base">{e.name}</h3></div>
          <div className="flex items-center gap-1 text-xs text-navy/50 dark:text-beige-light"><Users className="w-3 h-3 shrink-0" /><span className="truncate">{e.members.join('، ')}</span></div>
        </div>
        <div className="flex items-center gap-2"><YaqutIcon size={18} animate={e.rank <= 3} /><div className="text-right"><div className="text-xl sm:text-2xl font-black text-navy dark:text-cream">{toPersianNumber(e.yaqut_count)}</div><div className="text-xs text-sky">مروارید</div></div></div>
        <div className="hidden sm:flex items-center gap-1 text-xs text-sky/60"><Eye className="w-3 h-3" /></div>
        <div className="hidden sm:block w-20 lg:w-24"><div className="h-1.5 bg-navy/8 rounded-full overflow-hidden dark:bg-navy-light/50"><motion.div initial={{ width: 0 }} animate={{ width: `${maxYaqut > 0 ? (e.yaqut_count / maxYaqut) * 100 : 0}%` }} transition={{ duration: 1, delay: i * 0.05 }} className={`h-full rounded-full ${e.rank === 1 ? 'bg-gradient-to-r from-beige-light to-beige' : e.rank === 2 ? 'bg-gradient-to-r from-sky-light to-sky' : e.rank === 3 ? 'bg-gradient-to-r from-ruby-glow to-ruby' : 'bg-gradient-to-r from-ruby to-ruby-glow'}`} /></div></div>
      </motion.div>
    </Link>
  ))}</div>;
}
