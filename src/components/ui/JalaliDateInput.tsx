'use client';
import { useState, useEffect } from 'react';
import { toPersianNumber } from '@/lib/helpers';

interface JalaliDateInputProps {
  label: string;
  value: string; // stored as Gregorian YYYY-MM-DD
  onChange: (gregorianDate: string) => void;
  className?: string;
}

// Jalali to Gregorian conversion
function jalaliToGregorian(jy: number, jm: number, jd: number): [number, number, number] {
  const leap = [14, 28, 48, 68, 88, 108, 129, 149, 169, 189, 210, 230, 247, 267, 288, 307, 328, 348, 364, 383, 403, 423, 443, 464, 484, 493, 502, 508, 513, 538, 568, 602, 618, 625, 630, 635, 698, 718, 748, 768, 789, 809, 830, 847, 867, 887, 908, 928, 948, 964, 983, 1003, 1023, 1043, 1064, 1084, 1104, 1124, 1144, 1164, 1184, 1203, 1215, 1223, 1238, 1258, 1278, 1298, 1318, 1338, 1358, 1378, 1398, 1418, 1438, 1458, 1478, 1498, 1518, 1538, 1558, 1578, 1598, 1618, 1638, 1658, 1678, 1698, 1718, 1738, 1758, 1778, 1798, 1818, 1838, 1858, 1878, 1898, 1918, 1938, 1958, 1978, 1998, 2018, 2038, 2058, 2078];
  const regIdx = leap.findIndex(b => b > jy);
  if (regIdx === -1) return [2079, 6, 21];
  let gy = jy + 621;
  const leapYear = regIdx > 0 && (leap[regIdx] - leap[regIdx - 1]) > 365;
  const marchDayOfYear = leapYear ? 80 : 79;
  const dayOfYear = 31 * (jm - 1) + jd + (jm > 6 ? 5 : 0) + (jm > 6 && leapYear ? 1 : 0);
  if (dayOfYear > marchDayOfYear) {
    gy += Math.floor((dayOfYear - 1 - marchDayOfYear) / 365.24219) + 1;
    const gDayOfYear = dayOfYear - 1 - Math.floor((gy - jy - 1) * 365.24219) - marchDayOfYear + 1;
    const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (gy % 4 === 0 && (gy % 100 !== 0 || gy % 400 === 0)) months[1] = 29;
    let month = 0; let remaining = gDayOfYear;
    while (month < 12 && remaining > months[month]) { remaining -= months[month]; month++; }
    return [gy, month + 1, remaining];
  } else {
    gy -= 1;
    const prevDayOfYear = Math.floor((gy - jy) * 365.24219) + dayOfYear + marchDayOfYear;
    const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (gy % 4 === 0 && (gy % 100 !== 0 || gy % 400 === 0)) months[1] = 29;
    let month = 0; let remaining = prevDayOfYear;
    while (month < 12 && remaining > months[month]) { remaining -= months[month]; month++; }
    return [gy, month + 1, remaining];
  }
}

function toGregorianDate(jy: number, jm: number, jd: number): string {
  const [gy, gm, gd] = jalaliToGregorian(jy, jm, jd);
  return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`;
}

function getTodayJalaliString(): string {
  const now = new Date();
  const [jy, jm, jd] = jalaliToGregorian(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return `${jy}/${jm}/${jd}`;
}

export default function JalaliDateInput({ label, value, onChange }: JalaliDateInputProps) {
  const [jalaliStr, setJalaliStr] = useState('');

  // Convert Gregorian to Jalali for display
  useEffect(() => {
    if (value) {
      try {
        const d = new Date(value);
        if (!isNaN(d.getTime())) {
          const gy = d.getFullYear(), gm = d.getMonth() + 1, gd = d.getDate();
          // Simple Gregorian to Jalali
          const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
          let gy2 = (gy > 1600) ? 1600 : 1576; let jump = gy - gy2;
          let jump2 = Math.floor(jump / 4) - Math.floor((jump - 1) / 4);
          let jump3 = Math.floor(jump / 100) - Math.floor((jump - 1) / 100);
          let jump4 = Math.floor(jump / 400) - Math.floor((jump - 1) / 400);
          let totalDays = 365 * jump + Math.min(1, jump) + jump2 - jump3 + jump4;
          let dayOfYear = g_d_m[gm - 1] + gd;
          let jalaliDay = dayOfYear + totalDays;
          let jy = 979 + Math.floor(jalaliDay / 10531); jalaliDay %= 10531;
          jy += 33 * Math.floor(jalaliDay / 12053); jalaliDay %= 12053;
          jy += 4 * Math.floor(jalaliDay / 1461); jalaliDay %= 1461;
          jy += Math.floor((jalaliDay - 1) / 365); jalaliDay = (jalaliDay - 1) % 365 + 1;
          let jm: number, jd: number;
          if (jalaliDay <= 186) { jm = 1 + Math.floor((jalaliDay - 1) / 31); jd = 1 + ((jalaliDay - 1) % 31); }
          else { jm = 7 + Math.floor((jalaliDay - 187) / 30); jd = 1 + ((jalaliDay - 187) % 30); }
          setJalaliStr(`${jy}/${jm}/${jd}`);
        }
      } catch { setJalaliStr(''); }
    } else { setJalaliStr(''); }
  }, [value]);

  const handleChange = (input: string) => {
    setJalaliStr(input);
    // Parse Jalali input like "1404/5/15" or "1404-5-15"
    const cleaned = input.replace(/[/\-\s]/g, '/');
    const parts = cleaned.split('/').map(Number);
    if (parts.length === 3 && parts.every(p => !isNaN(p) && p > 0)) {
      const [jy, jm, jd] = parts;
      if (jm >= 1 && jm <= 12 && jd >= 1 && jd <= (jm <= 6 ? 31 : 30)) {
        const gregorian = toGregorianDate(jy, jm, jd);
        onChange(gregorian);
      }
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-navy dark:text-beige-light">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={jalaliStr}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="۱۴۰۴/۵/۱۵"
          dir="ltr"
          className="w-full px-4 py-3 rounded-xl bg-white/80 border border-navy/15 text-navy placeholder-navy/30 focus:outline-none focus:ring-2 focus:ring-ruby/50 focus:border-ruby/50 transition-all duration-200 dark:bg-navy-light/40 dark:border-beige/15 dark:text-cream dark:placeholder-sky/40"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-navy/30 dark:text-sky/40">شمسی</div>
      </div>
    </div>
  );
}
