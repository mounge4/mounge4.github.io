import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  Copy, 
  Check, 
  X,
  MessageCircle,
  Play,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  User,
  Search
} from 'lucide-react';
import { formatDriveImageUrl, LOADING_PLACEHOLDER_IMAGE } from '../utils/imageHelper';
import { getYouTubeEmbedUrl } from '../utils/mediaHelper';

interface BlogSectionProps {
  blogs: BlogPost[];
  initialArticleId?: string | null;
  onClearArticle?: () => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ 
  blogs,
  initialArticleId,
  onClearArticle
}) => {
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('সকল');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Deep linking: Open article automatically if URL hash or initialArticleId matches
  useEffect(() => {
    if (!blogs || blogs.length === 0) return;

    const findAndSetArticle = (targetIdOrSlug: string) => {
      const match = blogs.find(b => 
        b.id === targetIdOrSlug || 
        b.slug === targetIdOrSlug ||
        b.title.trim().toLowerCase() === decodeURIComponent(targetIdOrSlug).trim().toLowerCase()
      );
      if (match) {
        setSelectedBlog(match);
      }
    };

    if (initialArticleId) {
      findAndSetArticle(initialArticleId);
      return;
    }

    // Check window hash on mount/update
    const hash = window.location.hash || '';
    const hashMatch = hash.match(/^#blog-(.+)$/);
    if (hashMatch && hashMatch[1]) {
      findAndSetArticle(decodeURIComponent(hashMatch[1]));
      return;
    }

    // Check search params
    try {
      const params = new URLSearchParams(window.location.search);
      const articleParam = params.get('article') || params.get('blog');
      if (articleParam) {
        findAndSetArticle(decodeURIComponent(articleParam));
      }
    } catch (e) {}
  }, [blogs, initialArticleId]);

  const featuredBlogs = blogs.length > 0 ? blogs.slice(0, 5) : [];

  // Auto slider effect
  useEffect(() => {
    if (featuredBlogs.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % featuredBlogs.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredBlogs.length]);

  const categories = ['সকল', ...Array.from(new Set(blogs.map(b => b.category)))];

  const filteredBlogs = blogs.filter(b => {
    const matchCat = selectedCategory === 'সকল' || b.category === selectedCategory;
    const matchSearch = !searchQuery.trim() || 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenBlog = (blog: BlogPost) => {
    setSelectedBlog(blog);
    try {
      const shareUrl = `${window.location.pathname}?tab=blog&article=${encodeURIComponent(blog.slug || blog.id)}#blog-${encodeURIComponent(blog.slug || blog.id)}`;
      window.history.replaceState(null, '', shareUrl);
    } catch (e) {}
  };

  const handleCloseBlog = () => {
    setSelectedBlog(null);
    onClearArticle?.();
    try {
      const cleanUrl = `${window.location.pathname}?tab=blog`;
      window.history.replaceState(null, '', cleanUrl);
    } catch (e) {}
  };

  const handleCopyLink = async (blog: BlogPost, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}?tab=blog&article=${encodeURIComponent(blog.slug || blog.id)}#blog-${encodeURIComponent(blog.slug || blog.id)}`;
    
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

    setCopiedId(blog.id);
    showToast(`"${blog.title}" এর সরাসরি পড়ার লিংক কপি হয়েছে!`);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const currentFeatured = featuredBlogs[currentSlideIndex] || featuredBlogs[0];

  return (
    <section id="blog" className="py-12 sm:py-16 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold font-serif-bn mb-3 border border-emerald-200">
            
            <span>দ্বীনি জ্ঞান ও মানবিক ভাবনা</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-serif-bn text-slate-900 tracking-tight mb-3">
            ইসলামিক ব্লগ ও আর্টিকেল
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-sans-bn">
            কোরআন, হাদিস, যাকাত ও সমাজসেবা বিষয়ক প্রবন্ধ ও সর্বশেষ আপডেট
          </p>
        </div>

        {/* 1. TOP AUTO-CHANGING SLIDER */}
        {currentFeatured && (
          <div className="mb-12 relative rounded-3xl overflow-hidden shadow-xl bg-slate-900 border border-slate-800">
            <div className="relative aspect-[21/9] sm:aspect-[24/9] min-h-[280px] w-full flex items-end">
              <img
                src={formatDriveImageUrl(currentFeatured.imageUrl)}
                alt={currentFeatured.title}
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
                    {currentFeatured.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-300 font-sans-bn">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    {currentFeatured.date}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-300 font-sans-bn">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    {currentFeatured.readTime}
                  </span>
                </div>

                <h3 className="text-xl sm:text-3xl font-extrabold text-white mb-2 sm:mb-3 line-clamp-2 leading-snug">
                  {currentFeatured.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 font-sans-bn line-clamp-2 mb-4 max-w-2xl">
                  {currentFeatured.excerpt || currentFeatured.content.slice(0, 160)}
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenBlog(currentFeatured)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer hover:scale-102"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>সম্পূর্ণ পড়ুন</span>
                  </button>

                  <button
                    onClick={(e) => handleCopyLink(currentFeatured, e)}
                    className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer flex items-center gap-1.5"
                    title="আর্টিকেলের লিংক কপি করুন"
                  >
                    {copiedId === currentFeatured.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span className="text-xs font-serif-bn hidden sm:inline">{copiedId === currentFeatured.id ? 'কপি হয়েছে' : 'লিংক কপি'}</span>
                  </button>
                </div>
              </div>

              {/* Slider Prev / Next Controls */}
              {featuredBlogs.length > 1 && (
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                  <button
                    onClick={() => setCurrentSlideIndex(prev => (prev === 0 ? featuredBlogs.length - 1 : prev - 1))}
                    className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors cursor-pointer"
                    aria-label="পূর্ববর্তী"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-white/80 font-sans-bn font-bold px-1">
                    {currentSlideIndex + 1} / {featuredBlogs.length}
                  </span>
                  <button
                    onClick={() => setCurrentSlideIndex(prev => (prev + 1) % featuredBlogs.length)}
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

        {/* 2. SEARCH & CATEGORY FILTER */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-serif-bn transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="আর্টিকেল খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-sans-bn"
            />
          </div>
        </div>

        {/* 3. TITLE-BASED LISTING CATALOG */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 font-serif-bn">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>সকল আর্টিকেলের তালিকা ({filteredBlogs.length}টি)</span>
            </h3>
            <span className="text-xs text-slate-500 font-sans-bn">
              যেকোনো শিরোনামে ক্লিক করে বিস্তারিত পড়ুন
            </span>
          </div>

          {filteredBlogs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-serif-bn text-sm">
              কোনো আর্টিকেল পাওয়া যায়নি।
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredBlogs.map((blog, idx) => (
                <div
                  key={blog.id}
                  onClick={() => handleOpenBlog(blog)}
                  className="py-3.5 px-3 hover:bg-emerald-50/60 rounded-2xl transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 group-hover:bg-emerald-700 group-hover:text-white text-slate-600 text-xs font-bold flex items-center justify-center shrink-0 transition-colors">
                      {idx + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold font-serif-bn">
                          {blog.category}
                        </span>
                        <span className="text-[11px] text-slate-400 font-sans-bn flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {blog.date}
                        </span>
                        <span className="text-[11px] text-slate-400 font-sans-bn flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {blog.author}
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold font-serif-bn text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                        {blog.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pl-10 sm:pl-0">
                    <span className="text-xs text-slate-400 font-sans-bn flex items-center gap-1 hidden md:flex">
                      <Clock className="w-3 h-3" />
                      {blog.readTime}
                    </span>
                    <button
                      onClick={(e) => handleCopyLink(blog, e)}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                      title="আর্টিকেলের লিংক কপি করুন"
                    >
                      {copiedId === blog.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenBlog(blog);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 group-hover:bg-emerald-700 group-hover:text-white text-slate-700 text-xs font-bold font-serif-bn transition-all shadow-2xs"
                    >
                      বিস্তারিত পড়ুন →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* 4. FULL BLOG READER MODAL */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in font-serif-bn">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
            
            {/* Modal Header Media */}
            <div className="relative aspect-[16/9] w-full bg-slate-900 shrink-0">
              <img
                src={formatDriveImageUrl(selectedBlog.imageUrl)}
                alt={selectedBlog.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = LOADING_PLACEHOLDER_IMAGE;
                }}
              />
              <button
                onClick={handleCloseBlog}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-xs transition-colors cursor-pointer"
                title="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 font-sans-bn">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold font-serif-bn">
                  {selectedBlog.category}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedBlog.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedBlog.readTime}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {selectedBlog.author} {selectedBlog.authorRole ? `(${selectedBlog.authorRole})` : ''}
                </span>
              </div>

              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                {selectedBlog.title}
              </h2>

              {/* YouTube video if available */}
              {selectedBlog.videoUrl && (
                <div className="my-4 rounded-2xl overflow-hidden aspect-[16/9] bg-black shadow-lg">
                  <iframe
                    src={getYouTubeEmbedUrl(selectedBlog.videoUrl)}
                    title={selectedBlog.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              <div className="prose max-w-none text-sm sm:text-base leading-relaxed text-slate-700 font-serif-bn whitespace-pre-line border-t border-slate-100 pt-5">
                {selectedBlog.content}
              </div>

              {/* Social Share & Link copy */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyLink(selectedBlog)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {copiedId === selectedBlog.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedId === selectedBlog.id ? 'কপি হয়েছে' : 'লিংক কপি করুন'}</span>
                  </button>
                </div>

                <button
                  onClick={handleCloseBlog}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
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
