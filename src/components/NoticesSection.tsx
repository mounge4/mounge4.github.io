import React, { useState, useEffect } from 'react';
import { NoticeItem } from '../types';
import { PageHeader } from './PageHeader';
import { 
  Bell, 
  Search, 
  Calendar, 
  FileText, 
  Download, 
  ExternalLink, 
  AlertCircle,
  Filter,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';

interface NoticesSectionProps {
  notices: NoticeItem[];
  initialNoticeId?: string | null;
  onNavigate?: (tabId: string) => void;
  onClearNotice?: () => void;
}

export const NoticesSection: React.FC<NoticesSectionProps> = ({ 
  notices, 
  initialNoticeId,
  onNavigate,
  onClearNotice 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeNotice, setActiveNotice] = useState<NoticeItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeNotices = notices.filter(n => n.active);

  // Deep linking: Open notice modal automatically
  useEffect(() => {
    if (!notices || notices.length === 0) return;

    const findAndSetNotice = (targetId: string) => {
      const match = notices.find(n => n.id === targetId || n.title.trim().toLowerCase() === decodeURIComponent(targetId).trim().toLowerCase());
      if (match) {
        setActiveNotice(match);
      }
    };

    if (initialNoticeId) {
      findAndSetNotice(initialNoticeId);
      return;
    }

    const hash = window.location.hash || '';
    const hashMatch = hash.match(/^#notice-(.+)$/);
    if (hashMatch && hashMatch[1]) {
      findAndSetNotice(decodeURIComponent(hashMatch[1]));
      return;
    }

    try {
      const params = new URLSearchParams(window.location.search);
      const noticeParam = params.get('notice');
      if (noticeParam) {
        findAndSetNotice(decodeURIComponent(noticeParam));
      }
    } catch (e) {}
  }, [notices, initialNoticeId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenNotice = (notice: NoticeItem) => {
    setActiveNotice(notice);
    try {
      const shareUrl = `${window.location.pathname}?tab=notices&notice=${encodeURIComponent(notice.id)}#notice-${encodeURIComponent(notice.id)}`;
      window.history.replaceState(null, '', shareUrl);
    } catch (e) {}
  };

  const handleCloseNotice = () => {
    setActiveNotice(null);
    onClearNotice?.();
    try {
      const cleanUrl = `${window.location.pathname}?tab=notices`;
      window.history.replaceState(null, '', cleanUrl);
    } catch (e) {}
  };

  const handleCopyLink = async (notice: NoticeItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}?tab=notices&notice=${encodeURIComponent(notice.id)}#notice-${encodeURIComponent(notice.id)}`;

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

    setCopiedId(notice.id);
    showToast(`"${notice.title}" এর সরাসরি পড়ার লিংক কপি হয়েছে!`);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const categories = ['all', ...Array.from(new Set(activeNotices.map(n => n.category)))];

  const filteredNotices = activeNotices.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          n.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || n.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div id="notices" className="space-y-12 animate-fade-in">
      
      {/* Page Header - Centered Content */}
      <div className="text-center">
        <PageHeader
          title="নোটিস বোর্ড ও বিজ্ঞপ্তি"
          subtitle="আমাদের সকল প্রাতিষ্ঠানিক ঘোষণা, জরুরি বিজ্ঞপ্তি, কর্মসূচির সময়সূচি ও নোটিফিকেশন"
          category="অফিসিয়াল নোটিস"
          badgeIcon={Bell}
          onNavigateHome={() => onNavigate?.('home')}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Search and Category Filter Bar */}
        <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="নোটিসের শিরোনাম বা বিষয় খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif-bn focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Badges */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <span className="text-xs font-bold text-slate-500 font-serif-bn shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              ক্যাটাগরি:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-serif-bn transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'সকল নোটিস' : cat}
              </button>
            ))}
          </div>

        </div>

        {/* Notices Grid */}
        {filteredNotices.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 space-y-2">
            <Bell className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="text-base font-bold font-serif-bn text-slate-700">কোনো নোটিস খুঁজে পাওয়া যায়নি</h3>
            <p className="text-xs font-sans-bn text-slate-500">অন্য কোনো শব্দ দিয়ে সার্চ করে দেখুন।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredNotices.map((notice) => (
              <div
                key={notice.id}
                className={`p-6 rounded-3xl bg-white border transition-all flex flex-col justify-between gap-4 group ${
                  notice.isImportant
                    ? 'border-amber-300 bg-amber-50/20 shadow-sm ring-1 ring-amber-400/30'
                    : 'border-slate-200 hover:border-emerald-300 hover:shadow-md'
                }`}
              >
                <div className="space-y-3">
                  
                  {/* Notice Badges & Date */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold font-serif-bn">
                        {notice.category}
                      </span>
                      {notice.isImportant && (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          জরুরি নোটিস
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-sans-bn">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{notice.date}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold font-serif-bn text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {notice.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 font-serif-bn leading-relaxed line-clamp-3">
                    {notice.description}
                  </p>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2 gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenNotice(notice)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 font-serif-bn underline underline-offset-4 cursor-pointer"
                    >
                      বিস্তারিত পড়ুন →
                    </button>
                    <button
                      onClick={(e) => handleCopyLink(notice, e)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                      title="নোটিসের সরাসরি লিংক কপি করুন"
                    >
                      {copiedId === notice.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {notice.fileUrl && (
                      <a
                        href={notice.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-serif-bn font-semibold transition-colors flex items-center gap-1.5 border border-slate-200"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>পিডিএফ ফাইল</span>
                      </a>
                    )}

                    {notice.linkUrl && onNavigate && (
                      <button
                        onClick={() => onNavigate(notice.linkUrl!)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-serif-bn font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1"
                      >
                        <span>যুক্ত হোন</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Notice Detail Reader Modal */}
      {activeNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in font-serif-bn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  {activeNotice.category}
                </span>
                <span className="text-xs text-slate-500 font-sans-bn">{activeNotice.date}</span>
              </div>
              <button
                onClick={handleCloseNotice}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <h3 className="text-xl font-bold text-slate-900 leading-snug">
              {activeNotice.title}
            </h3>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm text-slate-700 leading-relaxed font-serif-bn whitespace-pre-line max-h-80 overflow-y-auto">
              {activeNotice.description}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 flex-wrap">
              <button
                onClick={(e) => handleCopyLink(activeNotice, e)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                {copiedId === activeNotice.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === activeNotice.id ? 'কপি হয়েছে' : 'লিংক কপি করুন'}</span>
              </button>

              <div className="flex items-center gap-2">
                {activeNotice.fileUrl && (
                  <a
                    href={activeNotice.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>ফাইল ডাউনলোড</span>
                  </a>
                )}
                <button
                  onClick={handleCloseNotice}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
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

    </div>
  );
};
