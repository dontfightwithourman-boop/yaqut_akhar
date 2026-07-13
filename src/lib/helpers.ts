export function toPersianNumber(num: number | string): string {
  const d = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  return String(num).replace(/\d/g, (c) => d[parseInt(c)]);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch { return dateStr; }
}

// Gregorian to Jalali (Solar Hijri) conversion
export function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let gy2 = (gy > 1600) ? 1600 : 1576;
  let jump = gy - gy2;
  let jump2 = Math.floor(jump / 4) - Math.floor((jump - 1) / 4);
  let jump3 = Math.floor(jump / 100) - Math.floor((jump - 1) / 100);
  let jump4 = Math.floor(jump / 400) - Math.floor((jump - 1) / 400);
  let totalDays = 365 * jump + Math.min(1, jump) + jump2 - jump3 + jump4;
  let dayOfYear = g_d_m[gm - 1] + gd;
  let jalaliDay = dayOfYear + totalDays;
  let jy = 979 + Math.floor(jalaliDay / 10531);
  jalaliDay %= 10531;
  jy += 33 * Math.floor(jalaliDay / 12053);
  jalaliDay %= 12053;
  jy += 4 * Math.floor(jalaliDay / 1461);
  jalaliDay %= 1461;
  jy += Math.floor((jalaliDay - 1) / 365);
  jalaliDay = (jalaliDay - 1) % 365 + 1;
  let jm: number, jd: number;
  if (jalaliDay <= 186) {
    jm = 1 + Math.floor((jalaliDay - 1) / 31);
    jd = 1 + ((jalaliDay - 1) % 31);
  } else {
    jm = 7 + Math.floor((jalaliDay - 187) / 30);
    jd = 1 + ((jalaliDay - 187) % 30);
  }
  return [jy, jm, jd];
}

export function toJalaliDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const [jy, jm, jd] = gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
    const months = ['ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن', 'ژوئیه', 'اوت', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر'];
    const jMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    return `${toPersianNumber(jd)} ${jMonths[jm - 1]} ${toPersianNumber(jy)}`;
  } catch { return dateStr; }
}

export function toJalaliDateTime(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const [jy, jm, jd] = gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
    const jMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    const hours = toPersianNumber(date.getHours().toString().padStart(2, '0'));
    const minutes = toPersianNumber(date.getMinutes().toString().padStart(2, '0'));
    return `${toPersianNumber(jd)} ${jMonths[jm - 1]} ${toPersianNumber(jy)} - ${hours}:${minutes}`;
  } catch { return dateStr; }
}

export function getTodayJalali(): string {
  const now = new Date();
  const [jy, jm, jd] = gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return `${jy}-${String(jm).padStart(2, '0')}-${String(jd).padStart(2, '0')}`;
}

export function toGregorian(dateStr: string): string {
  // Convert Jalali date string (YYYY-MM-DD) to Gregorian
  if (!dateStr || !dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
  const [jy, jm, jd] = dateStr.split('-').map(Number);
  const [gy, gm, gd] = jalaliToGregorian(jy, jm, jd);
  return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`;
}

function jalaliToGregorian(jy: number, jm: number, jd: number): [number, number, number] {
  let gy: number;
  let march: number;

  // Determine if the year is leap
  const breaks = [-61, 9, 38, 199, 426, 682, 748, 1280, 1755, 2336, 2840, 3335, 3905, 4734, 5660, 6619, 7633, 8202, 9075, 10170, 11021, 11534, 12003, 12010, 12013, 12013];
  const leap = [14, 28, 48, 68, 88, 108, 129, 149, 169, 189, 210, 230, 247, 267, 288, 307, 328, 348, 364, 383, 403, 423, 443, 464, 484, 493, 502, 508, 513, 538, 568, 602, 618, 625, 630, 635, 698, 718, 748, 768, 789, 809, 830, 847, 867, 887, 908, 928, 948, 964, 983, 1003, 1023, 1043, 1064, 1084, 1104, 1124, 1144, 1164, 1184, 1203, 1215, 1223, 1238, 1258, 1278, 1298, 1318, 1338, 1358, 1378, 1398, 1418, 1438, 1458, 1478, 1498, 1518, 1538, 1558, 1578, 1598, 1618, 1638, 1658, 1678, 1698, 1718, 1738, 1758, 1778, 1798, 1818, 1838, 1858, 1878, 1898, 1918, 1938, 1958, 1978, 1998, 2018, 2038, 2058, 2078];

  const regIdx = breaks.findIndex(b => b > jy);
  if (regIdx === -1) return [2079, 6, 21];

  gy = jy + 621;
  const leapIdx = leap.findIndex(l => l > jy);
  const leapYear = leapIdx > 0 && (leap[leapIdx] - leap[leapIdx - 1]) > 365;

  const marchDayOfYear = leapYear ? 80 : 79;
  const dayOfYear = 31 * (jm - 1) + jd + (jm > 6 ? 5 : 0) + (jm > 6 && leapYear ? 1 : 0);

  if (dayOfYear > marchDayOfYear) {
    gy += Math.floor((dayOfYear - 1 - marchDayOfYear) / 365.24219) + 1;
    const gDayOfYear = dayOfYear - 1 - Math.floor((gy - jy - 1) * 365.24219) - marchDayOfYear + 1;
    const [gMonth, gDay] = dayOfYearToDate(gy, gDayOfYear);
    return [gy, gMonth, gDay];
  } else {
    gy -= 1;
    const prevDayOfYear = Math.floor((gy - jy) * 365.24219) + dayOfYear + marchDayOfYear;
    const [gMonth, gDay] = dayOfYearToDate(gy, prevDayOfYear);
    return [gy, gMonth, gDay];
  }
}

function dayOfYearToDate(year: number, dayOfYear: number): [number, number] {
  const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) months[1] = 29;
  let month = 0;
  while (month < 12 && dayOfYear > months[month]) {
    dayOfYear -= months[month];
    month++;
  }
  return [month + 1, dayOfYear];
}
