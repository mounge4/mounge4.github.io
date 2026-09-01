import React, { useState, useEffect } from 'react';
import { 
  HeroSlide, 
  NoticeItem, 
  ActivityItem, 
  BlogPost, 
  MemberItem, 
  GalleryItem, 
  GalleryPhoto,
  CustomFormField,
  BotQnAItem,
  SocialLinkItem,
  MissionQuoteItem
} from '../../types';
import { 
  X, 
  Save, 
  Image as ImageIcon, 
  Video, 
  Plus, 
  Trash2, 
  Check, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { LOADING_PLACEHOLDER_IMAGE, LOADING_AVATAR_PLACEHOLDER } from '../../utils/imageHelper';

interface ModalWrapperProps {
  title: string;
  subtitle?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const ModalWrapper: React.FC<ModalWrapperProps> = ({
  title,
  subtitle,
  isOpen,
  onClose,
  children
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-emerald-950 text-white flex items-center justify-between border-b border-emerald-900">
          <div>
            <h3 className="text-lg font-bold font-serif-bn text-white flex items-center gap-2">
              <span>{title}</span>
            </h3>
            {subtitle && (
              <p className="text-xs text-emerald-200 font-sans-bn">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-emerald-900/60 hover:bg-rose-900 text-emerald-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1 font-serif-bn">
          {children}
        </div>

      </div>
    </div>
  );
};

/* ----------------- 1. SLIDE MODAL WINDOW ----------------- */
interface SlideModalProps {
  isOpen: boolean;
  slide: HeroSlide | null;
  onSave: (savedSlide: HeroSlide) => void;
  onClose: () => void;
}

export const SlideModal: React.FC<SlideModalProps> = ({ isOpen, slide, onSave, onClose }) => {
  const [formData, setFormData] = useState<HeroSlide>({
    id: `slide-${Date.now()}`,
    title: '',
    subtitle: '',
    imageUrl: '',
    videoUrl: '',
    ctaText: 'কার্যক্রম দেখুন',
    ctaLink: 'activities',
    active: true,
    order: 1
  });

  useEffect(() => {
    if (slide) {
      setFormData(slide);
    } else {
      setFormData({
        id: `slide-${Date.now()}`,
        title: '',
        subtitle: '',
        imageUrl: '',
        videoUrl: '',
        ctaText: 'কার্যক্রম দেখুন',
        ctaLink: 'activities',
        active: true,
        order: 1
      });
    }
  }, [slide, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <ModalWrapper
      title={slide ? 'স্লাইডার সম্পাদনা করুন' : 'নতুন স্লাইড যুক্ত করুন'}
      subtitle="১৬:৯ ইমেজ বা ইউটিউব ভিডিও সহ প্রধান হোম স্লাইড"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans-bn">
        <div>
          <label className="block font-bold text-slate-800 mb-1 font-serif-bn">
            স্লাইডের প্রধান শিরোনাম <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="যেমন: আর্তমানবতার সেবায় নিবেদিত এক বিশ্বস্ত ঠিকানা"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-800 mb-1 font-serif-bn">উপ-শিরোনাম / বার্তা</label>
          <textarea
            rows={2}
            placeholder="মহানবী মুহাম্মদ সা.-এর আদর্শে অনুপ্রাণিত হয়ে ক্ষুধা ও দারিদ্র্য দূরীকরণে আমাদের উদ্যোগ..."
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">ছবির লিঙ্ক (URL)</label>
            <input
              type="url"
              placeholder="গুগল ড্রাইভ বা ডিরেক্ট ছবি লিঙ্ক"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">ইউটিউব ভিডিও লিঙ্ক (ঐচ্ছিক)</label>
            <input
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={formData.videoUrl || ''}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">বাটনের লেখা</label>
            <input
              type="text"
              value={formData.ctaText}
              onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">বাটনের টার্গেট পেজ</label>
            <select
              value={formData.ctaLink}
              onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500"
            >
              <option value="activities">কার্যক্রমসমূহ (Activities)</option>
              <option value="join">দান করুন (Donate)</option>
              <option value="volunteer">স্বেচ্ছাসেবক (Volunteer)</option>
              <option value="notices">নোটিস বোর্ড (Notices)</option>
              <option value="about">আমাদের সম্পর্কে (About Us)</option>
              <option value="contact">যোগাযোগ (Contact)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span className="font-bold font-serif-bn text-slate-800 text-sm">স্লাইডটি লাইভ ওয়েবসাইটে সক্রিয় রাখুন</span>
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold font-serif-bn text-xs hover:bg-slate-200"
          >
            বাতিল
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-serif-bn text-xs shadow-md"
          >
            সংরক্ষণ করুন
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

/* ----------------- 2. NOTICE MODAL WINDOW ----------------- */
interface NoticeModalProps {
  isOpen: boolean;
  notice: NoticeItem | null;
  onSave: (savedNotice: NoticeItem) => void;
  onClose: () => void;
}

export const NoticeModal: React.FC<NoticeModalProps> = ({ isOpen, notice, onSave, onClose }) => {
  const [formData, setFormData] = useState<NoticeItem>({
    id: `notice-${Date.now()}`,
    title: '',
    description: '',
    date: new Date().toLocaleDateString('bn-BD'),
    isImportant: false,
    category: 'সাধারণ নোটিস',
    fileUrl: '',
    linkUrl: '',
    active: true
  });

  useEffect(() => {
    if (notice) {
      setFormData(notice);
    } else {
      setFormData({
        id: `notice-${Date.now()}`,
        title: '',
        description: '',
        date: new Date().toLocaleDateString('bn-BD'),
        isImportant: false,
        category: 'জরুরি নোটিস',
        fileUrl: '',
        linkUrl: '',
        active: true
      });
    }
  }, [notice, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <ModalWrapper
      title={notice ? 'নোটিস সম্পাদনা করুন' : 'নতুন নোটিস যুক্ত করুন'}
      subtitle="ওয়েবসাইটের নোটিস বোর্ডে প্রকাশের জন্য তথ্য পূরণ করুন"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans-bn">
        <div>
          <label className="block font-bold text-slate-800 mb-1 font-serif-bn">
            নোটিসের শিরোনাম <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="যেমন: মাহে রমজানের ফুড প্যাক বিতরণ কর্মসূচি..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">ক্যাটাগরি</label>
            <input
              type="text"
              placeholder="যেমন: জরুরি নোটিস, ইভেন্ট, স্বাস্থ্যসেবা"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif-bn focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">তারিখ</label>
            <input
              type="text"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif-bn focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-800 mb-1 font-serif-bn">পূর্ণাঙ্গ বিবরণ</label>
          <textarea
            rows={4}
            required
            placeholder="নোটিসের বিস্তারিত বিবরণ লিখুন..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">পিডিএফ / ফাইল ডাউনলোড লিঙ্ক (ঐচ্ছিক)</label>
            <input
              type="url"
              placeholder="https://..."
              value={formData.fileUrl || ''}
              onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">টার্গেট পেজ লিঙ্ক (ঐচ্ছিক)</label>
            <input
              type="text"
              placeholder="যেমন: activities বা volunteer"
              value={formData.linkUrl || ''}
              onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isImportant}
              onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
            />
            <span className="font-bold font-serif-bn text-amber-900 text-sm">জরুরি নোটিস হিসেবে হাইলাইট করুন</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span className="font-bold font-serif-bn text-slate-800 text-sm">সক্রিয়</span>
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold font-serif-bn text-xs hover:bg-slate-200"
          >
            বাতিল
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-serif-bn text-xs shadow-md"
          >
            সংরক্ষণ করুন
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

/* ----------------- 3. ACTIVITY MODAL WINDOW ----------------- */
interface ActivityModalProps {
  isOpen: boolean;
  activity: ActivityItem | null;
  onSave: (savedActivity: ActivityItem) => void;
  onClose: () => void;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({ isOpen, activity, onSave, onClose }) => {
  const [formData, setFormData] = useState<ActivityItem>({
    id: `act-${Date.now()}`,
    title: '',
    category: 'খাদ্য সহায়তা',
    shortDesc: '',
    fullDesc: '',
    imageUrl: '',
    videoUrl: '',
    targetAmount: 100000,
    raisedAmount: 0,
    beneficiariesCount: 50,
    status: 'চলমান',
    location: 'ঢাকা',
    date: '২০২৬',
    featured: true
  });

  useEffect(() => {
    if (activity) {
      setFormData(activity);
    } else {
      setFormData({
        id: `act-${Date.now()}`,
        title: '',
        category: 'খাদ্য সহায়তা',
        shortDesc: '',
        fullDesc: '',
        imageUrl: '',
        videoUrl: '',
        targetAmount: 200000,
        raisedAmount: 50000,
        beneficiariesCount: 100,
        status: 'চলমান',
        location: 'ঢাকা ও দেশব্যাপী',
        date: '২০২৬',
        featured: true
      });
    }
  }, [activity, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <ModalWrapper
      title={activity ? 'কার্যক্রম / প্রজেক্ট সম্পাদনা' : 'নতুন কার্যক্রম / প্রজেক্ট যুক্ত করুন'}
      subtitle="১৬:৯ ইমেজ ও ভিডিও সহ সেবা প্রকল্পের সম্পূর্ণ বিবরণ"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans-bn">
        <div>
          <label className="block font-bold text-slate-800 mb-1 font-serif-bn">
            প্রকল্পের শিরোনাম <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="যেমন: পবিত্র মাহে রমজান ফুড প্যাক বিতরণ..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">ক্যাটাগরি</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif-bn focus:ring-2 focus:ring-emerald-500"
            >
              <option value="খাদ্য সহায়তা">খাদ্য সহায়তা</option>
              <option value="শিক্ষা ও কোরআন">শিক্ষা ও কোরআন</option>
              <option value="চিকিৎসা সেবা">চিকিৎসা সেবা</option>
              <option value="এতিম প্রতিপালন">এতিম প্রতিপালন</option>
              <option value="দুর্যোগ ত্রাণ">দুর্যোগ ত্রাণ</option>
              <option value="মসজিদ ও পানির প্রকল্প">মসজিদ ও পানির প্রকল্প</option>
              <option value="অন্যান্য">অন্যান্য</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">অবস্থা (Status)</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif-bn focus:ring-2 focus:ring-emerald-500"
            >
              <option value="চলমান">চলমান</option>
              <option value="আসন্ন">আসন্ন</option>
              <option value="সম্পন্ন">সম্পন্ন</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">এলাকা / জেলা</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif-bn focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">টার্গেট বাজেট (টাকা)</label>
            <input
              type="number"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">সংগৃহীত অনুদান (টাকা)</label>
            <input
              type="number"
              value={formData.raisedAmount}
              onChange={(e) => setFormData({ ...formData, raisedAmount: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">উপকারভোগী সংখ্যা</label>
            <input
              type="number"
              value={formData.beneficiariesCount}
              onChange={(e) => setFormData({ ...formData, beneficiariesCount: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">ছবির লিঙ্ক (URL - ১৬:৯)</label>
            <input
              type="url"
              placeholder="গুগল ড্রাইভ বা ডিরেক্ট ইমেজ লিঙ্ক"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">ইউটিউব ভিডিও লিঙ্ক (ঐচ্ছিক)</label>
            <input
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={formData.videoUrl || ''}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-800 mb-1 font-serif-bn">সংক্ষিপ্ত বিবরণ</label>
          <input
            type="text"
            placeholder="প্রকল্পের ১-২ লাইনের মূল সারাংশ"
            value={formData.shortDesc}
            onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-800 mb-1 font-serif-bn">সম্পূর্ণ বিবরণ ও প্রেক্ষাপট</label>
          <textarea
            rows={4}
            placeholder="প্রকল্পের বিস্তারিত লক্ষ্য ও কার্যক্রম বর্ণনা করুন..."
            value={formData.fullDesc}
            onChange={(e) => setFormData({ ...formData, fullDesc: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span className="font-bold font-serif-bn text-slate-800 text-sm">হোমপেজে ফিচার্ড প্রকল্প হিসেবে প্রদর্শন করুন</span>
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold font-serif-bn text-xs hover:bg-slate-200"
          >
            বাতিল
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-serif-bn text-xs shadow-md"
          >
            সংরক্ষণ করুন
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

/* ----------------- 4. MEMBER MODAL WINDOW ----------------- */
interface MemberModalProps {
  isOpen: boolean;
  member: MemberItem | null;
  onSave: (savedMember: MemberItem) => void;
  onClose: () => void;
}

export const MemberModal: React.FC<MemberModalProps> = ({ isOpen, member, onSave, onClose }) => {
  const [formData, setFormData] = useState<MemberItem>({
    id: `mem-${Date.now()}`,
    name: '',
    designation: '',
    category: 'কার্যনির্বাহী পরিষদ',
    photoUrl: '',
    bio: '',
    phone: '',
    email: '',
    order: 1,
    active: true
  });

  useEffect(() => {
    if (member) {
      setFormData(member);
    } else {
      setFormData({
        id: `mem-${Date.now()}`,
        name: '',
        designation: '',
        category: 'কার্যনির্বাহী পরিষদ',
        photoUrl: '',
        bio: '',
        phone: '',
        email: '',
        order: 1,
        active: true
      });
    }
  }, [member, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <ModalWrapper
      title={member ? 'সদস্যের তথ্য সম্পাদনা' : 'নতুন সদস্য / পরিষদ সদস্য যুক্ত করুন'}
      subtitle="পরিচালনা পর্ষদ, উপদেষ্টা বা সাধারণ সদস্যের বিবরণ"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans-bn">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">
              সদস্যের পুরো নাম <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="যেমন: মাওলানা আব্দুল্লাহ আল-মামুন"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">
              পদবি <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="যেমন: সভাপতি, সাধারণ সম্পাদক, নির্বাহী সদস্য"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">কমিটি ক্যাটাগরি</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500"
            >
              <option value="উপদেষ্টা পরিষদ">উপদেষ্টা পরিষদ</option>
              <option value="কার্যনির্বাহী পরিষদ">কার্যনির্বাহী পরিষদ</option>
              <option value="আজীবন সদস্য">আজীবন সদস্য</option>
              <option value="সাধারণ সদস্য">সাধারণ সদস্য</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">ক্রম নম্বর (Order)</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-800 mb-1 font-serif-bn">প্রোফাইল ছবির লিঙ্ক (URL)</label>
          <input
            type="url"
            placeholder="গুগল ড্রাইভ বা অনলাইন ফটো লিঙ্ক"
            value={formData.photoUrl}
            onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">মোবাইল নম্বর (ঐচ্ছিক)</label>
            <input
              type="text"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">ইমেইল (ঐচ্ছিক)</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-800 mb-1 font-serif-bn">সংক্ষিপ্ত পরিচয় / বার্তা</label>
          <textarea
            rows={2}
            placeholder="সদস্যের শিক্ষাগত যোগ্যতা বা সংক্ষিপ্ত পরিচয়..."
            value={formData.bio || ''}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span className="font-bold font-serif-bn text-slate-800 text-sm">সক্রিয়</span>
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold font-serif-bn text-xs hover:bg-slate-200"
          >
            বাতিল
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-serif-bn text-xs shadow-md"
          >
            সংরক্ষণ করুন
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

/* ----------------- 5. BLOG MODAL WINDOW ----------------- */
interface BlogModalProps {
  isOpen: boolean;
  blog: BlogPost | null;
  onSave: (savedBlog: BlogPost) => void;
  onClose: () => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({ isOpen, blog, onSave, onClose }) => {
  const [formData, setFormData] = useState<BlogPost>({
    id: `blog-${Date.now()}`,
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: 'ফাউন্ডেশন ডেস্ক',
    authorRole: 'গবেষক ও লেখক',
    date: new Date().toLocaleDateString('bn-BD'),
    category: 'মানবসেবা',
    imageUrl: '',
    videoUrl: '',
    tags: ['মানবসেবা', 'ইসলাম'],
    readTime: '৪ মিনিট'
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (blog) {
      setFormData(blog);
      setTagInput(blog.tags.join(', '));
    } else {
      setFormData({
        id: `blog-${Date.now()}`,
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        author: 'ফাউন্ডেশন ডেস্ক',
        authorRole: 'লেখক',
        date: new Date().toLocaleDateString('bn-BD'),
        category: 'মানবসেবা',
        imageUrl: '',
        videoUrl: '',
        tags: ['মানবসেবা', 'ইসলাম'],
        readTime: '৪ মিনিট'
      });
      setTagInput('মানবসেবা, ইসলাম');
    }
  }, [blog, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const parsedTags = tagInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    onSave({
      ...formData,
      slug: formData.slug || `post-${Date.now()}`,
      tags: parsedTags.length > 0 ? parsedTags : ['ইসলাম']
    });
    onClose();
  };

  return (
    <ModalWrapper
      title={blog ? 'ব্লগ বা প্রবন্ধ সম্পাদনা' : 'নতুন ইসলামিক ব্লগ বা প্রবন্ধ লিখুন'}
      subtitle="১৬:৯ ফিচার্ড ছবি, ভিডিও ও সম্পূর্ণ প্রবন্ধ"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans-bn">
        <div>
          <label className="block font-bold text-slate-800 mb-1 font-serif-bn">
            প্রবন্ধের শিরোনাম <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="যেমন: আর্তমানবতার সেবায় দান-সদকার ফজিলত ও তাৎপর্য"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">ক্যাটাগরি</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif-bn focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ইসলামী জীবন">ইসলামী জীবন</option>
              <option value="মানবসেবা">মানবসেবা</option>
              <option value="কোরআন ও হাদিস">কোরআন ও হাদিস</option>
              <option value="ফাউন্ডেশন সংবাদ">ফাউন্ডেশন সংবাদ</option>
              <option value="পরামর্শ">পরামর্শ</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">লেখকের নাম</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif-bn focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">পড়ার সময়</label>
            <input
              type="text"
              value={formData.readTime}
              onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif-bn focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">ফিচার্ড ছবির লিঙ্ক (১৬:৯)</label>
            <input
              type="url"
              placeholder="গুগল ড্রাইভ বা ইমেজ লিঙ্ক"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">ইউটিউব ভিডিও লিঙ্ক (ঐচ্ছিক)</label>
            <input
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={formData.videoUrl || ''}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-800 mb-1 font-serif-bn">ট্যাগসমূহ (কমা দিয়ে আলাদা করুন)</label>
          <input
            type="text"
            placeholder="দান, রমজান, সাদকা, শিক্ষা"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif-bn focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-800 mb-1 font-serif-bn">সংক্ষিপ্ত সারাংশ</label>
          <textarea
            rows={2}
            placeholder="ব্লগের ২ লাইনের মূল বক্তব্য..."
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-800 mb-1 font-serif-bn">সম্পূর্ণ আর্টিকেল / কনটেন্ট</label>
          <textarea
            rows={6}
            required
            placeholder="সম্পূর্ণ প্রবন্ধের বিস্তারিত লেখা..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold font-serif-bn text-xs hover:bg-slate-200"
          >
            বাতিল
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-serif-bn text-xs shadow-md"
          >
            সংরক্ষণ করুন
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

/* ----------------- 6. GALLERY MODAL WINDOW (ALBUM / TITLES & MULTI-PHOTOS) ----------------- */
interface GalleryModalProps {
  isOpen: boolean;
  item: GalleryItem | null;
  onSave: (savedItem: GalleryItem) => void;
  onClose: () => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({ isOpen, item, onSave, onClose }) => {
  const [formData, setFormData] = useState<GalleryItem>({
    id: `gal-${Date.now()}`,
    title: '',
    category: 'কার্যক্রম',
    imageUrl: '',
    images: [],
    videoUrl: '',
    date: '২০২৬',
    location: 'ঢাকা',
    description: ''
  });

  const [photosText, setPhotosText] = useState('');

  useEffect(() => {
    if (item) {
      setFormData(item);
      const formattedPhotos = (item.images || []).map(p => `${p.url}${p.caption ? ` | ${p.caption}` : ''}`).join('\n');
      setPhotosText(formattedPhotos);
    } else {
      setFormData({
        id: `gal-${Date.now()}`,
        title: '',
        category: 'কার্যক্রম',
        imageUrl: '',
        images: [],
        videoUrl: '',
        date: '২০২৬',
        location: 'ঢাকা',
        description: ''
      });
      setPhotosText('');
    }
  }, [item, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    // Parse multi photos text (Format: URL | Caption per line)
    const parsedImages: GalleryPhoto[] = [];
    if (photosText.trim()) {
      const lines = photosText.split('\n');
      lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (trimmed) {
          const parts = trimmed.split('|');
          const url = parts[0]?.trim();
          const caption = parts[1]?.trim() || formData.title;
          if (url) {
            parsedImages.push({
              id: `p-${idx + 1}`,
              url,
              caption
            });
          }
        }
      });
    }

    // If no extra photos listed, default to main imageUrl
    if (parsedImages.length === 0 && formData.imageUrl.trim()) {
      parsedImages.push({
        id: 'p-1',
        url: formData.imageUrl.trim(),
        caption: formData.title
      });
    }

    onSave({
      ...formData,
      images: parsedImages
    });
    onClose();
  };

  return (
    <ModalWrapper
      title={item ? 'গ্যালারি অ্যালবাম / টাইটেল সম্পাদনা' : 'নতুন ছবির অ্যালবাম / টাইটেল যুক্ত করুন'}
      subtitle="একটি টাইটেলের অধীনে একাধিক ছবি ও ক্যাপশন যুক্ত করুন (লম্বা স্ক্রোল ব্যতীত সহজ ভিউ)"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans-bn">
        <div>
          <label className="block font-bold text-slate-800 mb-1 font-serif-bn">
            অ্যালবাম / ইভেন্টের টাইটেল বা শিরোনাম <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="যেমন: বন্যার্তদের মাঝে খাদ্য ও বিশুদ্ধ পানি বিতরণ কর্মসূচি"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">ক্যাটাগরি</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif-bn focus:ring-2 focus:ring-emerald-500"
            >
              <option value="কার্যক্রম">কার্যক্রম</option>
              <option value="ত্রাণ বিতরণ">ত্রাণ বিতরণ</option>
              <option value="চিকিৎসা ক্যাম্প">চিকিৎসা ক্যাম্প</option>
              <option value="ইফতার ও খাদ্য">ইফতার ও খাদ্য</option>
              <option value="শিক্ষা কার্যক্রম">শিক্ষা কার্যক্রম</option>
              <option value="সম্মেলন">সম্মেলন</option>
              <option value="ভিডিও ডকুমেন্টারি">ভিডিও ডকুমেন্টারি</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">তারিখ</label>
            <input
              type="text"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif-bn focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">স্থান / জেলা</label>
            <input
              type="text"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif-bn focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-800 mb-1 font-serif-bn">
            কভার ছবির লিঙ্ক (Primary Cover Image URL - ১৬:৯)
          </label>
          <input
            type="url"
            placeholder="গুগল ড্রাইভ বা ইমেজ লিঙ্ক"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-800 mb-1 font-serif-bn">
            এই টাইটেলের অধীনস্থ একাধিক ছবি ও ক্যাপশন (প্রতি লাইনে: ছবির URL | ছবির ক্যাপশন):
          </label>
          <textarea
            rows={4}
            placeholder={'https://example.com/photo1.jpg | খাদ্যসামগ্রী লোড করার মুহূর্ত\nhttps://example.com/photo2.jpg | সুবিধাভোগীদের হাতে প্যাকেট হস্তান্তর\nhttps://example.com/photo3.jpg | শিশু ও বৃদ্ধদের মাঝে উপহার বিতরণ'}
            value={photosText}
            onChange={(e) => setPhotosText(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans-bn focus:ring-2 focus:ring-emerald-500"
          />
          <p className="text-[11px] text-slate-400 font-sans-bn mt-1">
            প্রতিটি লাইনে ছবির লিঙ্ক ও পাইপ চিহ্নের (|) পরে ক্যাপশন লিখুন।
          </p>
        </div>

        <div>
          <label className="block font-bold text-slate-800 mb-1 font-serif-bn">ইউটিউব ভিডিও লিঙ্ক (ঐচ্ছিক - দিলে ভিডিও প্লেয়ার লোড হবে)</label>
          <input
            type="url"
            placeholder="https://youtube.com/watch?v=..."
            value={formData.videoUrl || ''}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-800 mb-1 font-serif-bn">অ্যালবাম বিবরণ (ঐচ্ছিক)</label>
          <textarea
            rows={2}
            placeholder="এই কার্যক্রম বা অনুষ্ঠানের সংক্ষিপ্ত বিবরণ..."
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif-bn focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold font-serif-bn text-xs hover:bg-slate-200"
          >
            বাতিল
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-serif-bn text-xs shadow-md"
          >
            সংরক্ষণ করুন
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

/* ----------------- 7. CUSTOM FORM FIELD MODAL WINDOW ----------------- */
interface CustomFieldModalProps {
  isOpen: boolean;
  field: CustomFormField | null;
  onSave: (savedField: CustomFormField) => void;
  onClose: () => void;
}

export const CustomFieldModal: React.FC<CustomFieldModalProps> = ({ isOpen, field, onSave, onClose }) => {
  const [formData, setFormData] = useState<CustomFormField>({
    id: `cf-${Date.now()}`,
    formType: 'volunteer',
    label: '',
    fieldType: 'dropdown',
    placeholder: '',
    required: false,
    options: ['অপশন ১', 'অপশন ২'],
    order: 1,
    active: true
  });

  const [optionsText, setOptionsText] = useState('');

  useEffect(() => {
    if (field) {
      setFormData(field);
      setOptionsText((field.options || []).join('\n'));
    } else {
      setFormData({
        id: `cf-${Date.now()}`,
        formType: 'volunteer',
        label: '',
        fieldType: 'dropdown',
        placeholder: '',
        required: false,
        options: [],
        order: 1,
        active: true
      });
      setOptionsText('');
    }
  }, [field, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label.trim()) return;

    let parsedOptions: string[] | undefined = undefined;
    if (formData.fieldType === 'dropdown') {
      parsedOptions = optionsText
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0);
    }

    onSave({
      ...formData,
      options: parsedOptions
    });
    onClose();
  };

  return (
    <ModalWrapper
      title={field ? 'ফিল্ড / প্রশ্ন সম্পাদনা' : 'নতুন প্রশ্ন / ফিল্ড যুক্ত করুন'}
      subtitle="স্বেচ্ছাসেবক আবেদন ফর্মের অতিরিক্ত প্রশ্নাবলী তৈরি করুন"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans-bn">
        <div>
          <label className="block font-bold text-slate-800 mb-1 font-serif-bn">
            প্রশ্নের লেবেল / শিরোনাম <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="যেমন: শিক্ষাগত যোগ্যতা বা সপ্তাহে কত ঘণ্টা সময় দিতে পারবেন?"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">ফিল্ডের ধরন (Type)</label>
            <select
              value={formData.fieldType}
              onChange={(e) => setFormData({ ...formData, fieldType: e.target.value as any })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500"
            >
              <option value="dropdown">ড্রপডাউন অপশন তালিকা (Dropdown Select)</option>
              <option value="text">এক লাইনের টেক্সট (Text Box)</option>
              <option value="textarea">বড় বিবরণ (Textarea)</option>
              <option value="number">সংখ্যা (Number)</option>
              <option value="tel">ফোন নম্বর (Telephone)</option>
              <option value="email">ইমেইল (Email)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">প্লেসহোল্ডার টেক্সট (ঐচ্ছিক)</label>
            <input
              type="text"
              placeholder="যেমন: নির্বাচন করুন..."
              value={formData.placeholder || ''}
              onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {formData.fieldType === 'dropdown' && (
          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">
              ড্রপডাউনের অপশনসমূহ (প্রতি লাইনে একটি করে অপশন লিখুন):
            </label>
            <textarea
              rows={4}
              required
              placeholder={'মাধ্যমিক\nউচ্চ মাধ্যমিক\nস্নাতক\nস্নাতকোত্তর\nঅন্যান্য'}
              value={optionsText}
              onChange={(e) => setOptionsText(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        )}

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.required}
              onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
            />
            <span className="font-bold font-serif-bn text-slate-800 text-sm">বাধ্যতামূলক ফিল্ড (Required)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span className="font-bold font-serif-bn text-slate-800 text-sm">সক্রিয়</span>
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold font-serif-bn text-xs hover:bg-slate-200"
          >
            বাতিল
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-serif-bn text-xs shadow-md"
          >
            সংরক্ষণ করুন
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

/* ----------------- 8. BOT QNA MODAL WINDOW ----------------- */
interface BotQnAModalProps {
  isOpen: boolean;
  item: BotQnAItem | null;
  onSave: (savedItem: BotQnAItem) => void;
  onClose: () => void;
}

export const BotQnAModal: React.FC<BotQnAModalProps> = ({ isOpen, item, onSave, onClose }) => {
  const [formData, setFormData] = useState<BotQnAItem>({
    id: `bq-${Date.now()}`,
    question: '',
    answer: '',
    category: 'সাধারণ',
    quickMenu: true,
    order: 1,
    active: true
  });

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        id: `bq-${Date.now()}`,
        question: '',
        answer: '',
        category: 'সাধারণ',
        quickMenu: true,
        order: 1,
        active: true
      });
    }
  }, [item, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <ModalWrapper
      title={item ? 'প্রশ্নোত্তর সম্পাদনা' : 'নতুন ইসলামিক এআই প্রশ্নোত্তর যুক্ত করুন'}
      subtitle="গুগল শিট নলেজবেসে তাৎক্ষণিক সংরক্ষিত হবে এবং এআই সহকারী উত্তর হিসেবে প্রদান করবে"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans-bn">
        <div>
          <label className="block font-bold text-slate-800 mb-1 font-serif-bn">
            প্রশ্ন বা জিজ্ঞাস্য বিষয় <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="যেমন: দান বা যাকাত দেওয়ার বিকাশ নম্বর কত?"
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">ক্যাটাগরি বা বিষয়</label>
            <input
              type="text"
              placeholder="যেমন: দান ও যাকাত, কার্যক্রম, স্বেচ্ছাসেবক, যোগাযোগ"
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">ক্রম (Order)</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-800 mb-1 font-serif-bn">
            ইসলামিক এআই এর উত্তর <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={5}
            required
            placeholder="বিস্তারিত ও সুন্দর ইসলামিক ভাষায় উত্তর লিখুন..."
            value={formData.answer}
            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.quickMenu}
              onChange={(e) => setFormData({ ...formData, quickMenu: e.target.checked })}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
            />
            <span className="font-bold font-serif-bn text-slate-800 text-sm">
              ✨ চ্যাটবট মেনুতে কুইক বাটন হিসেবে দেখান
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span className="font-bold font-serif-bn text-slate-800 text-sm">সক্রিয়</span>
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold font-serif-bn text-xs hover:bg-slate-200"
          >
            বাতিল
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-serif-bn text-xs shadow-md"
          >
            সংরক্ষণ করুন
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

/* ---------------- SOCIAL LINK MODAL ---------------- */
export const SocialLinkModal: React.FC<{
  isOpen: boolean;
  item: SocialLinkItem | null;
  onSave: (item: SocialLinkItem) => void;
  onClose: () => void;
}> = ({ isOpen, item, onSave, onClose }) => {
  const [formData, setFormData] = useState<SocialLinkItem>({
    id: `soc-${Date.now()}`,
    platform: 'facebook',
    title: '',
    url: '',
    badgeText: '',
    icon: 'facebook',
    active: true,
    order: 1
  });

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        id: `soc-${Date.now()}`,
        platform: 'facebook',
        title: '',
        url: '',
        badgeText: '',
        icon: 'facebook',
        active: true,
        order: 1
      });
    }
  }, [item, isOpen]);

  const platformPresets: { key: string; name: string; icon: string; defaultBadge: string }[] = [
    { key: 'facebook', name: 'ফেসবুক পেজ / গ্রুপ', icon: 'facebook', defaultBadge: 'ফলো করুন' },
    { key: 'youtube', name: 'ইউটিউব চ্যানেল', icon: 'youtube', defaultBadge: 'ভিডিও ও আলোচনা' },
    { key: 'whatsapp', name: 'হোয়াটসঅ্যাপ হেল্পলাইন', icon: 'whatsapp', defaultBadge: 'সরাসরি চ্যাট' },
    { key: 'telegram', name: 'টেলিগ্রাম ইসলামিক চ্যানেল', icon: 'telegram', defaultBadge: 'জরুরি আপডেট' },
    { key: 'instagram', name: 'ইনস্টাগ্রাম অ্যাকাউন্ট', icon: 'instagram', defaultBadge: 'ফটোগ্যালারি' },
    { key: 'twitter', name: 'টুইটার / X হ্যান্ডেল', icon: 'twitter', defaultBadge: 'সংবাদ ও নোটিস' },
    { key: 'linkedin', name: 'লিংকডইন পেজ', icon: 'linkedin', defaultBadge: 'পেশাদার নেটওয়ার্ক' },
    { key: 'tiktok', name: 'টিকটক ইসলামিক ভিডিও', icon: 'tiktok', defaultBadge: 'শর্ট ভিডিও' },
    { key: 'website', name: 'কাস্টম ওয়েবসাইট / পোর্টাল', icon: 'globe', defaultBadge: 'ভিজিট করুন' },
    { key: 'other', name: 'অন্যান্য প্ল্যাটফর্ম', icon: 'share2', defaultBadge: 'যুক্ত হোন' }
  ];

  const handlePlatformSelect = (presetKey: string) => {
    const preset = platformPresets.find(p => p.key === presetKey);
    if (preset) {
      setFormData(prev => ({
        ...prev,
        platform: presetKey,
        title: prev.title || preset.name,
        icon: preset.icon,
        badgeText: prev.badgeText || preset.defaultBadge
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('অনুগ্রহ করে প্ল্যাটফর্মের নাম বা শিরোনাম লিখুন');
      return;
    }
    if (!formData.url.trim()) {
      alert('অনুগ্রহ করে প্ল্যাটফর্মের সঠিক URL প্রদান করুন');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <ModalWrapper
      title={item ? 'সোশ্যাল মিডিয়া লিংক সম্পাদনা' : 'নতুন সোশ্যাল প্ল্যাটফর্ম লিংক যুক্ত করুন'}
      subtitle="সংরক্ষণ করার সাথে সাথেই ওয়েবসাইটে ও ফুটার বারে লাইভ প্রদর্শিত হবে"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans-bn">
        
        {/* Platform Preset Selector */}
        <div>
          <label className="block font-bold text-slate-800 mb-1.5 font-serif-bn">
            প্ল্যাটফর্মের ধরন নির্বাচন করুন <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {platformPresets.map(preset => {
              const isSelected = formData.platform === preset.key;
              return (
                <button
                  type="button"
                  key={preset.key}
                  onClick={() => handlePlatformSelect(preset.key)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-sm">
                    {preset.key === 'facebook' && '📘'}
                    {preset.key === 'youtube' && '▶️'}
                    {preset.key === 'whatsapp' && '💬'}
                    {preset.key === 'telegram' && '✈️'}
                    {preset.key === 'instagram' && '📸'}
                    {preset.key === 'twitter' && '🐦'}
                    {preset.key === 'linkedin' && '💼'}
                    {preset.key === 'tiktok' && '🎵'}
                    {preset.key === 'website' && '🌐'}
                    {preset.key === 'other' && '🔗'}
                  </span>
                  <span className="truncate text-xs font-serif-bn">{preset.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Title / Name */}
        <div>
          <label className="block font-bold text-slate-800 mb-1 font-serif-bn">
            প্ল্যাটফর্মের নাম / শিরোনাম <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="যেমন: অফিসিয়াল ফেসবুক পেজ বা দাওয়াহ ইউটিউব চ্যানেল"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* URL */}
        <div>
          <label className="block font-bold text-slate-800 mb-1 font-serif-bn">
            সোশ্যাল মিডিয়া পেজ বা প্রোফাইল লিংক (URL) <span className="text-rose-500">*</span>
          </label>
          <input
            type="url"
            required
            placeholder="https://facebook.com/... বা https://youtube.com/..."
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Badge & Order */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">
              হাইলাইট ব্যাজ বা ট্যাগ (ঐচ্ছিক)
            </label>
            <input
              type="text"
              placeholder="যেমন: ১০০k+ ফলোয়ার, সরাসরি চ্যাট, অফিসিয়াল"
              value={formData.badgeText || ''}
              onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif-bn focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">
              প্রদর্শনের ক্রম (Order)
            </label>
            <input
              type="number"
              value={formData.order || 1}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Active Toggle */}
        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span className="font-bold font-serif-bn text-slate-800 text-sm">
              এই সোশ্যাল লিংকটি ওয়েবসাইটে সক্রিয় (Active) রাখুন
            </span>
          </label>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold font-serif-bn text-xs hover:bg-slate-200 cursor-pointer"
          >
            বাতিল
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-serif-bn text-xs shadow-md cursor-pointer"
          >
            সংরক্ষণ করুন
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

/* ----------------- 10. MISSION QUOTE / HADITH / QURAN MODAL WINDOW ----------------- */
interface MissionQuoteModalProps {
  isOpen: boolean;
  quoteItem: MissionQuoteItem | null;
  onSave: (savedQuote: MissionQuoteItem) => void;
  onClose: () => void;
}

export const MissionQuoteModal: React.FC<MissionQuoteModalProps> = ({
  isOpen,
  quoteItem,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState<MissionQuoteItem>({
    id: `mq-${Date.now()}`,
    category: 'হাদীস শরীফ',
    quote: '',
    arabicText: '',
    source: '',
    order: 1,
    active: true
  });

  useEffect(() => {
    if (quoteItem) {
      setFormData(quoteItem);
    } else {
      setFormData({
        id: `mq-${Date.now()}`,
        category: 'হাদীস শরীফ',
        quote: '',
        arabicText: '',
        source: '',
        order: 1,
        active: true
      });
    }
  }, [quoteItem, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.quote.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={quoteItem ? 'উক্তি / হাদীস / আয়াত সম্পাদনা' : 'নতুন উক্তি / হাদীস / আয়াত যোগ'}
      subtitle="ওয়েবসাইটের 'মূল দর্শন ও অঙ্গীকার' স্লাইডারে স্বয়ংক্রিয়ভাবে প্রদর্শিত হবে"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        
        {/* Category */}
        <div>
          <label className="block font-bold text-slate-800 mb-1 font-serif-bn">
            ক্যাটাগরি / ধরন <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.category || 'হাদীস শরীফ'}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif-bn focus:ring-2 focus:ring-emerald-500"
          >
            <option value="কুরআনের আয়াত">📖 কুরআনের আয়াত</option>
            <option value="হাদীস শরীফ">✨ হাদীস শরীফ</option>
            <option value="মহৎ উক্তি">💬 মহৎ উক্তি / উপদেশ</option>
            <option value="মূল অঙ্গীকার">🎯 মূল দর্শন ও অঙ্গীকার</option>
          </select>
        </div>

        {/* Bengali Quote / Translation */}
        <div>
          <label className="block font-bold text-slate-800 mb-1 font-serif-bn">
            বাংলা অর্থ / উক্তি / অঙ্গীকারের বক্তব্য <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            placeholder="যেমন: তোমরা সৎকর্ম ও তাকওয়ার কাজে পরস্পরকে সহযোগিতা কর..."
            value={formData.quote}
            onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif-bn focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Optional Arabic Text */}
        <div>
          <label className="block font-bold text-slate-800 mb-1 font-serif-bn">
            আরবি মূল পাঠ (ঐচ্ছিক - হাদিস বা আয়াতের মূল আরবি)
          </label>
          <input
            type="text"
            dir="rtl"
            placeholder="وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ..."
            value={formData.arabicText || ''}
            onChange={(e) => setFormData({ ...formData, arabicText: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-arabic focus:ring-2 focus:ring-emerald-500 text-right"
          />
        </div>

        {/* Source Reference */}
        <div>
          <label className="block font-bold text-slate-800 mb-1 font-serif-bn">
            উৎস / রেফারেন্স <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="যেমন: আল-কুরআন — সূরা আল-মায়েদা: ২ / সহীহ মুসলিম: ২৬৯৯"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif-bn focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Order & Active */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block font-bold text-slate-800 mb-1 font-serif-bn">
              প্রদর্শনের ক্রম (Order)
            </label>
            <input
              type="number"
              value={formData.order || 1}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-bold font-serif-bn text-slate-800 text-xs">
                স্লাইডারে সক্রিয় (Active) রাখুন
              </span>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold font-serif-bn text-xs hover:bg-slate-200 cursor-pointer"
          >
            বাতিল
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-serif-bn text-xs shadow-md cursor-pointer"
          >
            সংরক্ষণ করুন
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

