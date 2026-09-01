import React, { useState } from 'react';
import { VolunteerItem, CustomFormField } from '../types';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  MapPin,
  Heart,
  User,
  Phone,
  Mail,
  Briefcase,
  Droplet
} from 'lucide-react';

interface VolunteerSectionProps {
  customFields?: CustomFormField[];
  divisions?: string[];
  interestAreas?: string[];
  onRegisterVolunteer: (vol: Omit<VolunteerItem, 'id' | 'joinedDate' | 'status'>) => Promise<boolean>;
}

const DEFAULT_DIVISIONS = [
  'ঢাকা',
  'চট্টগ্রাম',
  'রাজশাহী',
  'খুলনা',
  'বরিশাল',
  'সিলেট',
  'রংপুর',
  'ময়মনসিংহ'
];

const DEFAULT_INTEREST_AREAS = [
  'ত্রাণ বিতরণ ও জরুরি উদ্ধার',
  'চিকিৎসা ক্যাম্প ও রক্তদান',
  'কোরআন ও দ্বীনি শিক্ষা',
  'এতিমখানা ও শিশু যত্ন',
  'আইটি, মিডিয়া ও প্রচার',
  'অর্থ সংগ্রহ ও ক্যাম্পেইন',
  'অন্যান্য'
];

export const VolunteerSection: React.FC<VolunteerSectionProps> = ({ 
  customFields = [],
  divisions,
  interestAreas,
  onRegisterVolunteer 
}) => {
  const activeDivisions = (divisions && divisions.length > 0) ? divisions : DEFAULT_DIVISIONS;
  const activeInterestAreas = (interestAreas && interestAreas.length > 0) ? interestAreas : DEFAULT_INTEREST_AREAS;

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    division: activeDivisions[0] || 'ঢাকা',
    profession: '',
    bloodGroup: 'A+',
    interestArea: activeInterestAreas[0] || 'ত্রাণ বিতরণ ও জরুরি উদ্ধার',
    message: ''
  });

  const [extraAnswers, setExtraAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeVolunteerFields = customFields.filter(f => f.active && (f.formType === 'volunteer' || !f.formType));
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'জানা নেই'];

  const handleCustomFieldChange = (fieldId: string, val: string) => {
    setExtraAnswers(prev => ({
      ...prev,
      [fieldId]: val
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      setError('অনুগ্রহ করে নাম এবং মোবাইল নম্বর প্রদান করুন।');
      return;
    }

    // Check required custom fields
    for (const field of activeVolunteerFields) {
      if (field.required && (!extraAnswers[field.id] || !extraAnswers[field.id].trim())) {
        setError(`অনুগ্রহ করে "${field.label}" পূরণ করুন।`);
        return;
      }
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const ok = await onRegisterVolunteer({
        ...formData,
        district: formData.division, // maintain backward compatibility
        extraAnswers
      });

      if (ok) {
        setSubmitted(true);
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          address: '',
          division: activeDivisions[0] || 'ঢাকা',
          profession: '',
          bloodGroup: 'A+',
          interestArea: activeInterestAreas[0] || 'ত্রাণ বিতরণ ও জরুরি উদ্ধার',
          message: ''
        });
        setExtraAnswers({});
      } else {
        setError('আবেদন পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
      }
    } catch (err) {
      setError('সার্ভারে সমস্যা হয়েছে। ইন্টারনেট সংযোগ চেক করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="volunteer" className="py-12 sm:py-16 bg-white font-serif-bn">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-3 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>মানবতার সেবায় আপনার অংশগ্রহণ</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            স্বেচ্ছাসেবক হিসেবে যোগ দিন
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-sans-bn">
            আপনার মেধা, শ্রম ও সময় দিয়ে আর্তমানবতার সেবায় নিবেদিত এক আদর্শ কল্যাণসমাজ বিনির্মাণে আমাদের সহযোগী হোন
          </p>
        </div>

        {/* Success Alert */}
        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-300 rounded-3xl p-8 sm:p-10 text-center shadow-lg animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-700 text-white flex items-center justify-center mx-auto mb-4 shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-950 mb-2">
              জাযাকাল্লাহু খাইরান! আপনার আবেদন গৃহীত হয়েছে
            </h3>
            <p className="text-sm sm:text-base text-emerald-800 font-sans-bn max-w-xl mx-auto mb-6">
              আপনার তথ্য আমাদের কেন্দ্রীয় ডাটাবেসে সফলভাবে সংরক্ষিত হয়েছে। আমাদের ফিল্ড কো-অর্ডিনেটর শীঘ্রই আপনার সাথে যোগাযোগ করবেন।
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs font-serif-bn shadow-md transition-all cursor-pointer"
            >
              নতুন আবেদন করুন
            </button>
          </div>
        ) : (
          <div className="bg-slate-50/80 rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl">
            
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-sans-bn flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Row 1: Full Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 font-serif-bn">
                    পূর্ণ নাম <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="আপনার পূর্ণ নাম লিখুন"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 font-serif-bn">
                    মোবাইল নম্বর <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="০১৭XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-sans-bn focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Email & Profession */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 font-serif-bn">
                    ইমেইল এড্রেস (ঐচ্ছিক)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="example@mail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-sans-bn focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 font-serif-bn">
                    পেশা / কর্মসংস্থান
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="যেমন: শিক্ষার্থী, শিক্ষক, চাকরিজীবী, ব্যবসায়ী"
                      value={formData.profession}
                      onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Division (বিভাগ) & Blood Group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 font-serif-bn">
                    বিভাগ <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={formData.division}
                      onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs cursor-pointer"
                    >
                      {activeDivisions.map((div, i) => (
                        <option key={i} value={div}>{div} বিভাগ</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 font-serif-bn">
                    রক্তের গ্রুপ
                  </label>
                  <div className="relative">
                    <Droplet className="w-4 h-4 text-rose-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-sans-bn focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs cursor-pointer font-bold"
                    >
                      {bloodGroups.map((bg, i) => (
                        <option key={i} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 4: Interest Area (আগ্রহের খাত) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 font-serif-bn">
                  আগ্রহের খাত (কোন সেবামূলক কাজে অংশ নিতে চান?) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Heart className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={formData.interestArea}
                    onChange={(e) => setFormData({ ...formData, interestArea: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs cursor-pointer font-medium"
                  >
                    {activeInterestAreas.map((area, i) => (
                      <option key={i} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 5: Present Address */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 font-serif-bn">
                  বর্তমান ঠিকানা (থানা, জেলা ও বিস্তারিত)
                </label>
                <input
                  type="text"
                  placeholder="বাড়ি/গ্রাম, ডাকঘর, থানা..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs"
                />
              </div>

              {/* Custom Extra Fields from Admin */}
              {activeVolunteerFields.length > 0 && (
                <div className="pt-2 border-t border-slate-200/80 space-y-4">
                  <div className="text-xs font-bold text-slate-700 font-serif-bn">
                    অতিরিক্ত তথ্যাদি:
                  </div>
                  {activeVolunteerFields.map((field) => (
                    <div key={field.id}>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5 font-serif-bn">
                        {field.label} {field.required && <span className="text-rose-500">*</span>}
                      </label>
                      {field.fieldType === 'dropdown' && field.options ? (
                        <select
                          value={extraAnswers[field.id] || ''}
                          onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs cursor-pointer"
                        >
                          <option value="">-- নির্বাচন করুন --</option>
                          {field.options.map((opt, oIdx) => (
                            <option key={oIdx} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : field.fieldType === 'textarea' ? (
                        <textarea
                          rows={2}
                          placeholder={field.placeholder || ''}
                          value={extraAnswers[field.id] || ''}
                          onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs"
                        />
                      ) : (
                        <input
                          type={field.fieldType}
                          placeholder={field.placeholder || ''}
                          value={extraAnswers[field.id] || ''}
                          onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Message / Motivation */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 font-serif-bn">
                  আপনার মতামত বা প্রেরণা (ঐচ্ছিক)
                </label>
                <textarea
                  rows={3}
                  placeholder="কেন আপনি এই ফাউন্ডেশনের সাথে কাজ করতে চান..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm sm:text-base font-serif-bn shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'আবেদন পাঠানো হচ্ছে...' : 'স্বেচ্ছাসেবক আবেদন সম্পন্ন করুন'}</span>
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </section>
  );
};
