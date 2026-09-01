import React, { useState, useEffect } from 'react';
import { ActivityItem } from '../types';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  HeartHandshake, 
  X,
  Play,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Target,
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';
import { formatDriveImageUrl, LOADING_PLACEHOLDER_IMAGE } from '../utils/imageHelper';
import { getYouTubeEmbedUrl } from '../utils/mediaHelper';

interface ActivitiesSectionProps {
  activities: ActivityItem[];
  initialActivityId?: string | null;
  onDonateClick: (activityTitle: string) => void;
  onClearActivity?: () => void;
}

export const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({
  activities,
  initialActivityId,
  onDonateClick,
  onClearActivity
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('সকল');
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [topSlideIndex, setTopSlideIndex] = useState<number>(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Deep linking: Open project/activity modal automatically
  useEffect(() => {
    if (!activities || activities.length === 0) return;

    const findAndSetActivity = (targetId: string) => {
      const match = activities.find(a => 
        a.id === targetId || 
        a.title.trim().toLowerCase() === decodeURIComponent(targetId).trim().toLowerCase()
      );
      if (match) {
        setSelectedActivity(match);
      }
    };

    if (initialActivityId) {
      findAndSetActivity(initialActivityId);
      return;
    }

    const hash = window.location.hash || '';
    const hashMatch = hash.match(/^#activity-(.+)$/);
    if (hashMatch && hashMatch[1]) {
      findAndSetActivity(decodeURIComponent(hashMatch[1]));
      return;
    }

    try {
      const params = new URLSearchParams(window.location.search);
      const actParam = params.get('activity') || params.get('project');
      if (actParam) {
        findAndSetActivity(decodeURIComponent(actParam));
      }
    } catch (e) {}
  }, [activities, initialActivityId]);

  const categories = ['সকল', 'খাদ্য সহায়তা', 'শিক্ষা ও কোরআন', 'চিকিৎসা সেবা', 'এতিম প্রতিপালন', 'মসজিদ ও পানির প্রকল্প', 'দুর্যোগ ত্রাণ'];

  const filteredActivities = selectedCategory === 'সকল'
    ? activities
    : activities.filter(a => a.category === selectedCategory);

  // Auto slide for top projects
  useEffect(() => {
    if (activities.length <= 1) return;
    const timer = setInterval(() => {
      setTopSlideIndex(prev => (prev + 1) % activities.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activities.length]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenActivity = (act: ActivityItem) => {
    setSelectedActivity(act);
    try {
      const shareUrl = `${window.location.pathname}?tab=activities&activity=${encodeURIComponent(act.id)}#activity-${encodeURIComponent(act.id)}`;
      window.history.replaceState(null, '', shareUrl);
    } catch (e) {}
  };

  const handleCloseActivity = () => {
    setSelectedActivity(null);
    onClearActivity?.();
    try {
      const cleanUrl = `${window.location.pathname}?tab=activities`;
      window.history.replaceState(null, '', cleanUrl);
    } catch (e) {}
  };

  const handleCopyLink = async (act: ActivityItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}?tab=activities&activity=${encodeURIComponent(act.id)}#activity-${encodeURIComponent(act.id)}`;

    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
        copied = true;
      }
    } catch (err) {}

    if (!copied) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        copied = document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch (err) {}
    }

    setCopiedId(act.id);
    showToast(`"${act.title}" এর সরাসরি শেয়ার লিংক কপি হয়েছে!`);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const topFeatured = activities[topSlideIndex] || activities[0];

  return (
    <section id="activities" className="py-12 sm:py-16 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold font-serif-bn mb-3 border border-emerald-200">
                  <span>দ্বীনের দাওয়াহ, ভ্রাতৃত্ব ও মানবসেবায় নিয়োজিত</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-serif-bn text-slate-900 tracking-tight mb-3">
            কার্যক্রম ও প্রজেক্টসমূহ
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-sans-bn">
            মানবতার কল্যাণে আমাদের চলমান ও বাস্তবায়িত দ্বীনি এবং সামাজিক প্রকল্পসমূহ
          </p>
        </div>

        {/* 1. TOP AUTO-CHANGING SLIDER */}
        {topFeatured && (
          <div className="mb-12 relative rounded-3xl overflow-hidden shadow-xl bg-slate-900 border border-slate-800">
            <div className="relative aspect-[21/9] sm:aspect-[24/9] min-h-[290px] w-full flex items-end">
              <img
                src={formatDriveImageUrl(topFeatured.imageUrl)}
                alt={topFeatured.title}
                className="absolute inset-0 w-full h-full object-cover opacity-45 transition-all duration-700 hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = LOADING_PLACEHOLDER_IMAGE;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

              {/* Slider Content */}
              <div className="relative z-10 p-6 sm:p-10 w-full max-w-4xl text-white font-serif-bn">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold font-serif-bn">
                    {topFeatured.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-amber-300 text-xs font-bold font-serif-bn">
                    অবস্থা: {topFeatured.status}
                  </span>
                  {topFeatured.location && (
                    <span className="flex items-center gap-1 text-xs text-slate-300 font-sans-bn">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      {topFeatured.location}
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-3xl font-extrabold text-white mb-2 sm:mb-3 line-clamp-2 leading-snug">
                  {topFeatured.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 font-sans-bn line-clamp-2 mb-4 max-w-2xl">
                  {topFeatured.shortDesc || topFeatured.fullDesc}
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenActivity(topFeatured)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer hover:scale-102"
                  >
                    <span>বিস্তারিত দেখুন ও দান করুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleCopyLink(topFeatured, e)}
                    className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs transition-colors cursor-pointer"
                    title="এই প্রকল্পের লিংক কপি করুন"
                  >
                    {copiedId === topFeatured.id ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Slider Controls */}
              {activities.length > 1 && (
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                  <button
                    onClick={() => setTopSlideIndex(prev => (prev === 0 ? activities.length - 1 : prev - 1))}
                    className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors cursor-pointer"
                    aria-label="পূর্ববর্তী"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-white/80 font-sans-bn font-bold px-1">
                    {topSlideIndex + 1} / {activities.length}
                  </span>
                  <button
                    onClick={() => setTopSlideIndex(prev => (prev + 1) % activities.length)}
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

        {/* 2. CATEGORY FILTERS */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold font-serif-bn transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 3. TITLE-BASED LISTING CATALOG */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 font-serif-bn">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-emerald-600" />
              <span>সকল কার্যক্রম ও প্রজেক্টের তালিকা ({filteredActivities.length}টি)</span>
            </h3>
            <span className="text-xs text-slate-500 font-sans-bn">
              যেকোনো প্রজেক্টে ক্লিক করে বিস্তারিত জানুন ও দান করুন
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredActivities.map((act, idx) => {
              const progress = act.targetAmount > 0 
                ? Math.min(100, Math.round((act.raisedAmount / act.targetAmount) * 100))
                : 100;

              return (
                <div
                  key={act.id}
                  onClick={() => handleOpenActivity(act)}
                  className="py-4 px-3 hover:bg-emerald-50/60 rounded-2xl transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group font-serif-bn"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 group-hover:bg-emerald-700 group-hover:text-white text-slate-600 text-xs font-bold flex items-center justify-center shrink-0 transition-colors">
                      {idx + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {act.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {act.status}
                        </span>
                        {act.location && (
                          <span className="text-[11px] text-slate-400 font-sans-bn flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {act.location}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1 mb-1">
                        {act.title}
                      </h4>

                      {/* Progress Bar Mini */}
                      <div className="flex items-center gap-3 text-xs font-sans-bn text-slate-500 max-w-md">
                        <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="shrink-0 font-bold text-emerald-700">
                          {progress}% সংগৃহীত
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center pl-10 md:pl-0">
                    <button
                      onClick={(e) => handleCopyLink(act, e)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                      title="এই প্রকল্পের লিংক কপি করুন"
                    >
                      {copiedId === act.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDonateClick(act.title);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold font-serif-bn transition-all shadow-xs"
                    >
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>দান করুন</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenActivity(act);
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-100 group-hover:bg-emerald-700 group-hover:text-white text-slate-700 text-xs font-bold transition-all shadow-2xs"
                    >
                      বিস্তারিত →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 4. ACTIVITY DETAIL MODAL */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in font-serif-bn">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
            
            {/* Media Header */}
            <div className="relative aspect-[16/9] w-full bg-slate-900 shrink-0">
              <img
                src={formatDriveImageUrl(selectedActivity.imageUrl)}
                alt={selectedActivity.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = LOADING_PLACEHOLDER_IMAGE;
                }}
              />
              <button
                onClick={handleCloseActivity}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-xs transition-colors cursor-pointer"
                title="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 font-sans-bn">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold font-serif-bn">
                  {selectedActivity.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold font-serif-bn">
                  {selectedActivity.status}
                </span>
                {selectedActivity.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {selectedActivity.location}
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                {selectedActivity.title}
              </h2>

              {/* Target & Raised stats */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                <div>
                  <span className="text-xs text-slate-500 font-sans-bn block">লক্ষ্যমাত্রা</span>
                  <span className="text-base sm:text-lg font-bold text-slate-900 font-serif-bn">
                    ৳{selectedActivity.targetAmount.toLocaleString('bn-BD')}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-sans-bn block">সংগৃহীত</span>
                  <span className="text-base sm:text-lg font-bold text-emerald-700 font-serif-bn">
                    ৳{selectedActivity.raisedAmount.toLocaleString('bn-BD')}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-xs text-slate-500 font-sans-bn block">অগ্রগতি</span>
                  <span className="text-base sm:text-lg font-bold text-amber-600 font-serif-bn">
                    {Math.min(100, Math.round((selectedActivity.raisedAmount / (selectedActivity.targetAmount || 1)) * 100))}%
                  </span>
                </div>
              </div>

              {/* Video if exists */}
              {selectedActivity.videoUrl && (
                <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-black shadow-lg">
                  <iframe
                    src={getYouTubeEmbedUrl(selectedActivity.videoUrl)}
                    title={selectedActivity.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              <div className="text-sm sm:text-base leading-relaxed text-slate-700 font-serif-bn whitespace-pre-line border-t border-slate-100 pt-4">
                {selectedActivity.fullDesc || selectedActivity.shortDesc}
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => {
                      const title = selectedActivity.title;
                      handleCloseActivity();
                      onDonateClick(title);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold shadow-lg transition-all cursor-pointer"
                  >
                    <HeartHandshake className="w-4 h-4" />
                    <span>এই প্রকল্পে দান করুন</span>
                  </button>

                  <button
                    onClick={(e) => handleCopyLink(selectedActivity, e)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {copiedId === selectedActivity.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedId === selectedActivity.id ? 'কপি হয়েছে' : 'লিংক কপি করুন'}</span>
                  </button>
                </div>

                <button
                  onClick={handleCloseActivity}
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-slate-900 text-white text-xs sm:text-sm font-serif-bn shadow-2xl border border-slate-700 animate-bounce">
          {toastMessage}
        </div>
      )}

    </section>
  );
};
