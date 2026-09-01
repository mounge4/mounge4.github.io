import React, { useState } from 'react';
import { CustomFormField, SiteSettings } from '../../types';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ToggleLeft, 
  ToggleRight, 
  ListOrdered,
  AlertCircle,
  HelpCircle,
  Sparkles,
  MapPin,
  Heart
} from 'lucide-react';

interface VolunteerFormTabProps {
  customFields: CustomFormField[];
  settings?: SiteSettings;
  onChangeCustomFields: (fields: CustomFormField[]) => void;
  onUpdateSettings?: (settings: SiteSettings) => void;
  onOpenFieldModal: (field?: CustomFormField) => void;
}

export const VolunteerFormTab: React.FC<VolunteerFormTabProps> = ({
  customFields = [],
  settings,
  onChangeCustomFields,
  onUpdateSettings,
  onOpenFieldModal
}) => {
  const volunteerFields = (customFields || []).filter(f => f.formType === 'volunteer' || !f.formType);

  const [interestAreas, setInterestAreas] = useState<string[]>(
    settings?.interestAreas || [
      'ত্রাণ বিতরণ ও জরুরি উদ্ধার',
      'চিকিৎসা ক্যাম্প ও রক্তদান',
      'কোরআন ও দ্বীনি শিক্ষা',
      'এতিমখানা ও শিশু যত্ন',
      'আইটি, মিডিয়া ও প্রচার',
      'অর্থ সংগ্রহ ও ক্যাম্পেইন',
      'অন্যান্য'
    ]
  );
  const [newInterest, setNewInterest] = useState('');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const [divisions, setDivisions] = useState<string[]>(
    settings?.divisions || [
      'ঢাকা',
      'চট্টগ্রাম',
      'রাজশাহী',
      'খুলনা',
      'বরিশাল',
      'সিলেট',
      'রংপুর',
      'ময়মনসিংহ'
    ]
  );

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 2500);
  };

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInterest.trim()) return;
    if (interestAreas.includes(newInterest.trim())) {
      showToast('এই আগ্রহের খাতটি ইতিমধ্যে বিদ্যমান রয়েছে');
      return;
    }
    const updated = [...interestAreas, newInterest.trim()];
    setInterestAreas(updated);
    setNewInterest('');
    if (onUpdateSettings) {
      onUpdateSettings({
        ...(settings || {} as SiteSettings),
        interestAreas: updated
      });
    }
    showToast('নতুন আগ্রহের খাত যুক্ত হয়েছে!');
  };

  const handleDeleteInterest = (item: string) => {
    const updated = interestAreas.filter(i => i !== item);
    setInterestAreas(updated);
    if (onUpdateSettings) {
      onUpdateSettings({
        ...(settings || {} as SiteSettings),
        interestAreas: updated
      });
    }
    showToast(`"${item}" আগ্রহের খাত ডিলিট করা হয়েছে`);
  };

  const handleDeleteField = (id: string) => {
    const target = customFields.find(f => f.id === id);
    const updated = customFields.filter(f => f.id !== id);
    onChangeCustomFields(updated);
    showToast(`ফিল্ড "${target?.label || ''}" ডিলিট করা হয়েছে`);
  };

  const handleToggleActive = (id: string) => {
    const updated = customFields.map(f => {
      if (f.id === id) {
        return { ...f, active: !f.active };
      }
      return f;
    });
    onChangeCustomFields(updated);
  };

  const getFieldTypeLabel = (type: string) => {
    switch (type) {
      case 'dropdown': return 'ড্রপডাউন অপশন তালিকা';
      case 'textarea': return 'বড় টেক্সট / বিবরণ (Textarea)';
      case 'tel': return 'ফোন / মোবাইল নম্বর';
      case 'email': return 'ইমেইল এড্রেস';
      case 'number': return 'সংখ্যা / নাম্বার';
      default: return 'এক লাইনের টেক্সট (Text)';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-serif-bn">
      
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <span>স্বেচ্ছাসেবক নিবন্ধন ফরম ও আগ্রহের খাত ব্যবস্থাপনা</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-sans-bn mt-1">
            বাংলাদেশের বিভাগসমূহ, আগ্রহের খাত এডিট এবং অতিরিক্ত কাস্টম প্রশ্ন নিয়ন্ত্রণ করুন
          </p>
        </div>

        {/* Modal Window Trigger Button */}
        <button
          onClick={() => onOpenFieldModal()}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন প্রশ্ন / ফিল্ড যুক্ত করুন</span>
        </button>
      </div>

      {saveToast && (
        <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-sans-bn flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-700" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* 1. EDITABLE VOLUNTEER INTEREST AREAS (আগ্রহের খাতসমূহ) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>আগ্রহের খাতসমূহ (Editable Sectors of Interest)</span>
            </h3>
            <p className="text-xs text-slate-500 font-sans-bn mt-0.5">
              স্বেচ্ছাসেবক আবেদন ফর্মে প্রদর্শিত আগ্রহের খাতের অপশনগুলো এখান থেকে যোগ, পরিমার্জন বা ডিলিট করুন
            </p>
          </div>
        </div>

        {/* Add New Interest Area Form */}
        <form onSubmit={handleAddInterest} className="flex gap-2 max-w-xl">
          <input
            type="text"
            placeholder="নতুন আগ্রহের খাত লিখুন (যেমন: রক্তদান ক্যাম্পেইন, মিডিয়া পাবলিকেশন)..."
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif-bn focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-serif-bn flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>যোগ করুন</span>
          </button>
        </form>

        {/* Interest Areas Badges */}
        <div className="flex flex-wrap gap-2 pt-2">
          {interestAreas.map((area, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-serif-bn shadow-2xs"
            >
              <span className="w-5 h-5 rounded-full bg-emerald-200/80 text-emerald-800 flex items-center justify-center text-[10px] font-bold">
                {idx + 1}
              </span>
              <span>{area}</span>
              <button
                type="button"
                onClick={() => handleDeleteInterest(area)}
                className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer p-0.5"
                title="মুছে ফেলুন"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. BANGLADESH DIVISIONS (বিভাগসমূহ) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>বাংলাদেশের বিভাগসমূহ (Divisions Dropdown)</span>
        </h3>
        <p className="text-xs text-slate-500 font-sans-bn">
          আবেদন ফর্মের জেলা ফিল্ডের পরিবর্তে ৮টি বিভাগ ড্রপডাউন আকারে যুক্ত করা হয়েছে:
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {divisions.map((div, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold font-serif-bn flex items-center gap-1.5"
            >
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px]">
                ✓
              </span>
              {div}
            </span>
          ))}
        </div>
      </div>

      {/* 3. ADDITIONAL CUSTOM FORM FIELDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-emerald-600" />
            <span>অতিরিক্ত কাস্টম প্রশ্নসমূহ ({volunteerFields.length}টি)</span>
          </h3>
        </div>

        {volunteerFields.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-400">
            <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-serif-bn text-slate-600">কোনো অতিরিক্ত কাস্টম ফিল্ড তৈরি করা হয়নি।</p>
            <p className="text-xs font-sans-bn text-slate-400 mt-1">প্রয়োজনে নতুন প্রশ্ন যুক্ত করতে উপরের বাটনে ক্লিক করুন।</p>
          </div>
        ) : (
          volunteerFields.map((field, idx) => (
            <div
              key={field.id}
              className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all ${
                field.active ? 'border-slate-200 shadow-xs' : 'border-slate-200/60 bg-slate-50/70 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs font-serif-bn shrink-0">
                    {idx + 1}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm sm:text-base font-bold font-serif-bn text-slate-900">
                        {field.label}
                      </h4>
                      {field.required ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                          বাধ্যতামূলক
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">
                          ঐচ্ছিক
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-medium font-sans-bn">
                        {getFieldTypeLabel(field.fieldType)}
                      </span>
                    </div>

                    {field.placeholder && (
                      <p className="text-xs text-slate-500 font-sans-bn mt-1">
                        প্লেসহোল্ডার: "{field.placeholder}"
                      </p>
                    )}

                    {field.fieldType === 'dropdown' && field.options && field.options.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap mt-2">
                        <span className="text-[11px] text-slate-400 font-sans-bn">অপশনসমূহ:</span>
                        {field.options.map((opt, oIdx) => (
                          <span
                            key={oIdx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-sans-bn border border-slate-200"
                          >
                            {opt}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions: Active Toggle, Edit Modal, Delete */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleToggleActive(field.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-serif-bn transition-all cursor-pointer ${
                      field.active
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {field.active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    <span>{field.active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</span>
                  </button>

                  <button
                    onClick={() => onOpenFieldModal(field)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                    title="সম্পাদনা করুন"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteField(field.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="ডিলিট করুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
