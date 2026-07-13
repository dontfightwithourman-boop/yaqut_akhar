'use client';

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
