'use client';

import { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';

const SEMINAR_DATE = new Date('2026-09-23T15:00:00+03:30').getTime();

export default function CountdownBar() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    finished: false,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const difference = SEMINAR_DATE - Date.now();

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          finished: true,
        });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        ),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        finished: false,
      });
    };

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed top-16 left-0 right-0 z-40">
      <div className="border-b border-sky/20 bg-white/95 shadow-sm backdrop-blur-xl dark:border-beige/10 dark:bg-navy/95">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex min-h-[96px] items-center justify-center">
            {timeLeft.finished ? (
              <div
                dir="rtl"
                className="flex items-center justify-center gap-2 py-3 text-lg font-black text-pearl sm:gap-3 sm:text-2xl"
              >
                <Timer className="h-6 w-6 sm:h-7 sm:w-7" />
                <span>سمینار آغاز شده است</span>
              </div>
            ) : (
              <div
                dir="ltr"
                className="flex w-full max-w-full items-center justify-center gap-2 py-3 sm:gap-6"
              >
                {/* متن سمت چپ */}
                <div
                  dir="rtl"
                  className="flex min-w-0 shrink items-center gap-1 text-xs font-black text-navy dark:text-cream sm:gap-2 sm:text-xl"
                >
                  <Timer className="h-4 w-4 shrink-0 text-pearl sm:h-6 sm:w-6" />
                  <span className="whitespace-nowrap">
                    مانده تا افتتاحیه...
                  </span>
                </div>

                {/* جداکننده */}
                <div className="hidden h-10 w-px shrink-0 bg-navy/10 dark:bg-beige/10 sm:block" />

                {/* شمارنده سمت راست */}
                <div
                  dir="rtl"
                  className="flex min-w-0 shrink-0 items-center gap-0.5 sm:gap-2.5"
                >
                  {/* روز */}
                  <div className="flex w-[48px] flex-col items-center rounded-xl bg-pearl/10 px-1 py-1.5 sm:w-[82px] sm:rounded-2xl sm:px-4 sm:py-2.5">
                    <span
                      dir="ltr"
                      className="text-base font-black leading-none tabular-nums text-pearl sm:text-3xl"
                    >
                      {String(timeLeft.days).padStart(2, '0')}
                    </span>
                    <span
                      dir="rtl"
                      className="mt-1 text-[8px] font-bold text-navy/50 dark:text-beige-light/60 sm:text-xs"
                    >
                      روز
                    </span>
                  </div>

                  <span className="text-sm font-black text-navy/30 dark:text-beige/30 sm:px-0.5 sm:text-2xl">
                    :
                  </span>

                  {/* ساعت */}
                  <div className="flex w-[48px] flex-col items-center rounded-xl bg-pearl/10 px-1 py-1.5 sm:w-[82px] sm:rounded-2xl sm:px-4 sm:py-2.5">
                    <span
                      dir="ltr"
                      className="text-base font-black leading-none tabular-nums text-pearl sm:text-3xl"
                    >
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span
                      dir="rtl"
                      className="mt-1 text-[8px] font-bold text-navy/50 dark:text-beige-light/60 sm:text-xs"
                    >
                      ساعت
                    </span>
                  </div>

                  <span className="text-sm font-black text-navy/30 dark:text-beige/30 sm:px-0.5 sm:text-2xl">
                    :
                  </span>

                  {/* دقیقه */}
                  <div className="flex w-[48px] flex-col items-center rounded-xl bg-pearl/10 px-1 py-1.5 sm:w-[82px] sm:rounded-2xl sm:px-4 sm:py-2.5">
                    <span
                      dir="ltr"
                      className="text-base font-black leading-none tabular-nums text-pearl sm:text-3xl"
                    >
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span
                      dir="rtl"
                      className="mt-1 text-[8px] font-bold text-navy/50 dark:text-beige-light/60 sm:text-xs"
                    >
                      دقیقه
                    </span>
                  </div>

                  <span className="text-sm font-black text-navy/30 dark:text-beige/30 sm:px-0.5 sm:text-2xl">
                    :
                  </span>

                  {/* ثانیه */}
                  <div className="flex w-[48px] flex-col items-center rounded-xl bg-pearl/10 px-1 py-1.5 sm:w-[82px] sm:rounded-2xl sm:px-4 sm:py-2.5">
                    <span
                      dir="ltr"
                      className="text-base font-black leading-none tabular-nums text-pearl sm:text-3xl"
                    >
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span
                      dir="rtl"
                      className="mt-1 text-[8px] font-bold text-navy/50 dark:text-beige-light/60 sm:text-xs"
                    >
                      ثانیه
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
