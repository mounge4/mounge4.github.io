import React, { useState } from 'react';
import { Lock, Key, Eye, EyeOff, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  currentPassword?: string;
  onClose: () => void;
  onSavePassword: (newPassword: string) => Promise<boolean> | void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  currentPassword = 'admin',
  onClose,
  onSavePassword
}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const cleanOld = String(oldPassword || '').trim();
    const cleanNew = String(newPassword || '').trim();
    const cleanConfirm = String(confirmPassword || '').trim();
    const expectedCurrent = String(currentPassword || 'admin').trim();

    if (!cleanOld) {
      setError('দয়া করে বর্তমান পাসওয়ার্ড লিখুন।');
      return;
    }

    // STRICT CHECK: Only exact current active password allowed. No backdoor/default bypass.
    if (cleanOld !== expectedCurrent) {
      setError('বর্তমান পাসওয়ার্ডটি সঠিক নয়! আপনার বর্তমান সক্রিয় পাসওয়ার্ডটি দিন।');
      return;
    }

    if (!cleanNew) {
      setError('দয়া করে নতুন পাসওয়ার্ড লিখুন।');
      return;
    }

    if (cleanNew.length < 4) {
      setError('নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।');
      return;
    }

    if (cleanNew === 'admin' || cleanNew === 'admin123') {
      setError('নিরাপত্তার স্বার্থে "admin" বা "admin123" পাসওয়ার্ড হিসেবে ব্যবহার করা যাবে না। একটি শক্তিশালী পাসওয়ার্ড দিন।');
      return;
    }

    if (cleanNew !== cleanConfirm) {
      setError('নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মিলছে না!');
      return;
    }

    if (cleanNew === cleanOld) {
      setError('নতুন পাসওয়ার্ড বর্তমান পাসওয়ার্ড থেকে আলাদা হতে হবে।');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSavePassword(cleanNew);
      setSuccess('এডমিন পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err?.message || 'পাসওয়ার্ড সংরক্ষণে সমস্যা হয়েছে।');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-serif-bn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-scale-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 pb-4 mb-5 border-b border-slate-100">
          <div className="w-11 h-11 rounded-2xl bg-emerald-950 text-emerald-300 flex items-center justify-center shadow-md shadow-emerald-950/20 shrink-0">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              এডমিন পাসওয়ার্ড পরিবর্তন
            </h3>
            <p className="text-xs text-slate-500 font-sans-bn">
              নিরাপত্তার জন্য শক্তিশালী ও নির্ভরযোগ্য পাসওয়ার্ড নির্ধারণ করুন
            </p>
          </div>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans-bn flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans-bn flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans-bn">
          {/* Current Password */}
          <div>
            <label className="block font-bold text-slate-800 mb-1.5 font-serif-bn">
              বর্তমান পাসওয়ার্ড <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showOld ? 'text' : 'password'}
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="বর্তমান পাসওয়ার্ড লিখুন"
                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-sans focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showOld ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
              >
                {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block font-bold text-slate-800 mb-1.5 font-serif-bn">
              নতুন পাসওয়ার্ড <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="কমপক্ষে ৪ অক্ষরের নতুন পাসওয়ার্ড"
                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-sans focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showNew ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block font-bold text-slate-800 mb-1.5 font-serif-bn">
              নতুন পাসওয়ার্ড নিশ্চিত করুন <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="নতুন পাসওয়ার্ডটি পুনরায় লিখুন"
                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-sans focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showConfirm ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Tips Box */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-[11px] text-emerald-900 leading-relaxed space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-950 font-serif-bn">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>জরুরি তথ্য:</span>
            </div>
            <p>
              পাসওয়ার্ড পরিবর্তন করার পর এটি স্বয়ংক্রিয়ভাবে লোকাল ডাটাবেজ এবং গুগল শিটে আপডেট হয়ে যাবে। নতুন পাসওয়ার্ডটি মনে রাখুন বা সুরক্ষিত স্থানে সংরক্ষণ করুন।
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold font-serif-bn transition-colors cursor-pointer"
            >
              বাতিল
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold font-serif-bn shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'সংরক্ষণ হচ্ছে...' : 'পাসওয়ার্ড সংরক্ষণ করুন'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
