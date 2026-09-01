import React from 'react';
import { SiteSettings } from '../types';
import { 
  Users, 
  Target, 
  Award, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  HeartHandshake,
  Compass,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { formatDriveImageUrl } from '../utils/imageHelper';

interface AboutSectionProps {
  settings: SiteSettings;
  onNavigate: (tab: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings, onNavigate }) => {
  // Ordered explicitly as: 1. Profile/Emblem Icon -> 2. Title -> 3. Details
  const aboutCards = [
    {
      id: 'about-card-1',
      iconEmoji: '🛡️',
      icon: <ShieldCheck className="w-8 h-8 text-emerald-700" />,
      title: '১০০% আমানতদারিতা ও শরিয়াহ স্বচ্ছতা',
      details: 'প্রতিটি দানের অর্থ সম্পূর্ণ শরিয়াহসম্মত খাতে এবং পাই-পাই হিসাবে যথাযথ সুবিধাবঞ্চিত মানুষের কাছে পৌঁছে দেওয়া হয়। আমাদের অভ্যন্তরীণ অডিট ও হিসাব উন্মুক্ত রাখা হয়।'
    },
    {
      id: 'about-card-2',
      iconEmoji: '🎯',
      icon: <Target className="w-8 h-8 text-emerald-700" />,
      title: 'সেমিনার ও ইসলাহী মাহফিল',
      details: 'কমাসিক ইসলাহী মাহফিল, ইসলামিক বই পাঠচক্র আয়োজন , যুব সেমিনার এবং পরিবার পরিকল্পনা বিষয়ক আলোচনা সভার আয়োজন করা হবে ইনশাআল্লাহ।'
    },
    {
      id: 'about-card-3',
      iconEmoji: '📖',
      icon: <BookOpen className="w-8 h-8 text-emerald-700" />,
      title:  'কুরআন শিক্ষা কার্যক্রম ',
      details:'প্রতি সপ্তাহে শিশু ও বড়দের জন্য কুরআন শিক্ষা ক্লাস, তাজবিদ সহ কুরআন তিলাওয়াত প্রশিক্ষণ এবং হিফজ ক্লাস পরিচালনা করা হবে ইনশাআল্লাহ।'
    },
    {
      id: 'about-card-4',
      iconEmoji: '🤝',
      icon: <HeartHandshake className="w-8 h-8 text-emerald-700" />,
      title: 'নিবেদিতপ্রাণ কর্মী ও স্বেচ্ছাসেবী দল',
      details: 'যেকোনো দুর্যোগ, বন্যা, অগ্নিকাণ্ড বা জরুরি পরিস্থিতিতে দ্রুততম সময়ে অসহায়দের সহায়তায় প্রস্তুত রয়েছে আমাদের প্রশিক্ষিত ও উদ্যমী স্বেচ্ছাসেবী বাহিনী।'
    },
    {
      id: 'about-card-5',
      iconEmoji: '🕌',
      icon: <Building2 className="w-8 h-8 text-emerald-700" />,
      title: 'সামাজিক সেবা',
      details: 'দরিদ্র ও অসহায় পরিবারদের সহায়তা, রমজান মাসে ইফতার বিতরণ,দরিদ্র শিক্ষার্থীদের শিক্ষা উপকরণ বিতরণ সহ সামাজিক সেবামুলক কাজের ক্যাম্প আয়োজন করা হয়।'
    },
    {
      id: 'about-card-6',
      iconEmoji: '🧭',
      icon: <Compass className="w-8 h-8 text-emerald-700" />,
      title: 'আদর্শ যুব সমাজ গঠন',
      details: 'তরুণ প্রজন্মকে পশ্চিমা অপসংস্কৃতি ও অনৈতিক কর্মকাণ্ড থেকে মুক্ত করে ইসলামের সুমহান আদর্শে দীক্ষি করা আমাদের অন্যতম লক্ষ্য ইনশাআল্লাহ।সর্বস্তরের মানুষের মাঝে ইসলামের মৌলিক ও জরুরি জ্ঞান (ফরজ ইলম) পৌঁছে দেওয়া এবং দ্বীন সম্পর্কে উদাসীনতা দূর করা। ফরজ সর্ম্পকে নূন্যতম জ্ঞান অর্জনে সহায়তা।পারস্পরিক সুসম্পর্ক ও মৈত্রীর বন্ধন সুদৃঢ় করার মাধ্যমে একটি সুশৃঙ্খল কমিউনিটি গড়ে তোলা।'
    }
  ];

  const stats = [
    { number: '', label: 'সুবিধাবঞ্চিত উপকারভোগী' },
    { number: '', label: 'সফল মানবিক প্রকল্প' },
    { number: '', label: 'সক্রিয় নিবন্ধিত স্বেচ্ছাসেবক' },
    { number: '২৪/৭', label: 'জরুরি সেবা ও হটলাইন' }
  ];

  return (
    <section id="about" className="py-12 sm:py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold font-serif-bn mb-3 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>দ্বীনের দাওয়াহ, ভ্রাতৃত্ব ও মানবসেবায় নিয়োজিত</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-serif-bn text-slate-900 tracking-tight mb-3">
            আমাদের সম্পর্কে
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-sans-bn leading-relaxed">
            একটি সামাজিক সেবা মূলক প্লাটফর্ম। এলাকার মুসলিমদের মাঝে ভ্রাতৃত্ব ও দ্বীনি সচেতনতা বৃদ্ধি করার পাশাপাশি নববী আদর্শে ঐক্যবদ্ধ করা এর অন্যতম লক্ষ্য ও উদ্দেশ্য।
          </p>
        </div>

        {/* Foundation Main Profile Highlight Card: 1. Profile Avatar -> 2. Title -> 3. Details */}
        <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl mb-14 border border-emerald-800/60 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 opacity-10 text-[180px] font-arabic select-none pointer-events-none">
            ۞
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            
            {/* 1. প্রথমে ছবি প্রোফাইল টাইপ (Profile Avatar Ring) */}
            <div className="shrink-0 flex flex-col items-center">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1.5 bg-gradient-to-tr from-amber-400 via-emerald-400 to-teal-200 shadow-2xl">
                <div className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-white flex items-center justify-center">
                  {settings.logoUrl ? (
                    <img
                      src={formatDriveImageUrl(settings.logoUrl)}
                      alt={settings.foundationName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl sm:text-5xl font-arabic text-emerald-800 select-none">☪</span>
                  )}
                </div>
              </div>
              <span className="mt-2.5 px-3 py-0.5 rounded-full bg-emerald-800/90 text-amber-300 text-xs font-semibold font-serif-bn border border-emerald-600">
                প্রতিষ্ঠা: {settings.establishedYear || '২০২০'}
              </span>
            </div>

            {/* 2. তারপর টাইটেল এবং 3. শেষে বিস্তারিত */}
            <div className="text-center md:text-left space-y-3 flex-1">
              {/* Title */}
              <h3 className="text-xl sm:text-3xl font-extrabold font-serif-bn text-white leading-tight">
                {settings.foundationName}
              </h3>
              
              <p className="text-xs sm:text-sm font-sans-bn text-amber-300 font-medium">
                {settings.slogan} • {settings.regNumber}
              </p>

              {/* Details */}
              <p className="text-xs sm:text-sm md:text-base text-slate-200 font-sans-bn leading-relaxed pt-1">
                <strong>{settings.foundationName}</strong> একটি সম্পূর্ণ অরাজনৈতিক, অলাভজনক ও দ্বীনি চেতনায় পরিচালিত মানবসেবামূলক প্রতিষ্ঠান। কিছু পরিকল্পনা কে সামনে রেখে প্রতিষ্ঠিত হয় 'স্টেশন পাড়া দাওয়াহ্ কমিউনিটি'। 'স্টেশন পাড়া দাওয়াহ্ কমিউনিটি' একটি সামাজিক সেবা মূলক প্লাটফর্ম। মুসলিমদের মাঝে ভ্রাতৃত্ব ও দ্বীনি সচেতনতা বৃদ্ধি করার পাশাপাশি নববী আদর্শে ঐক্যবদ্ধ করা এর অন্যতম লক্ষ্য ও উদ্দেশ্য। বিশেষ করে এটি ইলম অর্জনকে বিশেষ ভাবে প্রাধান্য দেয়। দ্বীনি সচেতনতা তৈরিতে এটি বিশেষ ভাবে ভূমিকা রাখবে বিভিন্ন কার্যক্রমের মাধ্যমে। বর্তমান সময়ে মুসলিম উম্মাহর অধঃপতন এর কারণ গুলোর অন্যতম একটি হলো ইসলাম সর্ম্পকে অজ্ঞ। অথবা বলতে পারেন ফরজ ইলমটুকু সর্ম্পকে গাফেল।

মানুষ মাত্রই পরোপকারী। সমাজে সব থেকে খারাপ মানুষটাও কোনো না কোনো ভাবে মানুষের সাহায্য সেবা করে থাকে বিভিন্ন ভাবে। এটার একটা বাস্তব উদাহরণ হলো একটি নষ্ট ঘড়ি। নষ্ট হলেও দিনে দুইবার সঠিক সময় প্রদান করে। সব থেকে বড় কথা অন্যের পাশে থাকা বিষয়ে ইসলাম আমাদের উদ্ভুদ্ধ করে। এটি আমাদের জন্য নেকীর কাজ। কোনো কাজে একক ভাবে কাউকে সহযোগিতা করলে যেমন মানুষের পাশে থাকা হয়। ঠিক একই কাজ যদি দল হয়ে একাধিক জন করি,তাহলে সেটি যেমন সহজ ভাবে সম্পন্ন হয়,তেমনি কাজে আনন্দ পাওয়া যায় এবং এটি সমাজের মানুষদের মাঝে ভ্রাতৃত্ব সৃষ্টি করে।

ইসলাম আমাদের একে অপরের সাথে সুসম্পর্ক বজায় রাখতে শেখায়। আমাদের কমিউনিটি এই ক্ষেত্রে অগ্রগামী ভূমিকা পালন করবে ইন শা আল্লাহ। বর্তমান সমাজ ব্যবস্থায় ইসলাম সমর্থন করে না এমন নানা কাজ ও আচার অনুষ্ঠান এর অনুপ্রবেশ ঘটেছে। যার মূল হোতা পশ্চিমা দেশগুলোকে বলা হয়। আমাদের জেনারেশন এর হাজারো যুবক এইসকল অপসংস্কৃতি তে অজান্তেই মত্ত হয়ে গিয়েছে। অতএব এগুলো বিতারিত করার জন্য এই যুবক জেনারেশন কে এগিয়ে আসতে হবে।
              </p>

              <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-3">
                <button
                  onClick={() => onNavigate('activities')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-serif-bn text-xs shadow-md transition-all cursor-pointer"
                >
                  আমাদের কার্যক্রমসমূহ
                </button>
                <button
                  onClick={() => onNavigate('volunteer')}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold font-serif-bn text-xs border border-emerald-600 transition-all cursor-pointer"
                >
                 সদস্য হোন
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Feature Cards Grid: Layout Pattern -> 1. Profile Icon -> 2. Title -> 3. Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-14">
          {aboutCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col items-center text-center group hover:-translate-y-1"
            >
              {/* 1. প্রথমে প্রোফাইল টাইপ আইকন (Profile-style circular icon with ring) */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-emerald-600 to-amber-300 shadow-md mb-4 group-hover:scale-105 transition-transform flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-emerald-50 border-2 border-white flex items-center justify-center">
                  {card.icon}
                </div>
              </div>

              {/* 2. তারপর টাইটেল (Title) */}
              <h4 className="text-base sm:text-lg font-bold font-serif-bn text-slate-900 mb-2.5 group-hover:text-emerald-700 transition-colors">
                {card.title}
              </h4>

              {/* 3. এবং শেষে বিস্তারিত (Details) */}
              <p className="text-xs sm:text-sm text-slate-600 font-sans-bn leading-relaxed">
                {card.details}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg border border-slate-800">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-700">
            {stats.map((st, idx) => (
              <div key={idx} className={idx > 0 ? 'pt-4 lg:pt-0' : ''}>
                <div className="text-2xl sm:text-4xl font-extrabold font-serif-bn text-amber-300 mb-1">
                  {st.number}
                </div>
                <div className="text-xs sm:text-sm text-slate-300 font-sans-bn">
                  {st.label}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
