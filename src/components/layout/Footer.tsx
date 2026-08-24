import YaqutIcon from '@/components/YaqutIcon';
export default function Footer() {
  return <footer className="relative border-t border-sky/15 bg-white/70 backdrop-blur-sm dark:border-beige/10 dark:bg-navy-dark/95">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
          <img src="/l-sampad.png" alt="سمپاد" className="h-10 sm:h-12 w-auto object-contain dark:brightness-0 dark:invert" />
          <img src="/l-logo.png" alt="آرم سمینار" className="h-14 sm:h-12 w-auto object-contain" />
          <img src="/l-helli.png" alt="علامه حلی" className="h-10 sm:h-12 w-auto object-contain" />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
          <div className="flex items-center gap-2"><YaqutIcon size={20} animate={false} /><span className="text-sm text-navy/60 dark:text-cream/70">دبیرستان دوره اول علامه حلی تهران</span></div>
          <div className="text-sm text-sky dark:text-sky-light">چهلمین سمینار علوم و فنون — شهریور ماه ۱۴۰۵</div>
        </div>
      </div>
    </div>
  </footer>;
}
