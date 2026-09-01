import React, { useState } from 'react';
import { NoticeItem } from '../types';
import { X, Bell, Calendar, Search, FileText, ExternalLink, ChevronRight, AlertCircle, Copy, Check } from 'lucide-react';

interface NoticeModalProps {
  notices: NoticeItem[];
  initialSelected: NoticeItem | null;
  onClose: () => void;
}

export const NoticeModal: React.FC<NoticeModalProps> = ({
  notices,
  initialSelected,
  onClose
}) => {
  const [selected, setSelected] = useState<NoticeItem | null>(initialSelected || (notices.length > 0 ? notices[0] : null));
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  const filteredNotices = notices.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = async () => {
    if (!selected) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}?tab=notices&notice=${encodeURIComponent(selected.id)}#notice-${encodeURIComponent(selected.id)}`;
    
    let isCopied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
        isCopied = true;
      }
    } catch (err) {}

    if (!isCopied) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch (err) {}
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-800 text-white flex flex-col items-center justify-center text-center border-b border-emerald-700 relative">
          <div className="flex flex-col items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-700 text-amber-300">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif-bn">নোটিস বোর্ড</h3>
              <p className="text-xs text-emerald-200">সকল গুরুত্বপূর্ণ বিজ্ঞপ্তি ও আপডেটসমূহ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-emerald-700/60 hover:bg-emerald-700 text-white transition-colors cursor-pointer absolute right-6 top-1/2 -translate-y-1/2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="নোটিস খুঁজুন (শিরোনাম বা বিষয়বস্তু)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-serif-bn"
            />
          </div>
        </div>

        {/* Content Body: Left List + Right Detail view */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          
          {/* Notice List */}
          <div className="md:col-span-5 border-r border-slate-200 overflow-y-auto max-h-[300px] md:max-h-[500px] p-2 space-y-2">
            {filteredNotices.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm">কোনো নোটিস পাওয়া যায়নি।</div>
            ) : (
              filteredNotices.map((notice) => (
                <button
                  key={notice.id}
                  onClick={() => setSelected(notice)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all cursor-pointer ${
                    selected?.id === notice.id
                      ? 'bg-emerald-50 border-2 border-emerald-600 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border border-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {notice.category || 'সাধারণ'}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-sans-bn">
                      <Calendar className="w-3 h-3" />
                      {notice.date}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold font-serif-bn text-slate-800 line-clamp-2">
                    {notice.title}
                  </h4>

                  {notice.isImportant && (
                    <span className="inline-block mt-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                      ★ জরুরি
                    </span>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Notice Details Pane */}
          <div className="md:col-span-7 p-6 overflow-y-auto max-h-[350px] md:max-h-[500px] bg-white flex flex-col justify-between">
            {selected ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                    {selected.category || 'বিজ্ঞপ্তি'}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    প্রকাশিত: {selected.date}
                  </span>
                  {selected.isImportant && (
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-xs font-bold">
                      জরুরি বিজ্ঞপ্তি
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold font-serif-bn text-slate-900 mb-4 leading-snug">
                  {selected.title}
                </h3>

                <div className="prose prose-slate max-w-none text-sm text-slate-700 font-sans-bn leading-relaxed whitespace-pre-line mb-6">
                  {selected.description}
                </div>

                {/* Attachments or links */}
                {(selected.fileUrl || selected.linkUrl) && (
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
                    {selected.fileUrl && (
                      <a
                        href={selected.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold transition-colors"
                      >
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span>সংযুক্ত ফাইল ডাউনলোড</span>
                      </a>
                    )}
                    {selected.linkUrl && (
                      <a
                        href={selected.linkUrl}
                        target={selected.linkUrl.startsWith('http') ? '_blank' : '_self'}
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 text-xs font-semibold transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-slate-600" />
                        <span>বিস্তারিত লিঙ্ক</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
                <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                <p>একটি নোটিস নির্বাচন করুন বিস্তারিত দেখতে।</p>
              </div>
            )}

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
              {selected ? (
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'কপি হয়েছে' : 'লিংক কপি করুন'}</span>
                </button>
              ) : <div />}

              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
