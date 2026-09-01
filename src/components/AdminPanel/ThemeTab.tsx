import React from 'react';
import { SiteSettings } from '../../types';
import { Palette, Check, RefreshCcw, Sparkles, Sliders, Eye } from 'lucide-react';
import { formatDriveImageUrl } from '../../utils/imageHelper';

interface ThemeTabProps {
  settings: SiteSettings;
  onChangeSettings: (newSettings: SiteSettings) => void;
  onSave: () => void;
}

interface ThemePreset {
  name: string;
  desc: string;
  settings: Partial<SiteSettings>;
}

export const ThemeTab: React.FC<ThemeTabProps> = ({ settings, onChangeSettings, onSave }) => {
  const presets: ThemePreset[] = [
    {
      name: 'ক্লাসিক ইসলামিক গ্রিন ও গোল্ড',
      desc: 'ঐতিহ্যবাহী গাঢ় সবুজ, সোনালী বর্ডার ও স্নিগ্ধ ব্যাকগ্রাউন্ড',
      settings: {
        primaryColor: '#059669',
        secondaryColor: '#d97706',
        headingTextColor: '#022c22',
        bodyTextColor: '#334155',
        cardBgColor: '#ffffff',
        cardBorderColor: '#e2e8f0',
        pageBgColor: '#f8fafc',
        headerBgColor: '#ffffff',
        footerBgColor: '#022c22'
      }
    },
    {
      name: 'ডিপ এমারেল্ড ও টিল',
      desc: 'আধুনিক গভীর পান্না সবুজ এবং সতেজ টিল অ্যাকসেন্ট',
      settings: {
        primaryColor: '#047857',
        secondaryColor: '#0d9488',
        headingTextColor: '#064e3b',
        bodyTextColor: '#1e293b',
        cardBgColor: '#ffffff',
        cardBorderColor: '#cbd5e1',
        pageBgColor: '#f0fdf4',
        headerBgColor: '#ffffff',
        footerBgColor: '#064e3b'
      }
    },
    {
      name: 'রয়্যাল নেভি ও গোল্ডেন',
      desc: 'মর্যাদাপূর্ণ গাঢ় নীল ও উজ্জ্বল সোনালী নান্দনিক রঙ',
      settings: {
        primaryColor: '#1e3a8a',
        secondaryColor: '#b45309',
        headingTextColor: '#0f172a',
        bodyTextColor: '#334155',
        cardBgColor: '#ffffff',
        cardBorderColor: '#e2e8f0',
        pageBgColor: '#f8fafc',
        headerBgColor: '#ffffff',
        footerBgColor: '#0f172a'
      }
    },
    {
      name: 'অলিভ গ্রিন ও ওয়ার্ম স্যান্ড',
      desc: 'প্রাকৃতিক জলপাই সবুজ ও উষ্ণ সোনালী বালুর রঙ',
      settings: {
        primaryColor: '#3f6212',
        secondaryColor: '#ca8a04',
        headingTextColor: '#1a2e05',
        bodyTextColor: '#374151',
        cardBgColor: '#ffffff',
        cardBorderColor: '#e5e7eb',
        pageBgColor: '#fafaf9',
        headerBgColor: '#ffffff',
        footerBgColor: '#1a2e05'
      }
    },
    {
      name: 'লাক্সারি ডার্ক এমারেল্ড',
      desc: 'স্নিগ্ধ আধুনিক সফট লাইট ক্যানভাস ও উজ্জ্বল পান্না এক্সেন্ট',
      settings: {
        primaryColor: '#10b981',
        secondaryColor: '#f59e0b',
        headingTextColor: '#022c22',
        bodyTextColor: '#475569',
        cardBgColor: '#ffffff',
        cardBorderColor: '#dcfce7',
        pageBgColor: '#f8fafc',
        headerBgColor: '#ffffff',
        footerBgColor: '#022c22'
      }
    }
  ];

  const handleApplyPreset = (presetSettings: Partial<SiteSettings>) => {
    onChangeSettings({
      ...settings,
      ...presetSettings
    });
  };

  const handleColorChange = (key: keyof SiteSettings, value: string) => {
    onChangeSettings({
      ...settings,
      [key]: value
    });
  };

  const colorFields: { key: keyof SiteSettings; label: string; desc: string; defaultVal: string }[] = [
    {
      key: 'primaryColor',
      label: 'প্রাইমারি কালার (Primary Brand Color)',
      desc: 'বাটন, হাইলাইট, ব্যাজ ও মূল ইসলামিক থিম রঙ',
      defaultVal: '#059669'
    },
    {
      key: 'secondaryColor',
      label: 'সেকেন্ডারি / গোল্ডেন কালার (Accent Color)',
      desc: 'সোনালী বর্ডার, হাইলাইট আইকন ও বিশেষ অ্যাকসেন্ট',
      defaultVal: '#d97706'
    },
    {
      key: 'headingTextColor',
      label: 'হেডিং ও শিরোনামের টেক্সট কালার',
      desc: 'বড় শিরোনাম, সেকশন টাইটেল ও কার্ড হেডিং টেক্সট',
      defaultVal: '#022c22'
    },
    {
      key: 'bodyTextColor',
      label: 'মূল বডি টেক্সট কালার (Body Text)',
      desc: 'প্যারাগ্রাফ, বর্ণনা ও সাধারণ লেখালেখির কালার',
      defaultVal: '#334155'
    },
    {
      key: 'cardBgColor',
      label: 'কার্ডের ব্যাকগ্রাউন্ড কালার',
      desc: 'প্রকল্প কার্ড, নোটিস কার্ড ও বক্সগুলোর ব্যাকগ্রাউন্ড',
      defaultVal: '#ffffff'
    },
    {
      key: 'cardBorderColor',
      label: 'কার্ডের বর্ডার ও ডিভাইডার কালার',
      desc: 'কার্ডের চারপাশের হালকা বর্ডার ও লাইন কালার',
      defaultVal: '#e2e8f0'
    },
    {
      key: 'pageBgColor',
      label: 'মূল পেজ ব্যাকগ্রাউন্ড কালার',
      desc: 'ওয়েবসাইটের সম্পূর্ণ বডি ও ক্যানভাস ব্যাকগ্রাউন্ড',
      defaultVal: '#f8fafc'
    },
    {
      key: 'headerBgColor',
      label: 'হেডার (Header/Navbar) ব্যাকগ্রাউন্ড',
      desc: 'উপরের মেনুবার ও ব্র্যান্ড লোগো ব্যাকগ্রাউন্ড',
      defaultVal: '#ffffff'
    },
    {
      key: 'footerBgColor',
      label: 'ফুটার (Footer) ব্যাকগ্রাউন্ড',
      desc: 'ওয়েবসাইটের নিচের মূল ফুটার সেকশনের ব্যাকগ্রাউন্ড',
      defaultVal: '#022c22'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold font-serif-bn text-slate-900 flex items-center gap-2">
            <Palette className="w-5 h-5 text-emerald-600" />
            <span>কালার and থিম কাস্টমাইজেশন</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-sans-bn mt-1">
            আপনার পছন্দের ইসলামিক কালার প্যালেট বেছে নিন অথবা প্রতিটি রঙের হেক্স কোড কাস্টমাইজ করুন
          </p>
        </div>

        <button
          onClick={onSave}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-serif-bn text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>থিম পরিবর্তন সেভ করুন</span>
        </button>
      </div>

      {/* 1-Click Color Presets */}
      <div>
        <h3 className="text-sm font-bold font-serif-bn text-slate-800 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>রেডিমেড ইসলামিক কালার প্রিসেট (১-ক্লিকে অ্যাপ্লাই):</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {presets.map((p, idx) => (
            <div
              key={idx}
              onClick={() => handleApplyPreset(p.settings)}
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-7 h-7 rounded-full shadow-xs border border-white shrink-0"
                  style={{ backgroundColor: p.settings.primaryColor }}
                />
                <div
                  className="w-5 h-5 rounded-full shadow-xs border border-white shrink-0 -ml-2"
                  style={{ backgroundColor: p.settings.secondaryColor }}
                />
                <div
                  className="w-5 h-5 rounded-full shadow-xs border border-slate-300 shrink-0 -ml-2"
                  style={{ backgroundColor: p.settings.footerBgColor }}
                />
                <h4 className="text-sm font-bold font-serif-bn text-slate-900 group-hover:text-emerald-700 transition-colors ml-1">
                  {p.name}
                </h4>
              </div>

              <p className="text-xs text-slate-500 font-sans-bn line-clamp-2">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Color Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
        <h3 className="text-sm font-bold font-serif-bn text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Sliders className="w-4 h-4 text-emerald-600" />
          <span>কাস্টম হেক্স কালার নির্বাচন:</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {colorFields.map((field) => {
            const currentVal = (settings[field.key] as string) || field.defaultVal;

            return (
              <div
                key={field.key}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between gap-3"
              >
                <div>
                  <label className="block text-xs font-bold font-serif-bn text-slate-800 mb-1">
                    {field.label}
                  </label>
                  <p className="text-[11px] text-slate-500 font-sans-bn mb-2">
                    {field.desc}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Color input box */}
                  <div className="relative shrink-0">
                    <input
                      type="color"
                      value={currentVal}
                      onChange={(e) => handleColorChange(field.key, e.target.value)}
                      className="w-11 h-11 rounded-xl cursor-pointer border border-slate-300 bg-white p-1 shadow-inner"
                    />
                  </div>

                  {/* Text Hex input */}
                  <div className="flex-1">
                    <input
                      type="text"
                      value={currentVal}
                      onChange={(e) => handleColorChange(field.key, e.target.value)}
                      placeholder="#059669"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 uppercase"
                    />
                  </div>

                  {/* Reset button */}
                  <button
                    type="button"
                    onClick={() => handleColorChange(field.key, field.defaultVal)}
                    title="ডিফল্ট রঙে ফেরত যান"
                    className="p-2 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-slate-200/70 transition-colors"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Sample Preview */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold font-serif-bn text-slate-800 flex items-center gap-2">
          <Eye className="w-4 h-4 text-emerald-600" />
          <span>লাইভ প্রিভিউ (আপনার বর্তমান থিম কেমন দেখাবে):</span>
        </h3>

        <div
          className="p-6 rounded-2xl border transition-all duration-300"
          style={{
            backgroundColor: settings.cardBgColor || '#ffffff',
            borderColor: settings.cardBorderColor || '#e2e8f0'
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md overflow-hidden"
              style={{
                backgroundColor: settings.primaryColor || '#059669',
                border: `2px solid ${settings.secondaryColor || '#d97706'}`
              }}
            >
              {settings.logoUrl ? (
                <img
                  src={formatDriveImageUrl(settings.logoUrl)}
                  alt="Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                '☪'
              )}
            </div>
            <div>
              <h4
                className="text-base font-bold font-serif-bn"
                style={{ color: settings.headingTextColor || '#022c22' }}
              >
                {settings.foundationName}
              </h4>
              <p
                className="text-xs font-sans-bn"
                style={{ color: settings.bodyTextColor || '#64748b' }}
              >
                {settings.slogan}
              </p>
            </div>
          </div>

          <p
            className="text-xs sm:text-sm font-sans-bn leading-relaxed mb-4"
            style={{ color: settings.bodyTextColor || '#334155' }}
          >
            এটি একটি নমুনা প্রিভিউ কার্ড। থিমের সকল বাটন, হেডলাইন ও কার্ডের রঙ তাৎক্ষণিক ওয়েবসাইটে কার্যকর হবে।
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded-xl text-white text-xs font-bold font-serif-bn shadow-xs cursor-default"
              style={{ backgroundColor: settings.primaryColor || '#059669' }}
            >
              প্রাইমারি অ্যাকশন বাটন
            </button>
            <span
              className="px-3 py-1 rounded-full text-xs font-bold font-serif-bn"
              style={{
                backgroundColor: `${settings.secondaryColor || '#d97706'}20`,
                color: settings.secondaryColor || '#d97706',
                border: `1px solid ${settings.secondaryColor || '#d97706'}50`
              }}
            >
              গোল্ডেন অ্যাকসেন্ট ব্যাজ
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
