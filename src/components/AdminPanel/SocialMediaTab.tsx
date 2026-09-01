import React, { useState } from 'react';
import { SocialLinkItem, SiteSettings } from '../../types';
import { 
  Share2, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  ExternalLink, 
  Check, 
  Copy, 
  Sparkles, 
  CheckCircle2, 
  ToggleLeft, 
  ToggleRight,
  Globe,
  MessageSquare,
  Facebook,
  Youtube,
  Send,
  Instagram,
  Twitter,
  Linkedin,
  Video,
  Eye,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';

interface SocialMediaTabProps {
  socialLinks: SocialLinkItem[];
  settings?: SiteSettings;
  onChangeSocialLinks: (links: SocialLinkItem[]) => void;
  onUpdateSettings?: (settings: SiteSettings) => void;
  onOpenSocialModal: (item?: SocialLinkItem) => void;
}

export const getSocialIconComponent = (platform: string, iconName?: string) => {
  const p = (platform || iconName || '').toLowerCase();
  if (p.includes('facebook') || p === 'fb') return Facebook;
  if (p.includes('youtube') || p === 'yt') return Youtube;
  if (p.includes('whatsapp') || p === 'wa') return MessageSquare;
  if (p.includes('telegram') || p === 'tg') return Send;
  if (p.includes('instagram') || p === 'ig') return Instagram;
  if (p.includes('twitter') || p.includes('x') || p === 'x.com') return Twitter;
  if (p.includes('linkedin')) return Linkedin;
  if (p.includes('tiktok')) return Video;
  return Globe;
};

export const getSocialPlatformColor = (platform: string) => {
  const p = (platform || '').toLowerCase();
  if (p.includes('facebook')) return { bg: 'bg-[#1877F2]', text: 'text-[#1877F2]', lightBg: 'bg-blue-50', border: 'border-blue-200' };
  if (p.includes('youtube')) return { bg: 'bg-[#FF0000]', text: 'text-[#FF0000]', lightBg: 'bg-rose-50', border: 'border-rose-200' };
  if (p.includes('whatsapp')) return { bg: 'bg-[#25D366]', text: 'text-[#25D366]', lightBg: 'bg-emerald-50', border: 'border-emerald-200' };
  if (p.includes('telegram')) return { bg: 'bg-[#229ED9]', text: 'text-[#229ED9]', lightBg: 'bg-sky-50', border: 'border-sky-200' };
  if (p.includes('instagram')) return { bg: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]', text: 'text-[#dc2743]', lightBg: 'bg-pink-50', border: 'border-pink-200' };
  if (p.includes('twitter') || p.includes('x')) return { bg: 'bg-black', text: 'text-slate-900', lightBg: 'bg-slate-100', border: 'border-slate-300' };
  if (p.includes('linkedin')) return { bg: 'bg-[#0A66C2]', text: 'text-[#0A66C2]', lightBg: 'bg-blue-50', border: 'border-blue-200' };
  if (p.includes('tiktok')) return { bg: 'bg-black', text: 'text-slate-900', lightBg: 'bg-slate-100', border: 'border-slate-300' };
  return { bg: 'bg-emerald-700', text: 'text-emerald-700', lightBg: 'bg-emerald-50', border: 'border-emerald-200' };
};

export const SocialMediaTab: React.FC<SocialMediaTabProps> = ({
  socialLinks = [],
  settings,
  onChangeSocialLinks,
  onUpdateSettings,
  onOpenSocialModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quick primary settings state
  const [quickFb, setQuickFb] = useState(settings?.facebookUrl || '');
  const [quickYt, setQuickYt] = useState(settings?.youtubeUrl || '');
  const [quickWa, setQuickWa] = useState(settings?.whatsapp || '');
  const [quickTg, setQuickTg] = useState(settings?.telegramUrl || '');
  const [quickIg, setQuickIg] = useState(settings?.instagramUrl || '');
  const [quickTw, setQuickTw] = useState(settings?.twitterUrl || '');
  const [isSavedQuick, setIsSavedQuick] = useState(false);

  const activeLinks = socialLinks.filter(s => s.active);

  const filteredLinks = socialLinks.filter(item => {
    const matchSearch = !searchQuery.trim() || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchStatus = statusFilter === 'all' 
      ? true 
      : statusFilter === 'active' ? item.active : !item.active;

    return matchSearch && matchStatus;
  }).sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleToggleActive = (id: string, current: boolean) => {
    const updated = socialLinks.map(s => s.id === id ? { ...s, active: !current } : s);
    onChangeSocialLinks(updated);
  };

  const handleDelete = (id: string) => {
    const updated = socialLinks.filter(s => s.id !== id);
    onChangeSocialLinks(updated);
  };

  const handleCopy = (url: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleSaveQuickPrimary = (e: React.FormEvent) => {
    e.preventDefault();
    const newSettings: SiteSettings = {
      ...settings,
      facebookUrl: quickFb.trim(),
      youtubeUrl: quickYt.trim(),
      whatsapp: quickWa.trim(),
      telegramUrl: quickTg.trim(),
      instagramUrl: quickIg.trim(),
      twitterUrl: quickTw.trim()
    };
    if (onUpdateSettings && settings) {
      onUpdateSettings(newSettings);
    }

    // Also update existing socialLinks entries if matched
    let updatedList = [...socialLinks];
    const updateOrCreate = (platform: string, title: string, url: string, icon: string) => {
      if (!url) return;
      const idx = updatedList.findIndex(x => x.platform === platform);
      if (idx >= 0) {
        updatedList[idx] = { ...updatedList[idx], url, active: true };
      } else {
        updatedList.push({
          id: `soc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          platform,
          title,
          url,
          icon,
          active: true,
          order: updatedList.length + 1
        });
      }
    };

    if (quickFb) updateOrCreate('facebook', 'অফিসিয়াল ফেসবুক পেজ', quickFb.trim(), 'facebook');
    if (quickYt) updateOrCreate('youtube', 'অফিসিয়াল ইউটিউব চ্যানেল', quickYt.trim(), 'youtube');
    if (quickWa) updateOrCreate('whatsapp', 'হোয়াটসঅ্যাপ হেল্পলাইন', quickWa.trim().startsWith('http') ? quickWa.trim() : `https://wa.me/${quickWa.replace(/[^0-9]/g, '')}`, 'whatsapp');
    if (quickTg) updateOrCreate('telegram', 'টেলিগ্রাম ইসলামিক চ্যানেল', quickTg.trim(), 'telegram');
    if (quickIg) updateOrCreate('instagram', 'ইনস্টাগ্রাম অ্যাকাউন্ট', quickIg.trim(), 'instagram');
    if (quickTw) updateOrCreate('twitter', 'টুইটার (X) হ্যান্ডেল', quickTw.trim(), 'twitter');

    onChangeSocialLinks(updatedList);

    setIsSavedQuick(true);
    setTimeout(() => setIsSavedQuick(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in font-serif-bn">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-emerald-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
              <Share2 className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-white">সোশ্যাল মিডিয়া ও প্ল্যাটফর্ম লিংক</h2>
          </div>
          <p className="text-xs text-emerald-200/90 font-sans-bn max-w-2xl">
            ওয়েবসাইটের হেডার, ফুটার, যোগাযোগ পেজ ও এআই চ্যাটবটে প্রদর্শিত সোশ্যাল মিডিয়া লিংক আপডেট করুন এবং নতুন প্ল্যাটফর্ম যুক্ত করুন।
          </p>
        </div>

        <button
          onClick={() => onOpenSocialModal()}
          className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-bold font-serif-bn shadow-lg hover:shadow-amber-400/20 flex items-center gap-2 transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন সোশ্যাল প্ল্যাটফর্ম যুক্ত করুন</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-sans-bn block mb-1">মোট সোশ্যাল প্ল্যাটফর্ম</span>
          <p className="text-2xl font-bold text-slate-900 font-mono">{socialLinks.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-emerald-200 bg-emerald-50/40 shadow-2xs">
          <span className="text-[11px] text-emerald-700 font-sans-bn block mb-1">সক্রিয় (Active) চ্যানেল</span>
          <p className="text-2xl font-bold text-emerald-700 font-mono">{activeLinks.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-sans-bn block mb-1">ফেসবুক ও ইউটিউব</span>
          <p className="text-xs font-bold text-slate-700 mt-1 truncate">
            {settings?.facebookUrl ? '✅ ফেসবুক যুক্ত' : '⚠️ ফেসবুক বাকি'}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-sans-bn block mb-1">হোয়াটসঅ্যাপ হেল্পলাইন</span>
          <p className="text-xs font-bold text-emerald-600 mt-1 truncate">
            {settings?.whatsapp || 'যুক্ত নেই'}
          </p>
        </div>
      </div>

      {/* Primary Channels Fast Setup Box */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">প্রধান সোশ্যাল মিডিয়া লিংক দ্রুত এডিট</h3>
          </div>
          {isSavedQuick && (
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              সংরক্ষিত হয়েছে!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveQuickPrimary} className="space-y-4 text-xs font-sans-bn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Facebook */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 font-bold text-slate-800 font-serif-bn">
                <Facebook className="w-4 h-4 text-[#1877F2]" />
                <span>ফেসবুক পেজ / গ্রুপ URL</span>
              </label>
              <input
                type="url"
                placeholder="https://facebook.com/..."
                value={quickFb}
                onChange={(e) => setQuickFb(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>

            {/* YouTube */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 font-bold text-slate-800 font-serif-bn">
                <Youtube className="w-4 h-4 text-[#FF0000]" />
                <span>ইউটিউব চ্যানেল URL</span>
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/@..."
                value={quickYt}
                onChange={(e) => setQuickYt(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>

            {/* WhatsApp */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 font-bold text-slate-800 font-serif-bn">
                <MessageSquare className="w-4 h-4 text-[#25D366]" />
                <span>হোয়াটসঅ্যাপ নম্বর / লিংক</span>
              </label>
              <input
                type="text"
                placeholder="+8801712345678 বা https://wa.me/..."
                value={quickWa}
                onChange={(e) => setQuickWa(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>

            {/* Telegram */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 font-bold text-slate-800 font-serif-bn">
                <Send className="w-4 h-4 text-[#229ED9]" />
                <span>টেলিগ্রাম চ্যানেল / গ্রুপ</span>
              </label>
              <input
                type="url"
                placeholder="https://t.me/..."
                value={quickTg}
                onChange={(e) => setQuickTg(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>

            {/* Instagram */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 font-bold text-slate-800 font-serif-bn">
                <Instagram className="w-4 h-4 text-[#dc2743]" />
                <span>ইনস্টাগ্রাম প্রোফাইল</span>
              </label>
              <input
                type="url"
                placeholder="https://instagram.com/..."
                value={quickIg}
                onChange={(e) => setQuickIg(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>

            {/* Twitter / X */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 font-bold text-slate-800 font-serif-bn">
                <Twitter className="w-4 h-4 text-slate-900" />
                <span>টুইটার (X) প্রোফাইল</span>
              </label>
              <input
                type="url"
                placeholder="https://x.com/..."
                value={quickTw}
                onChange={(e) => setQuickTw(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-serif-bn text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>প্রধান লিংকসমূহ সেভ ও সিঙ্ক করুন</span>
            </button>
          </div>
        </form>
      </div>

      {/* Dynamic Social Platforms Manager List */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-5">
        
        {/* Filter & Search Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">সকল সোশ্যাল মিডিয়া প্ল্যাটফর্ম তালিকা ({filteredLinks.length})</h3>
            <p className="text-xs text-slate-500 font-sans-bn">প্লাটফর্ম সক্রিয়/নিষ্ক্রিয় করুন, এডিট করুন অথবা নতুন যুক্ত করুন</p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="সার্চ করুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans-bn w-36 sm:w-48 focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            {/* Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif-bn cursor-pointer"
            >
              <option value="all">সকল অবস্থা</option>
              <option value="active">সক্রিয় (Active)</option>
              <option value="inactive">নিষ্ক্রিয় (Inactive)</option>
            </select>
          </div>
        </div>

        {/* Platforms Cards Grid */}
        {filteredLinks.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-sans-bn space-y-2">
            <Share2 className="w-10 h-10 mx-auto opacity-30" />
            <p>কোনো সোশ্যাল প্ল্যাটফর্ম লিংক পাওয়া যায়নি।</p>
            <button
              onClick={() => onOpenSocialModal()}
              className="mt-2 text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              + নতুন প্ল্যাটফর্ম লিংক যুক্ত করুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLinks.map((item) => {
              const IconComp = getSocialIconComponent(item.platform, item.icon);
              const colorTheme = getSocialPlatformColor(item.platform);

              return (
                <div
                  key={item.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-3 ${
                    item.active 
                      ? 'bg-white border-slate-200 shadow-2xs hover:border-emerald-300' 
                      : 'bg-slate-50/80 border-dashed border-slate-300 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Platform Icon with Authentic Branding */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0 ${colorTheme.bg}`}>
                        <IconComp className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 font-serif-bn truncate">
                            {item.title}
                          </h4>
                          {item.badgeText && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold shrink-0 font-sans-bn">
                              {item.badgeText}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5 max-w-[220px] sm:max-w-xs">
                          {item.url}
                        </p>
                      </div>
                    </div>

                    {/* Active/Inactive Switch */}
                    <button
                      onClick={() => handleToggleActive(item.id, item.active)}
                      className={`shrink-0 p-1 transition-colors cursor-pointer ${item.active ? 'text-emerald-600' : 'text-slate-400'}`}
                      title={item.active ? 'সক্রিয় আছে (ক্লিক করে নিষ্ক্রিয় করুন)' : 'নিষ্ক্রিয় আছে (ক্লিক করে সক্রিয় করুন)'}
                    >
                      {item.active ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
                    </button>
                  </div>

                  {/* Actions & Utilities Bar */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-mono">
                        ক্রম #{item.order || 1}
                      </span>
                      {item.active ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          সক্রিয়
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">নিষ্ক্রিয়</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Copy Link Button */}
                      <button
                        onClick={() => handleCopy(item.url, item.id)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                        title="লিংক কপি করুন"
                      >
                        {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      {/* Test Link Button */}
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
                        title="লিংকটি টেস্ট করুন (নতুন ট্যাবে ওপেন হবে)"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      {/* Edit Button */}
                      <button
                        onClick={() => onOpenSocialModal(item)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>এডিট</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                        title="ডিলিট করুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Live Preview Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-emerald-600" />
          <h3 className="text-base font-bold text-slate-900">ওয়েবসাইট ফুটার ও পেজ প্রিভিউ</h3>
        </div>
        
        {/* Footer Dark Preview Box */}
        <div 
          className="p-6 rounded-2xl text-white space-y-3"
          style={{ backgroundColor: settings?.footerBgColor || '#022c22' }}
        >
          <span className="text-[11px] text-amber-300 uppercase tracking-wider font-bold">
            ফুটার সেকশন সোশ্যাল আইকন প্রিভিউ
          </span>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {activeLinks.map((link) => {
              const Icon = getSocialIconComponent(link.platform, link.icon);
              return (
                <div
                  key={link.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-slate-100 transition-all text-xs font-serif-bn"
                >
                  <Icon className="w-4 h-4 text-amber-300" />
                  <span className="font-bold">{link.title}</span>
                  {link.badgeText && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-400/20 text-amber-300 font-sans-bn">
                      {link.badgeText}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
};
