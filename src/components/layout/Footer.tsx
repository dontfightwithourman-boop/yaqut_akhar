import YaqutIcon from '@/components/YaqutIcon';
export default function Footer() {
  return <footer className="relative border-t border-navy/10 bg-navy/95 dark:border-beige/10 dark:bg-navy-dark/95">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2"><YaqutIcon size={20} animate={false} /><span className="text-sm text-cream/70 dark:text-beige-light">مدرسه راهنمایی علامه حلی 1 تهران</span></div>
        <div className="text-sm text-sky-light">چهلمین سمینار علوم و فنون-۱۴۰۵</div>
      </div>
    </div>
  </footer>;
}
