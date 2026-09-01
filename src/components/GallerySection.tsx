import React, { useState, useEffect } from 'react';
import { GalleryItem, GalleryPhoto } from '../types';
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  X, 
  ZoomIn, 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  Images, 
  FolderOpen
} from 'lucide-react';
import { formatDriveImageUrl, LOADING_PLACEHOLDER_IMAGE } from '../utils/imageHelper';
import { getYouTubeEmbedUrl } from '../utils/mediaHelper';

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('সকল');
  const [activeAlbum, setActiveAlbum] = useState<GalleryItem | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);
  const [topSlideIndex, setTopSlideIndex] = useState<number>(0);

  const categories = ['সকল', 'কার্যক্রম', 'ত্রাণ বিতরণ', 'চিকিৎসা ক্যাম্প', 'ইফতার ও খাদ্য', 'শিক্ষা কার্যক্রম', 'সম্মেলন'];

  const filteredItems = selectedCategory === 'সকল'
    ? gallery
    : gallery.filter(g => g.category === selectedCategory);

  // Auto slide for top carousel
  useEffect(() => {
    if (gallery.length <= 1) return;
    const timer = setInterval(() => {
      setTopSlideIndex(prev => (prev + 1) % gallery.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [gallery.length]);

  const handleOpenAlbum = (item: GalleryItem) => {
    setActiveAlbum(item);
    setCurrentPhotoIndex(0);
  };

  // Get active album photos array
  const getAlbumPhotos = (item: GalleryItem): GalleryPhoto[] => {
    if (item.images && item.images.length > 0) {
      return item.images;
    }
    return [{ url: item.imageUrl, caption: item.title }];
  };

  const topFeatured = gallery[topSlideIndex] || gallery[0];

  return (
    <section id="gallery" className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold font-serif-bn mb-3 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>আমাদের ছবির অ্যালবাম ও মিডিয়া</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-serif-bn text-slate-900 tracking-tight mb-3">
            ফটোগ্যালারি ও কার্যক্রম অ্যালবাম
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-sans-bn">
            মাঠপর্যায়ে বাস্তবায়িত বিভিন্ন সামাজিক ও মানবিক উদ্যোগের স্থিরচিত্র ও ভিডিও
          </p>
        </div>

        {/* 1. TOP AUTO-CHANGING SLIDER */}
        {topFeatured && (
          <div className="mb-12 relative rounded-3xl overflow-hidden shadow-xl bg-slate-900 border border-slate-800">
            <div className="relative aspect-[21/9] sm:aspect-[24/9] min-h-[280px] w-full flex items-end">
              <img
                src={formatDriveImageUrl(topFeatured.imageUrl)}
                alt={topFeatured.title}
                className="absolute inset-0 w-full h-full object-cover opacity-50 transition-all duration-700 hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = LOADING_PLACEHOLDER_IMAGE;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

              {/* Top Slider Content */}
              <div className="relative z-10 p-6 sm:p-10 w-full max-w-4xl text-white font-serif-bn">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold font-serif-bn">
                    {topFeatured.category}
                  </span>
                  {topFeatured.location && (
                    <span className="flex items-center gap-1 text-xs text-slate-300 font-sans-bn">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      {topFeatured.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-slate-300 font-sans-bn">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    {topFeatured.date}
                  </span>
                </div>

                <h3 className="text-xl sm:text-3xl font-extrabold text-white mb-2 sm:mb-3 line-clamp-2 leading-snug">
                  {topFeatured.title}
                </h3>

                {topFeatured.description && (
                  <p className="text-xs sm:text-sm text-slate-300 font-sans-bn line-clamp-2 mb-4 max-w-2xl">
                    {topFeatured.description}
                  </p>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenAlbum(topFeatured)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer hover:scale-102"
                  >
                    <Images className="w-4 h-4" />
                    <span>সকল ছবি দেখুন ({getAlbumPhotos(topFeatured).length}টি)</span>
                  </button>
                </div>
              </div>

              {/* Slider Controls */}
              {gallery.length > 1 && (
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                  <button
                    onClick={() => setTopSlideIndex(prev => (prev === 0 ? gallery.length - 1 : prev - 1))}
                    className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors cursor-pointer"
                    aria-label="পূর্ববর্তী"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-white/80 font-sans-bn font-bold px-1">
                    {topSlideIndex + 1} / {gallery.length}
                  </span>
                  <button
                    onClick={() => setTopSlideIndex(prev => (prev + 1) % gallery.length)}
                    className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors cursor-pointer"
                    aria-label="পরবর্তী"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. CATEGORY FILTER */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold font-serif-bn transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 3. ALBUM / TITLE-BASED LISTING CATALOG */}
        <div className="bg-slate-50 rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 font-serif-bn">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-emerald-600" />
              <span>ইভেন্ট ও ছবির অ্যালবাম তালিকা ({filteredItems.length}টি)</span>
            </h3>
            <span className="text-xs text-slate-500 font-sans-bn">
              যেকোনো শিরোনামে ক্লিক করলে ক্যাপশনসহ একাধিক ছবি স্লাইড আকারে আসবে
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              const photoCount = getAlbumPhotos(item).length;
              const hasVideo = !!item.videoUrl;

              return (
                <div
                  key={item.id}
                  onClick={() => handleOpenAlbum(item)}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex items-center gap-4 group"
                >
                  {/* Thumbnail */}
                  <div className="relative w-24 sm:w-28 aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 shrink-0">
                    <img
                      src={formatDriveImageUrl(item.imageUrl)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = LOADING_PLACEHOLDER_IMAGE;
                      }}
                    />
                    {hasVideo && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play className="w-4 h-4 text-white" fill="white" />
                      </div>
                    )}
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 text-white text-[10px] font-sans-bn flex items-center gap-0.5">
                      <Images className="w-2.5 h-2.5" />
                      {photoCount}
                    </span>
                  </div>

                  {/* Album Info */}
                  <div className="flex-1 min-w-0 font-serif-bn">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {item.category}
                      </span>
                      {item.location && (
                        <span className="text-[11px] text-slate-400 font-sans-bn flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {item.location}
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 font-sans-bn flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {item.date}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-2 mb-1">
                      {item.title}
                    </h4>

                    <span className="text-xs text-emerald-700 font-bold inline-flex items-center gap-1 group-hover:underline">
                      ক্যাপশনসহ ছবি দেখুন →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 4. MULTI-PHOTO SLIDER MODAL WITH CAPTIONS */}
      {activeAlbum && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in font-serif-bn">
          <div className="bg-slate-900 text-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-700 text-white text-xs font-bold">
                    {activeAlbum.category}
                  </span>
                  <span className="text-xs text-slate-400 font-sans-bn">
                    {activeAlbum.location || activeAlbum.date}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-bold text-white mt-1 line-clamp-1">
                  {activeAlbum.title}
                </h3>
              </div>

              <button
                onClick={() => setActiveAlbum(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slider / Video View Area */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[320px] sm:min-h-[460px] overflow-hidden">
              {activeAlbum.videoUrl && currentPhotoIndex === 0 ? (
                <div className="w-full aspect-[16/9] max-h-[460px]">
                  <iframe
                    src={getYouTubeEmbedUrl(activeAlbum.videoUrl)}
                    title={activeAlbum.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  {(() => {
                    const photos = getAlbumPhotos(activeAlbum);
                    const currentPhoto = photos[currentPhotoIndex] || photos[0];
                    return (
                      <img
                        src={formatDriveImageUrl(currentPhoto.url)}
                        alt={currentPhoto.caption || activeAlbum.title}
                        className="max-h-[460px] w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = LOADING_PLACEHOLDER_IMAGE;
                        }}
                      />
                    );
                  })()}
                </div>
              )}

              {/* Prev / Next Photo Buttons */}
              {getAlbumPhotos(activeAlbum).length > 1 && (
                <>
                  <button
                    onClick={() => {
                      const len = getAlbumPhotos(activeAlbum).length;
                      setCurrentPhotoIndex(prev => (prev === 0 ? len - 1 : prev - 1));
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all cursor-pointer shadow-lg"
                    title="পূর্ববর্তী ছবি"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => {
                      const len = getAlbumPhotos(activeAlbum).length;
                      setCurrentPhotoIndex(prev => (prev + 1) % len);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all cursor-pointer shadow-lg"
                    title="পরবর্তী ছবি"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Photo Caption & Thumbnails strip */}
            <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 space-y-3">
              {/* Caption Box */}
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs sm:text-sm text-slate-200 font-sans-bn leading-relaxed">
                  {getAlbumPhotos(activeAlbum)[currentPhotoIndex]?.caption || activeAlbum.description || activeAlbum.title}
                </p>
                <span className="text-xs text-amber-400 font-sans-bn font-bold shrink-0">
                  ছবি {currentPhotoIndex + 1} / {getAlbumPhotos(activeAlbum).length}
                </span>
              </div>

              {/* Photo Thumbnails */}
              {getAlbumPhotos(activeAlbum).length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pt-2 no-scrollbar">
                  {getAlbumPhotos(activeAlbum).map((ph, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPhotoIndex(idx)}
                      className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        currentPhotoIndex === idx ? 'border-amber-400 scale-105' : 'border-slate-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={formatDriveImageUrl(ph.url)}
                        alt={ph.caption || ''}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = LOADING_PLACEHOLDER_IMAGE;
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
