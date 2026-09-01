import React from 'react';
import { SiteSettings, SocialLinkItem } from '../types';
import { 
  HeartHandshake, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Lock, 
  Facebook, 
  Youtube, 
  MessageSquare,
  ChevronRight,
  Shield,
  Send,
  Instagram,
  Twitter,
  Linkedin,
  Globe,
  Share2
} from 'lucide-react';
import { formatDriveImageUrl } from '../utils/imageHelper';

interface FooterProps {
  settings: SiteSettings;
  socialLinks?: SocialLinkItem[];
  onNavigate: (tabId: string) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  socialLinks = [],
  onNavigate,
  onOpenAdmin
}) => {
  const tabs = [
    { id: 'home', label: 'হোম পেজ' },
    { id: 'about', label: 'আমাদের সম্পর্কে' },
    { id: 'activities', label: 'কার্যক্রমসমূহ' },
    { id: 'notices', label: 'নোটিস বোর্ড' },
    { id: 'members', label: 'পরিচালনা পরিষদ' },
    { id: 'blog', label: 'ইসলামিক ব্লগ ও প্রবন্ধ' },
    { id: 'gallery', label: 'ফটোগ্যালারি' },
    { id: 'join', label: 'যুক্ত হোন ও দান করুন' },
    { id: 'volunteer', label: 'স্বেচ্ছাসেবক নিবন্ধন' },
    { id: 'contact', label: 'যোগাযোগ' }
  ];

  const quickProjects = [
    { label: 'রমজান খাদ্য সহায়তা', tab: 'activities' },
    { label: 'এতিম শিশু প্রতিপালন', tab: 'activities' },
    { label: 'বিনামূল্যে স্বাস্থ্যসেবা', tab: 'activities' },
    { label: 'বিশুদ্ধ খাবার পানি প্রকল্প', tab: 'activities' }
  ];

  // Prepare displayable social links
  const activeSocials = (socialLinks && socialLinks.length > 0)
    ? socialLinks.filter(s => s.active && s.url)
    : [
        settings.facebookUrl ? { id: 'fb', platform: 'facebook', title: 'ফেসবুক', url: settings.facebookUrl, active: true } : null,
        settings.youtubeUrl ? { id: 'yt', platform: 'youtube', title: 'ইউটিউব', url: settings.youtubeUrl, active: true } : null,
        settings.whatsapp ? { id: 'wa', platform: 'whatsapp', title: 'হোয়াটসঅ্যাপ', url: `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`, active: true } : null
      ].filter(Boolean) as SocialLinkItem[];

  const renderSocialIcon = (item: SocialLinkItem) => {
    const p = item.platform?.toLowerCase();
    if (p === 'facebook') return <Facebook className="w-4 h-4" />;
    if (p === 'youtube') return <Youtube className="w-4 h-4" />;
    if (p === 'whatsapp') return <MessageSquare className="w-4 h-4" />;
    if (p === 'telegram') return <Send className="w-4 h-4" />;
    if (p === 'instagram') return <Instagram className="w-4 h-4" />;
    if (p === 'twitter') return <Twitter className="w-4 h-4" />;
    if (p === 'linkedin') return <Linkedin className="w-4 h-4" />;
    if (p === 'website') return <Globe className="w-4 h-4" />;
    return <Share2 className="w-4 h-4" />;
  };

  const getPlatformHoverBg = (platform: string) => {
    const p = platform?.toLowerCase();
    if (p === 'facebook') return 'hover:bg-blue-600';
    if (p === 'youtube') return 'hover:bg-red-600';
    if (p === 'whatsapp') return 'hover:bg-emerald-600';
    if (p === 'telegram') return 'hover:bg-sky-500';
    if (p === 'instagram') return 'hover:bg-pink-600';
    if (p === 'twitter') return 'hover:bg-slate-900';
    if (p === 'linkedin') return 'hover:bg-blue-700';
    return 'hover:bg-emerald-600';
  };

  return (
    <footer 
      id="main-site-footer"
      className="text-white pt-16 pb-12 border-t border-emerald-900/50 transition-colors"
      style={{ backgroundColor: settings.footerBgColor || '#022c22' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Foundation Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center border overflow-hidden shrink-0"
                style={{
                  backgroundColor: settings.primaryColor || '#059669',
                  borderColor: settings.secondaryColor || '#d97706'
                }}
              >
                {settings.logoUrl ? (
                  <img
                    src={formatDriveImageUrl(settings.logoUrl)}
                    alt={settings.foundationName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-xl font-arabic text-amber-300 select-none">☪</span>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold font-serif-bn text-white">{settings.foundationName}</h3>
                <p className="text-xs text-amber-300 font-sans-bn">{settings.slogan}</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 font-serif-bn leading-relaxed">
              মহানবী মুহাম্মদ সা.-এর আদর্শে অনুপ্রাণিত হয়ে ক্ষুধা, দারিদ্র্য ও অসহায়ত্ব দূরীকরণে পরিচালিত একটি অরাজনৈতিক ও সেবামূলক প্রতিষ্ঠান।
            </p>

            <div className="text-xs text-slate-300 font-sans-bn">
              <span className="text-emerald-300 font-semibold">{settings.regNumber}</span>
            </div>

            {/* Dynamic Social Icons */}
            {activeSocials.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {activeSocials.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    title={item.title}
                    className={`p-2.5 rounded-xl bg-white/10 text-slate-200 hover:text-white transition-all shadow-xs ${getPlatformHoverBg(item.platform)}`}
                    aria-label={item.title}
                  >
                    {renderSocialIcon(item)}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* All Tabs Shortcut */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold font-serif-bn text-white uppercase tracking-wider border-l-3 border-amber-400 pl-2">
              সকল মেনু ও পেজসমূহ
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => {
                      onNavigate(tab.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1.5 text-slate-300 hover:text-amber-300 font-serif-bn transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{tab.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Activities Shortcuts */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold font-serif-bn text-white uppercase tracking-wider border-l-3 border-amber-400 pl-2">
              প্রধান প্রকল্পসমূহ
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {quickProjects.map((p, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => {
                      onNavigate(p.tab);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-slate-300 hover:text-amber-300 font-serif-bn transition-colors cursor-pointer text-left"
                  >
                    {p.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3 space-y-3 text-xs sm:text-sm text-slate-300">
            <h4 className="text-sm font-bold font-serif-bn text-white uppercase tracking-wider border-l-3 border-amber-400 pl-2">
              যোগাযোগ
            </h4>
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-sans">{settings.phone}</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{settings.email}</span>
            </p>
          </div>

        </div>

        {/* Bottom copyright & Developer Info */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-sans-bn">
          <div className="flex items-center gap-3">
            <p>
              © {new Date().getFullYear()} {settings.foundationName}। সর্বস্বত্ব সংরক্ষিত।
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-300">ডেভলপার:</span>
            <a
              href="https://www.facebook.com/mdarifulislam15"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-emerald-800 text-amber-300 hover:text-amber-200 font-bold border border-white/10 hover:border-amber-400/30 transition-all shadow-xs"
            >
              <Facebook className="w-3.5 h-3.5 text-[#1877F2] bg-white rounded-full p-0.5" />
              <span>মোঃ আরিফুল ইসলাম</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
