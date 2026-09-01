import React, { useState } from 'react';
import { NoticeItem } from '../types';
import { Bell, ChevronRight, Sparkles, ExternalLink, Calendar } from 'lucide-react';
import { NoticeModal } from './NoticeModal';

interface NoticeTickerProps {
  notices: NoticeItem[];
}

export const NoticeTicker: React.FC<NoticeTickerProps> = ({ notices }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);

  const activeNotices = notices.filter(n => n.active);
  const latestNotices = activeNotices.slice(0, 2); // latest 1-2 notices as requested

  if (activeNotices.length === 0) return null;

  return (
    <>
      <section className="bg-emerald-50/80 border-y border-emerald-100/80 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Left badge & ticker notices */}
          <div className="flex items-start sm:items-center gap-3 overflow-hidden flex-1">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700 text-white text-xs font-bold font-serif-bn whitespace-nowrap shadow-xs shrink-0">
              <Bell className="w-3.5 h-3.5 animate-bounce text-amber-300" />
              <span>নোটিস বোর্ড</span>
            </div>

            {/* List of 1-2 latest notice titles */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 overflow-hidden flex-1">
              {latestNotices.map((notice, idx) => (
                <button
                  key={notice.id || idx}
                  onClick={() => {
                    setSelectedNotice(notice);
                    setModalOpen(true);
                  }}
                  className="group flex items-center gap-2 text-left text-sm font-medium font-serif-bn text-emerald-950 hover:text-emerald-700 transition-colors cursor-pointer truncate"
                >
                  {notice.isImportant && (
                    <span className="px-1.5 py-0.5 rounded-sm bg-rose-600 text-white text-[10px] font-bold uppercase shrink-0">
                      জরুরি
                    </span>
                  )}
                  <span className="truncate group-hover:underline">
                    {notice.title}
                  </span>
                  <span className="text-xs text-emerald-600 font-sans-bn shrink-0 hidden lg:inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {notice.date}
                  </span>
                  {idx < latestNotices.length - 1 && (
                    <span className="hidden sm:inline-block text-emerald-300">|</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Button "সব নোটিস দেখুন" as specified */}
          <div className="shrink-0 flex items-center justify-end">
            <button
              id="view-all-notices-btn"
              onClick={() => {
                setSelectedNotice(null);
                setModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-300 text-xs sm:text-sm font-semibold font-serif-bn shadow-xs transition-all cursor-pointer group"
            >
              <span>সব নোটিস দেখুন</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

        </div>
      </section>

      {/* Notice Board Full Modal */}
      {modalOpen && (
        <NoticeModal
          notices={activeNotices}
          initialSelected={selectedNotice}
          onClose={() => {
            setModalOpen(false);
            setSelectedNotice(null);
          }}
        />
      )}
    </>
  );
};
