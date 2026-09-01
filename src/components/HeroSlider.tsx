import React, { useState, useEffect } from 'react';
import { HeroSlide } from '../types';
import { ChevronLeft, ChevronRight, ArrowRight, Heart, Play } from 'lucide-react';
import { formatDriveImageUrl, LOADING_PLACEHOLDER_IMAGE } from '../utils/imageHelper';
import { getYouTubeEmbedUrl } from '../utils/mediaHelper';

interface HeroSliderProps {
  slides: HeroSlide[];
  onNavigate: (targetId: string) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ slides, onNavigate }) => {
  const activeSlides = slides.filter(s => s.active);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, 6500);

    return () => clearInterval(timer);
  }, [activeSlides.length, isPaused]);

  if (activeSlides.length === 0) {
    return null;
  }

  const currentSlide = activeSlides[currentIndex] || activeSlides[0];
  const currentVideoEmbed = getYouTubeEmbedUrl(currentSlide.videoUrl);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  };

  const handleCtaClick = (link: string) => {
    if (!link) return;
    const cleanId = link.replace('#', '');
    onNavigate(cleanId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section 
      id="hero-slider-section"
      className="relative w-full overflow-hidden bg-slate-950 aspect-[16/9] min-h-[380px] sm:min-h-[460px] md:min-h-[520px] max-h-[640px] flex items-center justify-center select-none shadow-lg"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 16:9 Background Slides / Video Embed with cross-fade */}
      {activeSlides.map((slide, idx) => {
        const slideVideo = getYouTubeEmbedUrl(slide.videoUrl);
        const isActive = idx === currentIndex;

        return (
          <div
            key={slide.id || idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {slideVideo ? (
              <iframe
                src={`${slideVideo}&autoplay=1&mute=1&loop=1&controls=0`}
                title={slide.title}
                className="w-full h-full object-cover pointer-events-none scale-125"
                allow="autoplay; encrypted-media"
              />
            ) : (
              <img
                src={formatDriveImageUrl(slide.imageUrl)}
                alt={slide.title}
                className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = LOADING_PLACEHOLDER_IMAGE;
                }}
              />
            )}
            
            {/* Dark gradient overlay for 100% text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/35" />
            <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/50" />
          </div>
        );
      })}

      {/* Decorative Islamic geometric motif */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-5 flex items-center justify-center">
        <span className="text-[260px] sm:text-[340px] font-arabic text-white select-none">۞</span>
      </div>

      {/* Slide Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 text-center text-white">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-medium mb-3 sm:mb-4 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          {/* স্লাইডার এ সবুজ বক্স এর ভিতর কোনো লেখা যুক্ত করতে চাইলে এখানে সেটা করতে পারবেন। <span> এখানে লেখা দিলেই হবে </span>*/}
        </div>

        <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold font-serif-bn leading-tight sm:leading-tight mb-3 sm:mb-4 text-white drop-shadow-md max-w-3xl mx-auto">
          {currentSlide.title}
        </h2>

        <p className="text-xs sm:text-base md:text-lg text-slate-200 font-sans-bn max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed drop-shadow-xs line-clamp-3 sm:line-clamp-none">
          {currentSlide.subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {currentSlide.ctaText && (
            <button
              id={`slide-cta-btn-${currentIndex}`}
              onClick={() => handleCtaClick(currentSlide.ctaLink || 'activities')}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold font-serif-bn text-xs sm:text-sm md:text-base shadow-lg shadow-emerald-700/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>{currentSlide.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}


        </div>
      </div>

      {/* Navigation Arrows */}
      {activeSlides.length > 1 && (
        <>
          <button
            id="hero-slider-prev-btn"
            onClick={handlePrev}
            aria-label="পূর্ববর্তী স্লাইড"
            className="absolute left-3 sm:left-6 z-20 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-xs transition-all hover:scale-110 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>

          <button
            id="hero-slider-next-btn"
            onClick={handleNext}
            aria-label="পরবর্তী স্লাইড"
            className="absolute right-3 sm:right-6 z-20 p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-xs transition-all hover:scale-110 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 sm:bottom-6 z-20 flex items-center gap-2">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`স্লাইড ${idx + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex 
                    ? 'w-6 sm:w-8 bg-emerald-400' 
                    : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};
