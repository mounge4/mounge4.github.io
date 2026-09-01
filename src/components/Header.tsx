import React, { useState } from 'react';
import { SiteSettings } from '../types';
import { 
  Menu, 
  X, 
  HeartHandshake, 
  Lock, 
  RefreshCw, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { formatDriveImageUrl } from '../utils/imageHelper';

interface HeaderProps {
  settings: SiteSettings;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onOpenAdmin: () => void;
  onSync: () => void;
  isSyncing: boolean;
  lastSyncedAt: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  activeTab,
  onTabChange,
  onOpenAdmin,
  onSync,
  isSyncing,
  lastSyncedAt
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'হোম' },
    { id: 'about', label: 'আমাদের সম্পর্কে' },
    { id: 'activities', label: 'কার্যক্রমসমূহ' },
    { id: 'notices', label: 'নোটিস বোর্ড' },
    { id: 'members', label: 'পরিচালনা পরিষদ' },
    { id: 'blog', label: 'ইসলামিক ব্লগ' },
    { id: 'gallery', label: 'গ্যালারি' },
    { id: 'join', label: 'দান করুন' },
    { id: 'volunteer', label: 'স্বেচ্ছাসেবক' },
    { id: 'contact', label: 'যোগাযোগ' },
  ];

  const handleNavClick = (id: string) => {
    onTabChange(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header 
      id="main-site-header"
      className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-colors duration-200"
      style={{
        backgroundColor: settings.headerBgColor || '#ffffff',
        borderBottomColor: settings.cardBorderColor || '#e2e8f0'
      }}
    >
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[4.75rem] py-2 sm:py-2.5 md:py-0 md:h-22 gap-2 sm:gap-4">
          
          {/* Logo & Foundation Name: Icon on left -> Beside it Foundation Name on top & Slogan below */}
          <div 
            id="brand-logo-container"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-4 cursor-pointer group min-w-0 flex-1 xl:flex-initial"
          >
            {/* Islamic Emblem / Custom Logo */}
            <div 
              className="w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-white shadow-md transition-all duration-300 group-hover:scale-105 overflow-hidden shrink-0 border-2"
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
                    // Fallback to Islamic emblem
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-1 text-center select-none">
                  <span className="text-2xl sm:text-3xl leading-none font-arabic drop-shadow-xs">☪</span>
                </div>
              )}
            </div>

            {/* Foundation Name (Top) & Slogan (Directly below) */}
            <div className="flex flex-col justify-center min-w-0 flex-1">
              <h1 
                className="text-base sm:text-lg md:text-xl xl:text-2xl font-bold font-serif-bn tracking-tight leading-snug group-hover:opacity-90 transition-opacity break-words"
                style={{ color: settings.headingTextColor || '#022c22' }}
              >
                {settings.foundationName}
              </h1>
              {settings.slogan && (
                <p 
                  className="text-[11px] sm:text-xs md:text-sm font-sans-bn tracking-normal leading-tight mt-0.5 line-clamp-2 sm:line-clamp-1"
                  style={{ color: settings.bodyTextColor || '#64748b' }}
                >
                  {settings.slogan}
                </p>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all font-serif-bn cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'font-bold shadow-xs'
                      : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: `${settings.primaryColor || '#059669'}15`,
                          color: settings.primaryColor || '#059669',
                          borderBottom: `2.5px solid ${settings.primaryColor || '#059669'}`
                        }
                      : {}
                  }
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            {/* Sheet Live Sync Indicator button */}
            <button
              id="header-sync-btn"
              onClick={onSync}
              disabled={isSyncing}
              title={settings.scriptUrl ? 'গুগল শিট থেকে ডাটা রিফ্রেশ/সিঙ্ক করুন' : 'গুগল শিট কানেক্ট করতে এডমিন প্যানেলে যান'}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-600' : 'text-slate-500'}`} />
              <span className="font-sans-bn">
                {isSyncing ? 'সিঙ্ক হচ্ছে...' : 'শিট সিঙ্ক'}
              </span>
            </button>

            {/* Admin Control button */}
            <button
              id="header-admin-btn"
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-xs cursor-pointer"
              title="এডমিন কন্ট্রোল প্যানেল"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-sans-bn">এডমিন</span>
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-hidden border border-slate-200"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1.5 shadow-2xl max-h-[80vh] overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium font-serif-bn text-left transition-colors ${
                  isActive
                    ? 'font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: `${settings.primaryColor || '#059669'}15`,
                        color: settings.primaryColor || '#059669'
                      }
                    : {}
                }
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            );
          })}
          
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            {/* Admin login button in mobile menu */}
            <button
              id="mobile-drawer-admin-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white font-medium text-sm shadow-sm"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>এডমিন প্যানেলে প্রবেশ করুন</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
