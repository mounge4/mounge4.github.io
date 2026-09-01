import React, { useState, useEffect, useCallback } from 'react';
import { Quote, Sparkles, ChevronLeft, ChevronRight, BookOpen, Pause, Play, HeartHandshake } from 'lucide-react';
import { MissionQuoteItem } from '../types';

interface MissionBannerProps {
  quotes?: MissionQuoteItem[];
  quote?: string; // Fallback legacy string
}

export const MissionBanner: React.FC<MissionBannerProps> = ({ quotes = [], quote }) => {
  // Normalize items list
  const activeQuotes: MissionQuoteItem[] = React.useMemo(() => {
    if (quotes && quotes.length > 0) {
      const filtered = quotes.filter(q => q.active !== false);
      if (filtered.length > 0) {
        return filtered.sort((a, b) => (a.order || 0) - (b.order || 0));
      }
    }
    // Fallback if no array is provided
    return [
      {
        id: 'default-fallback',
        category: 'মূল অঙ্গীকার',
        quote: quote || 'এই প্রতিষ্ঠান মানবতার শিক্ষক, মানুষের মুক্তি ও শান্তির দূত, মানবসেবার আদর্শ, মহানবী মুহাম্মদ সা.-এর পদাঙ্ক অনুসরণ করে আর্তমানবতার সেবায় একটি আদর্শ কল্যাণসমাজ বিনির্মাণে যথাশক্তি প্রচেষ্টা চালিয়ে যাচ্ছে।',
        arabicText: 'وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ',
        source: 'ইসলামী ধারার ফাউন্ডেশন — মূল দর্শন ও অঙ্গীকার',
        order: 1,
        active: true
      }
    ];
  }, [quotes, quote]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const totalSlides = activeQuotes.length;

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setProgress(0);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setProgress(0);
  }, [totalSlides]);

  // Auto-play timer with progress ticker
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;

    const intervalMs = 6000; // 6 seconds per quote
    const stepMs = 60; // 100 updates per interval

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + (stepMs / intervalMs) * 100;
      });
    }, stepMs);

    return () => clearInterval(timer);
  }, [totalSlides, isPaused, handleNext]);

  // Reset index if out of bounds
  useEffect(() => {
    if (currentIndex >= totalSlides) {
      setCurrentIndex(0);
      setProgress(0);
    }
  }, [totalSlides, currentIndex]);

  const currentItem = activeQuotes[currentIndex] || activeQuotes[0];

  return (
    <section 
      className="relative bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-inner select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Decorative Islamic Geometric and calligraphy vectors */}
      <div className="absolute -left-10 -top-10 opacity-10 pointer-events-none select-none text-9xl sm:text-[14rem] font-arabic text-emerald-300">
        ۞
      </div>
      <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none select-none text-9xl sm:text-[14rem] font-arabic text-teal-300">
        ۞
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Top Category Badge & Quotation Icon Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 shadow-sm">
            <Quote className="w-5 h-5 rotate-180" />
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm font-semibold tracking-wide font-serif-bn shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>{currentItem.category || 'আমাদের মূল দর্শন ও অঙ্গীকার'}</span>
          </div>

          {totalSlides > 1 && (
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 hover:text-white transition-colors cursor-pointer border border-white/10 text-xs flex items-center gap-1"
              title={isPaused ? 'অটো-স্লাইড চালু করুন' : 'পজ করুন'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-amber-300" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* Dynamic Animated Quote Slide Content */}
        <div className="w-full text-center min-h-[160px] sm:min-h-[190px] flex flex-col items-center justify-center transition-all duration-500">
          
          {/* Optional Arabic Text */}
          {currentItem.arabicText && (
            <div className="mb-4 font-arabic text-xl sm:text-2xl md:text-3xl text-amber-300/95 tracking-wide leading-loose drop-shadow-sm px-4">
              {currentItem.arabicText}
            </div>
          )}

          {/* Bengali Quote / Verse Text */}
          <blockquote className="text-lg sm:text-2xl md:text-3xl font-serif-bn font-bold leading-relaxed sm:leading-loose text-white drop-shadow-sm px-2 sm:px-8">
            “{currentItem.quote}”
          </blockquote>

          {/* Source Attribution */}
          {currentItem.source && (
            <div className="mt-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/25 backdrop-blur-xs border border-emerald-400/30 text-xs sm:text-sm text-emerald-200 font-sans-bn font-medium">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentItem.source}</span>
            </div>
          )}
        </div>

        {/* Navigation Controls & Progress Bar */}
        {totalSlides > 1 && (
          <div className="mt-8 w-full flex flex-col items-center gap-4">
            
            {/* Prev / Next and Dots Navigation */}
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-emerald-200 hover:text-white border border-white/20 transition-all cursor-pointer shadow-xs"
                title="পূর্ববর্তী উক্তি"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dots Indicator */}
              <div className="flex items-center gap-2">
                {activeQuotes.map((q, idx) => (
                  <button
                    key={q.id || idx}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setProgress(0);
                    }}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentIndex 
                        ? 'w-8 bg-amber-400 shadow-md shadow-amber-400/30' 
                        : 'w-2.5 bg-white/30 hover:bg-white/50'
                    }`}
                    title={`উক্তি নং ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-emerald-200 hover:text-white border border-white/20 transition-all cursor-pointer shadow-xs"
                title="পরবর্তী উক্তি"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Auto-Slide Visual Progress Line */}
            {!isPaused && (
              <div className="w-36 h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-400/80 transition-all duration-75 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            <div className="text-[11px] text-emerald-300/70 font-sans-bn">
              {currentIndex + 1} / {totalSlides} (কয়েক সেকেন্ড পর পর স্বয়ংক্রিয়ভাবে পরিবর্তিত হচ্ছে)
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
