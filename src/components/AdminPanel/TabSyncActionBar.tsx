import React from 'react';
import { RefreshCw, UploadCloud, DownloadCloud, CheckCircle2, AlertCircle, ExternalLink, Code } from 'lucide-react';

interface TabSyncActionBarProps {
  tabTitle: string;
  hasScriptUrl: boolean;
  isSyncing: boolean;
  onPushToSheet: () => void;
  onPullFromSheet: () => void;
  onNavigateToScriptTab?: () => void;
  customSaveLabel?: string;
  onCustomSave?: () => void;
}

export const TabSyncActionBar: React.FC<TabSyncActionBarProps> = ({
  tabTitle,
  hasScriptUrl,
  isSyncing,
  onPushToSheet,
  onPullFromSheet,
  onNavigateToScriptTab,
  customSaveLabel,
  onCustomSave
}) => {
  return (
    <div className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 font-serif-bn">
      {/* Left side: Tab info & Live Connection indicator */}
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full shrink-0 ${hasScriptUrl ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 font-serif-bn">
              গুগল শিট লাইভ সিঙ্ক
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-sans-bn ${
              hasScriptUrl 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              {hasScriptUrl ? 'সংযুক্ত (Connected)' : 'URL যুক্ত করুন'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-sans-bn mt-0.5">
            {hasScriptUrl 
              ? `"${tabTitle}" ট্যাবের সকল ডাটা সরাসরি গুগল শিটে সেভ ও ব্যাকআপ রাখুন` 
              : 'গুগল শিটে রিয়েলটাইম সিঙ্ক করতে স্ক্রিপ্ট ট্যাব থেকে Web App URL সেট করুন'}
          </p>
        </div>
      </div>

      {/* Right side: Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
        {/* Custom Save (if provided for forms like settings/theme) */}
        {onCustomSave && customSaveLabel && (
          <button
            type="button"
            onClick={onCustomSave}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>{customSaveLabel}</span>
          </button>
        )}

        {/* Push to Sheets Button */}
        <button
          type="button"
          onClick={onPushToSheet}
          disabled={isSyncing}
          className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          title="এই ট্যাবের এবং সমস্ত পরিবর্তন তাৎক্ষণিক গুগল শিটে আপলোড/পুশ করুন"
        >
          <UploadCloud className={`w-3.5 h-3.5 ${isSyncing ? 'animate-bounce' : ''}`} />
          <span>{isSyncing ? 'পুশ হচ্ছে...' : 'গুগল শিটে পুশ (Push)'}</span>
        </button>

        {/* Pull from Sheets Button */}
        <button
          type="button"
          onClick={onPullFromSheet}
          disabled={isSyncing}
          className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          title="গুগল শিট থেকে সর্বশেষ তথ্য লোড/পুল করুন"
        >
          <DownloadCloud className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'ডাটা আসছে...' : 'শিট থেকে রিফ্রেশ (Pull)'}</span>
        </button>

        {/* If no script URL, quick setup button */}
        {!hasScriptUrl && onNavigateToScriptTab && (
          <button
            type="button"
            onClick={onNavigateToScriptTab}
            className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <Code className="w-3.5 h-3.5" />
            <span>URL কনফিগার</span>
          </button>
        )}
      </div>
    </div>
  );
};
