'use client';
import { motion } from 'framer-motion';
import { Users, Edit, Trash2 } from 'lucide-react';
import YaqutIcon from './YaqutIcon';
import SparkleEffect from './SparkleEffect';
import { toPersianNumber } from '@/lib/helpers';
import type { Project } from '@/lib/types';

export default function ProjectCard({ project, onEdit, onDelete, selectable = false, selected = false, onSelect }: { project: Project; onEdit?: (p: Project) => void; onDelete?: (id: string) => void; selectable?: boolean; selected?: boolean; onSelect?: (id: string) => void }) {
  return <motion.div whileHover={{ scale: 1.01, y: -1 }} className={`relative rounded-2xl p-3 sm:p-5 bg-white/60 backdrop-blur-sm border transition-all duration-300 dark:bg-navy/60 ${selected ? 'border-ruby/50 bg-ruby/8 shadow-lg shadow-ruby/15 dark:bg-ruby/10 dark:shadow-ruby/20' : 'border-navy/8 hover:border-navy/15 dark:border-beige/10 dark:hover:border-beige/20'}`}>
    {selected && <SparkleEffect count={6} />}
    <div className="flex items-start justify-between mb-2 sm:mb-3">
      <div className="flex-1 min-w-0"><h3 className="font-bold text-navy text-sm sm:text-base dark:text-cream truncate">{project.name}</h3></div>
      {selectable && <button onClick={() => onSelect?.(project.id)} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${selected ? 'bg-ruby border-ruby text-cream' : 'border-navy/20 hover:border-ruby dark:border-beige/30 dark:hover:border-ruby'}`}>{selected && <span className="text-xs">✓</span>}</button>}
    </div>
    <div className="flex items-center gap-1 text-xs text-navy/50 dark:text-beige-light mb-2 sm:mb-3"><Users className="w-3 h-3" /><span>{project.members?.length || 0} عضو</span></div>
    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-navy/3 dark:bg-navy-light/30"><YaqutIcon size={24} animate={project.yaqut_count > 0} /><div><div className="text-2xl sm:text-3xl font-black text-navy dark:text-cream">{toPersianNumber(project.yaqut_count)}</div><div className="text-xs text-sky">مروارید</div></div></div>
    {(onEdit || onDelete) && <div className="flex items-center gap-2 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-navy/8 dark:border-beige/10">
      {onEdit && <button onClick={() => onEdit(project)} className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs text-navy/60 hover:text-navy hover:bg-navy/5 transition-all dark:text-beige-light dark:hover:text-cream dark:hover:bg-navy-light/40"><Edit className="w-3 h-3" />ویرایش</button>}
      {onDelete && <button onClick={() => onDelete(project.id)} className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs text-ruby hover:text-ruby-dark hover:bg-ruby/5 transition-all dark:text-ruby-glow dark:hover:text-ruby dark:hover:bg-ruby/10"><Trash2 className="w-3 h-3" />حذف</button>}
    </div>}
  </motion.div>;
}
