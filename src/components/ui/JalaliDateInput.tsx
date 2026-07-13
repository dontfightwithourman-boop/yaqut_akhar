'use client';
import { useState, useEffect } from 'react';
import { toPersianNumber, toJalaliDate } from '@/lib/helpers';

const JALALI_MONTHS = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
const MONTH_MAP: Record<string, number> = { 'فروردین': 1, 'اردیبهشت': 2, 'خرداد': 3, 'تیر': 4, 'مرداد': 5, 'شهریور': 6, 'مهر': 7, 'آبان': 8, 'آذر': 9, 'دی': 10, 'بهمن': 11, 'اسفند': 12 };

function jalaliToGregorian(jy: number, jm: number, jd: number): [number, number, number] {
  const leap = [14,28,48,68,88,108,129,149,169,189,210,230,247,267,288,307,328,348,364,383,403,423,443,464,484,493,502,508,513,538,568,602,618,625,630,635,698,718,748,768,789,809,830,847,867,887,908,928,948,964,983,1003,1023,1043,1064,1084,1104,1124,1144,1164,1184,1203,1215,1223,1238,1258,1278,1298,1318,1338,1358,1378,1398,1418,1438,1458,1478,1498,1518,1538,1558,1578,1598,1618,1638,1658,1678,1698,1718,1738,1758,1778,1798,1818,1838,1858,1878,1898,1918,1938,1958,1978,1998,2018,2038,2058,2078];
  const regIdx = leap.findIndex(b => b > jy);
  if (regIdx === -1) return [2079, 6, 21];
  let gy = jy + 621;
  const leapYear = regIdx > 0 && (leap[regIdx] - leap[regIdx - 1]) > 365;
  const marchDay = leapYear ? 80 : 79;
  const dayOfYear = 31 * (jm - 1) + jd + (jm > 6 ? 5 : 0) + (jm > 6 && leapYear ? 1 : 0);
  if (dayOfYear > marchDay) {
    gy += Math.floor((dayOfYear - 1 - marchDay) / 365.24219) + 1;
    const gDay = dayOfYear - 1 - Math.floor((gy - jy - 1) * 365.24219) - marchDay + 1;
    const m = [31,28,31,30,31,30,31,31,30,31,30,31];
    if (gy % 4 === 0 && (gy % 100 !== 0 || gy % 400 === 0)) m[1] = 29;
    let mo = 0; let rem = gDay;
    while (mo < 12 && rem > m[mo]) { rem -= m[mo]; mo++; }
    return [gy, mo + 1, rem];
  } else {
    gy -= 1;
    const prev = Math.floor((gy - jy) * 365.24219) + dayOfYear + marchDay;
    const m = [31,28,31,30,31,30,31,31,30,31,30,31];
    if (gy % 4 === 0 && (gy % 100 !== 0 || gy % 400 === 0)) m[1] = 29;
    let mo = 0; let rem = prev;
    while (mo < 12 && rem > m[mo]) { rem -= m[mo]; mo++; }
    return [gy, mo + 1, rem];
  }
}

function parseJalaliInput(input: string): string | null {
  const cleaned = input.replace(/[/\-.\s]/g, '/').trim();
  const parts = cleaned.split('/');
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0]);
  if (isNaN(year) || year < 1000) return null;
  let month = 0;
  if (!isNaN(parseInt(parts[1]))) { month = parseInt(parts[1]); }
  else { month = MONTH_MAP[parts[1]] || 0; }
  if (month < 1 || month > 12) return null;
  const day = parseInt(parts[2]);
  if (isNaN(day) || day < 1 || day > (month <= 6 ? 31 : 30)) return null;
  const [gy, gm, gd] = jalaliToGregorian(year, month, day);
  return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`;
}

function getJalaliString(jalaliStr: string): string {
  if (!jalaliStr) return '';
  const parts = jalaliStr.split('/');
  if (parts.length !== 3) return jalaliStr;
  const monthNum = parseInt(parts[1]);
  if (monthNum >= 1 && monthNum <= 12) {
    return `${toPersianNumber(parts[0])}/${JALALI_MONTHS[monthNum - 1]}/${toPersianNumber(parts[2])}`;
  }
  return jalaliStr;
}

interface JalaliDateInputProps {
  label: string;
  value: string;
  onChange: (jalaliDate: string) => void;
}

export default function JalaliDateInput({ label, value, onChange }: JalaliDateInputProps) {
  const [jalaliStr, setJalaliStr] = useState('');

  useEffect(() => {
    if (value) {
      try {
        const d = new Date(value);
        if (!isNaN(d.getTime())) {
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
          setJalaliStr(`${jy}/${jm}/${jd}`);
        }
      } catch { setJalaliStr(''); }
    } else { setJalaliStr(''); }
  }, [value]);

  const handleChange = (input: string) => {
    setJalaliStr(input);
    const cleaned = input.replace(/[/\-.\s]/g, '/').trim();
    const parts = cleaned.split('/');
    if (parts.length === 3) {
      const year = parseInt(parts[0]);
      if (!isNaN(year) && year >= 1000) {
        let month = 0;
        const monthNames: Record<string, number> = { 'فروردین': 1, 'اردیبهشت': 2, 'خرداد': 3, 'تیر': 4, 'مرداد': 5, 'شهریور': 6, 'مهر': 7, 'آبان': 8, 'آذر': 9, 'دی': 10, 'بهمن': 11, 'اسفند': 12 };
        if (!isNaN(parseInt(parts[1]))) { month = parseInt(parts[1]); }
        else { month = monthNames[parts[1]] || 0; }
        const day = parseInt(parts[2]);
        if (month >= 1 && month <= 12 && !isNaN(day) && day >= 1 && day <= (month <= 6 ? 31 : 30)) {
          const [gy, gm, gd] = jalaliToGregorian(year, month, day);
          onChange(`${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`);
        }
      }
    }
  };

  const displayValue = getJalaliString(jalaliStr);

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-navy dark:text-beige-light">{label}</label>
      <div className="relative">
        <input type="text" value={displayValue} onChange={(e) => handleChange(e.target.value)} placeholder="۱۴۰۴/تیر/۱۵"
          className="w-full px-4 py-3 rounded-xl bg-white/80 border border-navy/15 text-navy placeholder-navy/30 focus:outline-none focus:ring-2 focus:ring-ruby/50 focus:border-ruby/50 transition-all duration-200 dark:bg-navy-light/40 dark:border-beige/15 dark:text-cream dark:placeholder-sky/40" />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-navy/30 dark:text-sky/40">شمسی</div>
      </div>
    </div>
  );
}
