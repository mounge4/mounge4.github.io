import React from 'react';
import { ChevronRight, Home, LucideIcon } from 'lucide-react';
import { SiteSettings } from '../types';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  category?: string;
  badgeIcon?: LucideIcon;
  onNavigateHome?: () => void;
  settings?: Partial<SiteSettings>;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  category,
  badgeIcon: BadgeIcon,
  onNavigateHome,
  settings,
}) => {
  const displayBadge = category || badge;
  const bgHeadingColor = settings?.headingTextColor || '#022c22';
  const accentColor = settings?.secondaryColor || '#d97706';

  return (
    <div 
      className="relative w-full py-10 sm:py-14 px-4 sm:px-6 lg:px-8 overflow-hidden text-white border-b shadow-sm mb-8"
      style={{
        backgroundColor: bgHeadingColor,
        borderBottomColor: `${accentColor}40`
      }}
    >
      {/* Decorative Islamic motif background watermark */}
      <div className="absolute right-4 -bottom-10 opacity-10 pointer-events-none select-none text-[180px] font-arabic leading-none">
        ۞
      </div>
      <div className="absolute left-6 top-2 opacity-5 pointer-events-none select-none text-[120px] font-arabic leading-none">
        ﷽
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Breadcrumb trail */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-emerald-200/90 mb-3 font-serif-bn">
          {onNavigateHome ? (
            <button 
              onClick={onNavigateHome}
              className="flex items-center gap-1 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>হোম</span>
            </button>
          ) : (
            <span className="flex items-center gap-1 text-emerald-200/80">
              <Home className="w-3.5 h-3.5" />
              <span>হোম</span>
            </span>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-emerald-400/60" />
          <span className="text-amber-300 font-semibold truncate">{title}</span>
        </nav>

        {displayBadge && (
          <span 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2"
            style={{
              backgroundColor: `${accentColor}30`,
              color: '#fef3c7',
              border: `1px solid ${accentColor}60`
            }}
          >
            {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5 text-amber-300" />}
            <span>{displayBadge}</span>
          </span>
        )}

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-serif-bn tracking-tight text-white mb-2">
          {title}
        </h1>

        {subtitle && (
          <p className="text-xs sm:text-sm md:text-base text-slate-200 font-sans-bn max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
