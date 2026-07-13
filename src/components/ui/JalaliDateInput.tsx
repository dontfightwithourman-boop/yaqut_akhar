'use client';
import { toPersianNumber } from '@/lib/helpers';

export function toJalaliDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const gy = d.getFullYear(), gm = d.getMonth() + 1, gd = d.getDate();
    const g_d_m = [0,31,59,90,120,151,181,212,243,273,304,334];
    let gy2 = (gy > 1600) ? 1600 : 1576; let jump = gy - gy2;
    let j2 = Math.floor(jump / 4) - Math.floor((jump - 1) / 4);
    let j3 = Math.floor(jump / 100) - Math.floor((jump - 1) / 100);
    let j4 = Math.floor(jump / 400) - Math.floor((jump - 1) / 400);
    let totalDays = 365 * jump + Math.min(1, jump) + j2 - j3 + j4;
    let dayOfYear = g_d_m[gm - 1] + gd;
    let jalaliDay = dayOfYear + totalDays;
    let jy = 979 + Math.floor(jalaliDay / 10531); jalaliDay %= 10531;
    jy += 33 * Math.floor(jalaliDay / 12053); jalaliDay %= 12053;
    jy += 4 * Math.floor(jalaliDay / 1461); jalaliDay %= 1461;
    jy += Math.floor((jalaliDay - 1) / 365); jalaliDay = (jalaliDay - 1) % 365 + 1;
    let jm: number, jd: number;
    if (jalaliDay <= 186) { jm = 1 + Math.floor((jalaliDay - 1) / 31); jd = 1 + ((jalaliDay - 1) % 31); }
    else { jm = 7 + Math.floor((jalaliDay - 187) / 30); jd = 1 + ((jalaliDay - 1 - 187) % 30 + 1); }
    const months = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
    return `${toPersianNumber(jd)} ${months[jm - 1]} ${toPersianNumber(jy)}`;
  } catch { return dateStr; }
}

interface JalaliDateInputProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
}

export default function JalaliDateInput({ label, value, onChange }: JalaliDateInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-navy dark:text-beige-light">{label}</label>
      <input type="date" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-white/80 border border-navy/15 text-navy focus:outline-none focus:ring-2 focus:ring-ruby/50 focus:border-ruby/50 transition-all duration-200 dark:bg-navy-light/40 dark:border-beige/15 dark:text-cream" />
    </div>
  );
}
