export function toPersianNumber(num: number | string): string {
  const d = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  return String(num).replace(/\d/g, (c) => d[parseInt(c)]);
}
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
}
