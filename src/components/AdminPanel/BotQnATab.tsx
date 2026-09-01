import React, { useState } from 'react';
import { BotQnAItem, SiteSettings } from '../../types';
import { 
  Bot, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  HelpCircle, 
  Sparkles, 
  Check, 
  X, 
  ToggleLeft, 
  ToggleRight, 
  Send,
  MessageSquare,
  BookOpen,
  Settings,
  ListOrdered
} from 'lucide-react';
import { generateIslamicAIResponse } from '../../services/aiKnowledgeEngine';

interface BotQnATabProps {
  botQnA: BotQnAItem[];
  settings?: SiteSettings;
  onChangeBotQnA: (items: BotQnAItem[]) => void;
  onUpdateSettings?: (settings: SiteSettings) => void;
  onOpenQnAModal: (item?: BotQnAItem) => void;
}

export const BotQnATab: React.FC<BotQnATabProps> = ({
  botQnA = [],
  settings,
  onChangeBotQnA,
  onUpdateSettings,
  onOpenQnAModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('সকল');
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [welcomeText, setWelcomeText] = useState(settings?.botWelcomeMsg || '');
  const [botTitle, setBotTitle] = useState(settings?.botTitle || 'ইসলামিক এআই সহকারী');
  const [isSavedWelcome, setIsSavedWelcome] = useState(false);

  const categories = ['সকল', ...Array.from(new Set((botQnA || []).map(q => q.category || 'সাধারণ')))];

  const filteredItems = (botQnA || []).filter(q => {
    const matchCat = selectedCategory === 'সকল' || (q.category || 'সাধারণ') === selectedCategory;
    const matchSearch = !searchQuery.trim() || 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleDeleteItem = (id: string) => {
    const updated = botQnA.filter(q => q.id !== id);
    onChangeBotQnA(updated);
  };

  const handleToggleActive = (id: string) => {
    const updated = botQnA.map(q => {
      if (q.id === id) {
        return { ...q, active: !q.active };
      }
      return q;
    });
    onChangeBotQnA(updated);
  };

  const handleToggleQuickMenu = (id: string) => {
    const updated = botQnA.map(q => {
      if (q.id === id) {
        return { ...q, quickMenu: !q.quickMenu };
      }
      return q;
    });
    onChangeBotQnA(updated);
  };

  const handleSaveWelcomeSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateSettings && settings) {
      onUpdateSettings({
        ...settings,
        botTitle,
        botWelcomeMsg: welcomeText
      });
    }
    setIsSavedWelcome(true);
    setTimeout(() => setIsSavedWelcome(false), 2500);
  };

  const handleRunTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim()) return;
    const mockDb = {
      settings,
      slides: [],
      notices: [],
      activities: [],
      blogs: [],
      gallery: [],
      members: [],
      customFields: [],
      volunteers: [],
      messages: [],
      donations: [],
      botQnA,
      lastSyncedAt: null
    };
    const res = generateIslamicAIResponse(testInput, mockDb as any);
    setTestOutput(res.text);
  };

  return (
    <div className="space-y-6 animate-fade-in font-serif-bn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bot className="w-5 h-5 text-emerald-600" />
            <span>ইসলামিক এআই চ্যাটবট ও প্রশ্নোত্তর (Q&A) ম্যানেজমেন্ট</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-sans-bn mt-1">
            কোনো প্রকার API ছাড়াই গুগল শিটের নলেজবেস ও আপনার নির্ধারিত প্রশ্নোত্তর থেকে এআই তাৎক্ষণিক উত্তর প্রদান করবে
          </p>
        </div>

        <button
          onClick={() => onOpenQnAModal()}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন প্রশ্ন ও উত্তর যুক্ত করুন</span>
        </button>
      </div>

      {/* Info Card */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-sans-bn flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold font-serif-bn text-emerald-900">
            সম্পূর্ণ ইসলামিক মাইন্ডসেট ও স্বয়ংক্রিয় গুগল শিট ডাটাবেস
          </p>
          <p className="text-emerald-800 leading-relaxed">
            • ইউজার চ্যাটবট ওপেন করলেই ইসলামিক সালাম দিয়ে শুরু করবে। কেউ সালাম দিলে ওয়ালাইকুম আসসালাম সহ বরকতের দোয়া করবে।
            <br />
            • <strong>কুইক মেনু ট্যাব:</strong> যেসব প্রশ্নের পাশে "মেনু বাটনে দেখান" সক্রিয় থাকবে, সেগুলো চ্যাটবটের ভিতরে ক্লিকেবল বাটন আকারে প্রদর্শিত হবে।
            <br />
            • ইউজার কোনো প্রশ্ন ক্লিক করলে বা টাইপ করলে সাথে সাথে গুগল শিটের সংরক্ষিত উত্তর চলে আসবে।
          </p>
        </div>
      </div>

      {/* Bot Greeting & Settings Box */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Settings className="w-4 h-4 text-emerald-600" />
          <span>চ্যাটবট প্রাথমিক বার্তা ও নাম কাস্টমাইজেশন</span>
        </h3>

        <form onSubmit={handleSaveWelcomeSettings} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 font-serif-bn">
                চ্যাটবটের নাম
              </label>
              <input
                type="text"
                value={botTitle}
                onChange={(e) => setBotTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif-bn focus:ring-2 focus:ring-emerald-500 font-sans-bn"
                placeholder="যেমন: ইসলামিক এআই সহকারী"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 font-serif-bn">
                স্বাগত বার্তা (সালাম ও ভূমিকা)
              </label>
              <textarea
                rows={2}
                value={welcomeText}
                onChange={(e) => setWelcomeText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif-bn focus:ring-2 focus:ring-emerald-500 font-sans-bn"
                placeholder="আসসালামু আলাইকুম..."
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold font-serif-bn flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              {isSavedWelcome ? <Check className="w-3.5 h-3.5 text-amber-300" /> : <Check className="w-3.5 h-3.5" />}
              <span>{isSavedWelcome ? 'সংরক্ষিত হয়েছে!' : 'সেটিংস সংরক্ষণ করুন'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Live Bot Testing Box */}
      <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 text-white space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-emerald-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>এডমিন লাইভ টেস্ট কনসোল (প্রশ্ন লিখে সাথে সাথে যাচাই করুন)</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-sans-bn">
            API বিহীন অফলাইন নলেজ ইঞ্জিন
          </span>
        </div>

        <form onSubmit={handleRunTest} className="flex gap-2">
          <input
            type="text"
            placeholder="যেকোনো প্রশ্ন লিখুন (যেমন: দান করার নিয়ম কী?, সালাম, বা আপনার প্রশ্ন)..."
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-sans-bn"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>টেস্ট উত্তর দেখুন</span>
          </button>
        </form>

        {testOutput && (
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 text-xs font-sans-bn whitespace-pre-line leading-relaxed">
            <strong className="text-amber-300 font-serif-bn block mb-1">এআই এর উত্তর:</strong>
            {testOutput}
          </div>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-serif-bn transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-950 text-white font-bold shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 font-medium'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="প্রশ্নোত্তর খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-sans-bn"
          />
        </div>
      </div>

      {/* Q&A Items List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center text-slate-400">
            <HelpCircle className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-serif-bn text-slate-600">কোনো প্রশ্নোত্তর পাওয়া যায়নি।</p>
            <p className="text-xs font-sans-bn text-slate-400 mt-1">উপরের বাটনে ক্লিক করে নতুন প্রশ্ন ও উত্তর যোগ করুন।</p>
          </div>
        ) : (
          filteredItems.map((item, idx) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all ${
                item.active ? 'border-slate-200 shadow-xs' : 'border-slate-200/60 bg-slate-50/70 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm sm:text-base font-bold font-serif-bn text-slate-900">
                        {item.question}
                      </h4>
                      {item.category && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold font-serif-bn">
                          {item.category}
                        </span>
                      )}
                      {item.quickMenu ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                          ✨ কুইক মেনু বাটন
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px]">
                          স্বাভাবিক উত্তর
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleToggleQuickMenu(item.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-serif-bn transition-all cursor-pointer border ${
                      item.quickMenu 
                        ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100' 
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                    title="চ্যাটবট মেনুতে কুইক বাটন হিসেবে দেখান"
                  >
                    {item.quickMenu ? '★ মেনুতে আছে' : '+ মেনুতে যুক্ত করুন'}
                  </button>

                  <button
                    onClick={() => handleToggleActive(item.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-serif-bn transition-all cursor-pointer ${
                      item.active
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {item.active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                  </button>

                  <button
                    onClick={() => onOpenQnAModal(item)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                    title="সম্পাদনা করুন"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="ডিলিট করুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Answer Content */}
              <div className="pt-3 text-xs sm:text-sm text-slate-700 font-sans-bn leading-relaxed whitespace-pre-line bg-slate-50/70 p-3 rounded-xl mt-2 border border-slate-100">
                <span className="font-bold text-slate-800 font-serif-bn block text-[11px] mb-1">
                  সংরক্ষিত উত্তর:
                </span>
                {item.answer}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
