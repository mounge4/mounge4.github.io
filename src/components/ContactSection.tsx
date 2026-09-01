import React, { useState } from 'react';
import { SiteSettings, ContactMessage } from '../types';
import { 
  Sparkles, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Send, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';

interface ContactSectionProps {
  settings: SiteSettings;
  onSubmitMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>) => Promise<boolean>;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  settings,
  onSubmitMessage
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setError('অনুগ্রহ করে নাম, ফোন নম্বর এবং বার্তা পূরণ করুন।');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const ok = await onSubmitMessage(formData);
      if (ok) {
        setSubmitted(true);
        setFormData({
          name: '',
          phone: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setError('বার্তা প্রেরণে সমস্যা হয়েছে।');
      }
    } catch (err: any) {
      setError(err.message || 'সমস্যা হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-50/50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold font-serif-bn mb-3 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>সরাসরি যোগাযোগ ও পরামর্শ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif-bn text-slate-900 tracking-tight mb-4">
            যোগাযোগ
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-sans-bn">
            যেকোনো জিজ্ঞাসা, পরামর্শ বা সহায়তার প্রয়োজনে আমাদের সাথে যোগাযোগ করুন
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Address */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-4">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold font-serif-bn text-slate-900 mb-1">কেন্দ্রীয় কার্যালয়</h4>
                <p className="text-xs sm:text-sm text-slate-600 font-sans-bn leading-relaxed">{settings.address}</p>
              </div>
            </div>

            {/* Phone & Hotline */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-4">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold font-serif-bn text-slate-900 mb-1">হটলাইন ও ফোন</h4>
                <p className="text-xs sm:text-sm text-slate-600 font-sans-bn">প্রধান নম্বর: <strong className="text-slate-800 font-sans">{settings.phone}</strong></p>
                {settings.altPhone && (
                  <p className="text-xs sm:text-sm text-slate-600 font-sans-bn">বিকল্প নম্বর: <strong className="text-slate-800 font-sans">{settings.altPhone}</strong></p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-4">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold font-serif-bn text-slate-900 mb-1">ইমেইল ঠিকানা</h4>
                <p className="text-xs sm:text-sm text-slate-600 font-sans-bn">{settings.email}</p>
              </div>
            </div>

            {/* WhatsApp Direct Action */}
            {settings.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-emerald-200" />
                  <div>
                    <h5 className="text-sm font-bold font-serif-bn">হোয়াটসঅ্যাপে সরাসরি বার্তা দিন</h5>
                    <p className="text-xs text-emerald-100">{settings.whatsapp}</p>
                  </div>
                </div>
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            )}

          </div>

          {/* Right: Message Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold font-serif-bn text-emerald-950">
                  বার্তা সফলভাবে গৃহীত হয়েছে!
                </h3>
                <p className="text-sm text-slate-600 font-sans-bn max-w-md mx-auto">
                  আপনার বার্তাটি আমাদের গুগল শিট ডাটাবেজে যুক্ত হয়েছে। অতি দ্রুত আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবেন।
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                >
                  নতুন আরেকটি বার্তা লিখুন
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold font-serif-bn text-slate-900 mb-4 pb-2 border-b border-slate-100">
                  আমাদের একটি বার্তা পাঠান
                </h3>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold font-serif-bn text-slate-700 mb-1">
                      আপনার নাম <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="নাম লিখুন"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 font-sans-bn"
                    />
                  </div>

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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold font-serif-bn text-slate-700 mb-1">
                      ইমেইল (ঐচ্ছিক)
                    </label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 font-sans-bn"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold font-serif-bn text-slate-700 mb-1">
                      বিষয়
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: প্রকল্প সহায়তা / মতামত"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 font-sans-bn"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold font-serif-bn text-slate-700 mb-1">
                    আপনার বার্তা বা বিস্তারিত তথ্য <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="এখানে আপনার বার্তা লিখুন..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 font-sans-bn"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-serif-bn text-base shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'প্রেরণ করা হচ্ছে...' : 'বার্তা প্রেরণ করুন'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
