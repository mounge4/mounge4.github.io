import React, { useState } from 'react';
import { SiteSettings, DonationRecord } from '../types';
import { 
  Sparkles, 
  HeartHandshake, 
  CreditCard, 
  Copy, 
  Check, 
  Building2, 
  Smartphone, 
  ShieldCheck, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface JoinDonateSectionProps {
  settings: SiteSettings;
  selectedProject?: string;
  onSubmitDonationRecord: (record: Omit<DonationRecord, 'id' | 'date' | 'verified'>) => Promise<boolean>;
}

export const JoinDonateSection: React.FC<JoinDonateSectionProps> = ({
  settings,
  selectedProject,
  onSubmitDonationRecord
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    donorName: '',
    phone: '',
    amount: '',
    paymentMethod: 'bKash',
    transactionId: '',
    purpose: selectedProject || 'সাধারণ সদকা ও যাকাত তহবিল'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.donorName.trim() || !formData.amount || !formData.transactionId) {
      setError('অনুগ্রহ করে নাম, অনুদানের পরিমাণ এবং ট্রানজেকশন আইডি প্রদান করুন।');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const ok = await onSubmitDonationRecord({
        donorName: formData.donorName,
        phone: formData.phone,
        amount: Number(formData.amount) || 0,
        paymentMethod: formData.paymentMethod,
        transactionId: formData.transactionId,
        purpose: formData.purpose
      });

      if (ok) {
        setSubmitted(true);
        setFormData({
          donorName: '',
          phone: '',
          amount: '',
          paymentMethod: 'bKash',
          transactionId: '',
          purpose: 'সাধারণ সদকা ও যাকাত তহবিল'
        });
      } else {
        setError('তথ্য সংরক্ষণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }
    } catch (err: any) {
      setError(err.message || 'সমস্যা হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="join" className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold font-serif-bn mb-3 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>সদকায়ে জারিয়া ও আত্মশুদ্ধি</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif-bn text-slate-900 tracking-tight mb-4">
            যুক্ত হোন ও অনুদান দিন
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-sans-bn">
            আপনার যাকাত ও সদকার অর্থে বেঁচে থাকবে অসহায় মানুষ, হাসবে পিতৃহীন এতিম শিশু
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Bank & Mobile Banking Accounts */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Mobile Banking Box */}
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-rose-100 text-rose-700">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif-bn text-slate-900">মোবাইল ব্যাংকিং</h3>
                  <p className="text-xs text-slate-500 font-sans-bn">বিকাশ, নগদ ও রকেট এর মাধ্যমে সরাসরি অনুদান পাঠান</p>
                </div>
              </div>

              <div className="space-y-3">
                {/* bKash */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg bg-pink-600 text-white font-bold text-xs font-sans">
                      bKash
                    </span>
                    <div>
                      <p className="text-xs text-slate-500 font-sans-bn">বিকাশ নম্বর</p>
                      <p className="text-sm font-bold font-sans text-slate-800">{settings.bkashNumber}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(settings.bkashNumber, 'bkash')}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
                    title="কপি করুন"
                  >
                    {copiedKey === 'bkash' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Nagad */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-bold text-xs font-sans">
                      Nagad
                    </span>
                    <div>
                      <p className="text-xs text-slate-500 font-sans-bn">নগদ নম্বর</p>
                      <p className="text-sm font-bold font-sans text-slate-800">{settings.nagadNumber}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(settings.nagadNumber, 'nagad')}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
                    title="কপি করুন"
                  >
                    {copiedKey === 'nagad' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Rocket */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-bold text-xs font-sans">
                      Rocket
                    </span>
                    <div>
                      <p className="text-xs text-slate-500 font-sans-bn">রকেট নম্বর</p>
                      <p className="text-sm font-bold font-sans text-slate-800">{settings.rocketNumber}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(settings.rocketNumber, 'rocket')}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
                    title="কপি করুন"
                  >
                    {copiedKey === 'rocket' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Official Bank Account Box */}
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif-bn text-slate-900">অফিসিয়াল ব্যাংক একাউন্ট</h3>
                  <p className="text-xs text-slate-500 font-sans-bn">অনলাইন ও সরাসরি ব্যাংক ডিপোজিট</p>
                </div>
              </div>

              <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200/80 text-sm font-sans-bn">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">ব্যাংকের নাম:</span>
                  <strong className="text-slate-800 font-serif-bn">{settings.bankName}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">হিসাবের নাম:</span>
                  <strong className="text-slate-800 font-serif-bn">{settings.bankAccountName}</strong>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-slate-500">হিসাব নম্বর (A/C):</span>
                  <div className="flex items-center gap-2">
                    <strong className="text-emerald-700 font-mono text-base font-bold">{settings.bankAccountNumber}</strong>
                    <button
                      onClick={() => copyToClipboard(settings.bankAccountNumber, 'bank')}
                      className="p-1 rounded bg-slate-100 text-slate-600 hover:text-emerald-700"
                      title="কপি করুন"
                    >
                      {copiedKey === 'bank' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">শাখা (Branch):</span>
                  <strong className="text-slate-800">{settings.bankBranch}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">রাউটিং নম্বর:</span>
                  <strong className="font-mono text-slate-800">{settings.bankRouting}</strong>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Donation Notification / Information Form */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold font-serif-bn text-emerald-950">
                  আল্লাহ আপনার দান কবুল করুন!
                </h3>
                <p className="text-sm text-slate-600 font-sans-bn max-w-md mx-auto">
                  আপনার অনুদানের তথ্য সফলভাবে পাওয়া গেছে। আমাদের অর্থ বিভাগ তথ্য যাচাই করে আপনার মোবাইল নম্বরে নিশ্চিতকরণ বার্তা প্রেরণ করবে।
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                >
                  অন্য আরেকটি তথ্য জমা দিন
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold font-serif-bn text-slate-900">
                    অনুদান নিশ্চিতকরণ ফরম
                  </h3>
                  <p className="text-xs text-slate-500 font-sans-bn mb-4">
                    টাকা পাঠানোর পর নিচের তথ্যগুলো পূরণ করে পাঠিয়ে দিন, যেন আমরা আপনাকে রশিদ প্রদান করতে পারি।
                  </p>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold font-serif-bn text-slate-700 mb-1">
                    আপনার নাম / দাতার নাম <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মোঃ জাহিদ হাসান (অথবা গোপন রাখতে পারেন)"
                    value={formData.donorName}
                    onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 font-sans-bn"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold font-serif-bn text-slate-700 mb-1">
                      মোবাইল নম্বর <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="০১৭১২-XXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 font-sans-bn"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold font-serif-bn text-slate-700 mb-1">
                      অনুদানের পরিমাণ (টাকা) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="যেমন: ৫০০০"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 font-sans-bn font-bold text-emerald-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold font-serif-bn text-slate-700 mb-1">
                      টাকা পাঠানোর মাধ্যম
                    </label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 font-sans-bn"
                    >
                      <option value="bKash">বিকাশ (bKash)</option>
                      <option value="Nagad">নগদ (Nagad)</option>
                      <option value="Rocket">রকেট (Rocket)</option>
                      <option value="Bank Transfer">ব্যাংক ট্রান্সফার</option>
                      <option value="Cash / Office">সরাসরি অফিসে নগদ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold font-serif-bn text-slate-700 mb-1">
                      ট্রানজেকশন আইডি (TrxID) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: 8XJ928374"
                      value={formData.transactionId}
                      onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold font-serif-bn text-slate-700 mb-1">
                    অনুদানের খাত / উদ্দেশ্য
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: রমজান খাদ্য সহায়তা, এতিম প্রতিপালন, ইত্যাদি"
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 font-sans-bn"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-serif-bn text-base shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <HeartHandshake className="w-5 h-5 text-amber-300" />
                  <span>{isSubmitting ? 'জমা দেওয়া হচ্ছে...' : 'অনুদানের তথ্য প্রেরণ করুন'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
