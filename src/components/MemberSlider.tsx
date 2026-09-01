import React, { useState } from 'react';
import { MemberItem } from '../types';
import { Sparkles, Mail, Phone, UserCheck } from 'lucide-react';
import { formatDriveImageUrl, LOADING_AVATAR_PLACEHOLDER } from '../utils/imageHelper';

interface MemberSliderProps {
  members: MemberItem[];
}

export const MemberSlider: React.FC<MemberSliderProps> = ({ members }) => {
  const activeMembers = members.filter(m => m.active);
  const [selectedCategory, setSelectedCategory] = useState<string>('সকল');

  const categories = ['সকল', 'উপদেষ্টা পরিষদ', 'কার্যনির্বাহী পরিষদ', 'সাধারণ সদস্য'];

  const filteredMembers = selectedCategory === 'সকল'
    ? activeMembers
    : activeMembers.filter(m => m.category === selectedCategory);

  return (
    <section id="members" className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold font-serif-bn mb-3 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>আমাদের পরিচালনা পর্ষদ ও দল</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-serif-bn text-slate-900 tracking-tight mb-3">
            সম্মানিত সদস্য ও নেতৃবৃন্দ
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-sans-bn">
            যাঁদের নিঃস্বার্থ দিকনির্দেশনা ও শ্রমে এগিয়ে চলেছে আমাদের এই মানবিক অভিযাত্রা
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold font-serif-bn transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Member Cards: "প্রথমে ছবি প্রোফাইল টাইপ, তারপর নাম , এবং পদবি" */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group hover:-translate-y-1"
            >
              {/* 1. প্রথমে ছবি প্রোফাইল টাইপ (গুগল RGB এনিমেটেড রোটেটিং রিং) */}
              <div className="relative mb-5">
                {/* Google RGB Animated Outer Ring */}
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-[3.5px] overflow-hidden flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <div 
                    className="absolute inset-[-50%] rounded-full google-rgb-spin"
                    style={{
                      background: 'conic-gradient(from 0deg, #4285F4 0deg, #EA4335 90deg, #FBBC05 180deg, #34A853 270deg, #4285F4 360deg)'
                    }}
                  />
                  {/* Inner Photo Container */}
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-white p-[2.5px] z-10">
                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-100">
                      <img
                        src={formatDriveImageUrl(member.photoUrl)}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = LOADING_AVATAR_PLACEHOLDER;
                        }}
                      />
                    </div>
                  </div>
                </div>
                <span className="absolute bottom-1 right-2 p-1.5 rounded-full bg-emerald-600 text-white shadow-xs z-20">
                  <UserCheck className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* 2. তারপর নাম */}
              <h3 className="text-lg sm:text-xl font-bold font-serif-bn text-slate-900 mb-1.5 group-hover:text-emerald-700 transition-colors">
                {member.name}
              </h3>

              {/* 3. এবং পদবি */}
              <p className="text-xs sm:text-sm font-semibold text-emerald-700 font-sans-bn bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 mb-3">
                {member.designation}
              </p>

              {/* Bio if available */}
              {member.bio && (
                <p className="text-xs text-slate-500 font-sans-bn line-clamp-2 mb-4 leading-relaxed">
                  {member.bio}
                </p>
              )}

              {/* Contact info badges */}
              <div className="mt-auto pt-3 border-t border-slate-100 w-full flex items-center justify-center gap-3 text-xs text-slate-400">
                {member.phone && (
                  <span className="flex items-center gap-1 hover:text-emerald-600">
                    <Phone className="w-3 h-3" />
                    <span className="font-sans">{member.phone}</span>
                  </span>
                )}
                {member.email && (
                  <span className="flex items-center gap-1 hover:text-emerald-600">
                    <Mail className="w-3 h-3" />
                    <span>ইমেইল</span>
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
