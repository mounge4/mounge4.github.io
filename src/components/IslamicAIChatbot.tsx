import React, { useState, useEffect, useRef } from 'react';
import { DatabaseState } from '../types';
import { generateIslamicAIResponse, ChatMessage } from '../services/aiKnowledgeEngine';
import { formatDriveImageUrl } from '../utils/imageHelper';
import { 
  Sparkles, 
  Send, 
  X, 
  RotateCcw, 
  ChevronRight,
  Bot,
  Menu,
  BookOpen,
  HeartHandshake,
  FileText,
  DollarSign,
  Image as ImageIcon,
  Users,
  PhoneCall,
  Bell,
  Home,
  CheckCircle2,
  Wand2
} from 'lucide-react';

interface IslamicAIChatbotProps {
  db: DatabaseState;
  onNavigate?: (tabId: string) => void;
}

export const IslamicAIChatbot: React.FC<IslamicAIChatbotProps> = ({ db, onNavigate }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [hasUnread, setHasUnread] = useState<boolean>(true);

  // Initialize with Islamic Salam Welcome message
  const defaultWelcome = db.settings.botWelcomeMsg || 
    `আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহি ওয়া বারাকাতুহু!🌸 \n\nআমি **${db.settings.foundationName}**-এর ইসলামিক এআই সহকারী। দ্বীনের দাওয়াহ, ভ্রাতৃত্ব ও মানবসেবায় নিয়োজিত কার্যক্রমে আপনাকে জানাই আন্তরিক স্বাগতম। আপনি নিচের মেনু ট্যাবগুলো থেকে আপনার প্রয়োজনীয় বিষয় নির্বাচন করতে পারেন। অথবা আপনার যেকোনো প্রশ্ন লিখে পাঠান—আমি যথাসাধ্য নির্ভরযোগ্য ও উপকারী তথ্য দিয়ে আপনাকে সহযোগিতা করার চেষ্টা করব।
🤲 আল্লাহ আমাদের সকল প্রচেষ্টা কবুল করুন। আমীন। `;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: defaultWelcome,
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick navigation pages available in the Menu tab
  const siteNavMenu = [
    { id: 'home', label: 'হোম পেজ', icon: Home, query: 'হোম পেজের মূল বিষয়সমূহ কী কী?' },
    { id: 'join', label: 'অনলাইন অনুদান ও যাকাত', icon: DollarSign, query: 'দান ও যাকাত প্রদানের একাউন্ট নম্বর' },
    { id: 'activities', label: 'চলমান কার্যক্রম ও প্রজেক্ট', icon: HeartHandshake, query: 'চলমান কার্যক্রম ও প্রকল্পসমূহ' },
    { id: 'volunteer', label: 'স্বেচ্ছাসেবক আবেদন ফরম', icon: Users, query: 'স্বেচ্ছাসেবক হিসেবে যোগদানের নিয়ম' },
    { id: 'notices', label: 'নোটিস ও জরুরি বিজ্ঞপ্তি', icon: Bell, query: 'সর্বশেষ নোটিস ও বিজ্ঞপ্তি' },
    { id: 'blog', label: 'ইসলামিক ব্লগ ও আর্টিকেল', icon: BookOpen, query: 'ইসলামিক ব্লগ ও প্রবন্ধসমূহ' },
    { id: 'gallery', label: 'কার্যক্রমের ফটোগ্যালারি', icon: ImageIcon, query: 'ফটোগ্যালারি ও ভিডিও' },
    { id: 'about', label: 'আমাদের লক্ষ্য ও পরিচিতি', icon: FileText, query: 'ফাউন্ডেশনের লক্ষ্য ও উদ্দেশ্য' },
    { id: 'members', label: 'পরিচালনা পরিষদ ও টিম', icon: Users, query: 'পরিচালনা পরিষদ ও সদস্যবৃন্দ' },
    { id: 'contact', label: 'যোগাযোগ ও অফিস ঠিকানা', icon: PhoneCall, query: 'অফিস ঠিকানা ও ফোন নম্বর' }
  ];

  // Dynamic quick tabs from Admin BotQnA where quickMenu is true or default quick topics
  const adminQuickMenus = (db.botQnA || []).filter(q => q.active && q.quickMenu);
  
  const defaultQuickMenus = [
    { id: 'qm-1', label: '💳 ব্যাংক ও বিকাশ', query: 'দান ও যাকাত প্রদানের একাউন্ট নম্বর' },
    { id: 'qm-2', label: '🌟 প্রকল্পসমূহ', query: 'চলমান কার্যক্রম ও প্রকল্পসমূহ' },
    { id: 'qm-3', label: '🤝 সদস্য', query: ' সদস্য হিসেবে যোগদানের নিয়ম' },
    { id: 'qm-4', label: '📢 নোটিস বোর্ড', query: 'সর্বশেষ নোটিস ও বিজ্ঞপ্তি' },
    { id: 'qm-5', label: '📞 হটলাইন', query: 'অফিস ঠিকানা ও ফোন নম্বর' }
  ];

  const quickActionTabs = adminQuickMenus.length > 0
    ? adminQuickMenus.map(q => ({ id: q.id, label: q.keywords?.[0] || q.question.slice(0, 18), query: q.question }))
    : defaultQuickMenus;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);
    setIsMenuDrawerOpen(false);

    // Simulate natural Islamic thought latency
    setTimeout(() => {
      const botReply = generateIslamicAIResponse(text, db);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply.text,
        actionLink: botReply.actionLink,
        actionLabel: botReply.actionLabel,
        timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: defaultWelcome,
        timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleActionClick = (tabId: string) => {
    if (onNavigate) {
      onNavigate(tabId);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Premium Islamic AI Agent Icon Tab (Present on all screens) */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-40 animate-fade-in font-serif-bn">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 p-2.5 sm:pl-3 sm:pr-4 sm:py-2.5 rounded-2xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white shadow-[0_12px_35px_-6px_rgba(2,44,34,0.75)] border border-amber-400/70 hover:border-amber-300 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer ring-4 ring-emerald-950/20 backdrop-blur-md"
            aria-label="ইসলামিক এআই সহকারী"
          >
            {/* 3D Gold & Emerald Emblem Core with AI Bot */}
            <div className="relative p-[1.5px] rounded-xl bg-gradient-to-tr from-amber-500 via-amber-200 to-yellow-400 shadow-md group-hover:rotate-3 transition-transform duration-300 shrink-0">
              <div className="w-10 h-10 rounded-[10px] bg-gradient-to-b from-emerald-900 via-emerald-950 to-teal-950 text-amber-300 flex items-center justify-center relative overflow-hidden shadow-inner">
                {/* Subtle Glow Beam */}
                <div className="absolute inset-0 bg-radial from-amber-400/20 via-transparent to-transparent opacity-80" />
                
                {/* Main AI Bot / Unified Logo */}
                {db.settings.logoUrl ? (
                  <img
                    src={formatDriveImageUrl(db.settings.logoUrl)}
                    alt="Logo"
                    className="w-full h-full object-cover relative z-10"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <Bot className="w-5 h-5 text-amber-300 relative z-10 group-hover:scale-110 transition-transform" />
                )}
              </div>
            </div>

            {/* Premium Button Text (Responsive) */}
            <div className="hidden sm:flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold text-amber-300 tracking-wider uppercase font-sans-bn">
                  ইসলামিক এআই এজেন্ট
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
              </div>
              <span className="text-xs font-bold text-white leading-tight flex items-center gap-1">
                যেকোনো প্রশ্ন বা মেনু দেখুন
                <ChevronRight className="w-3 h-3 text-amber-300/80 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>

            {/* Notification Badge Indicator */}
            {hasUnread && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-80"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-emerald-950 text-[10px] font-bold text-emerald-950 items-center justify-center shadow-sm">
                  ✨
                </span>
              </span>
            )}
          </button>
        </div>
      )}

      {/* Islamic AI Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-24px)] sm:w-[420px] h-[590px] max-h-[88vh] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-200 flex flex-col overflow-hidden animate-fade-in font-serif-bn">
          
          {/* Header with Luxury Islamic AI Emblem */}
          <div className="px-4 sm:px-5 py-3.5 bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white flex items-center justify-between border-b border-emerald-850 shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-[1.5px] rounded-xl bg-gradient-to-tr from-amber-400 via-amber-200 to-yellow-400 shadow-md shrink-0">
                <div className="w-9 h-9 rounded-[10px] bg-gradient-to-b from-emerald-900 via-emerald-950 to-teal-950 text-amber-300 flex items-center justify-center relative overflow-hidden shadow-inner">
                  {db.settings.logoUrl ? (
                    <img
                      src={formatDriveImageUrl(db.settings.logoUrl)}
                      alt="Logo"
                      className="w-full h-full object-cover relative z-10"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <>
                      <Bot className="w-4.5 h-4.5 text-amber-300 relative z-10" />
                      <Sparkles className="w-2.5 h-2.5 text-amber-200 absolute top-1 right-1 animate-pulse z-10" />
                    </>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white leading-none">
                    {db.settings.botTitle || 'ইসলামিক এআই সহকারী'}
                  </h3>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-sans-bn bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1 animate-pulse" />
                    সক্রিয়
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/80 font-sans-bn mt-0.5">
                 ওয়েবসাইট বিষয়ে যেকোনো প্রশ্ন বাংলা ভাষায় করতে পারেন।
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-300">
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-lg hover:bg-emerald-800/80 hover:text-white transition-colors cursor-pointer"
                title="চ্যাট হিস্ট্রি রিসেট করুন"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-rose-900/80 hover:text-white transition-colors cursor-pointer"
                title="চ্যাটবট বন্ধ করুন"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Menu Tabs Bar with Prominent "মেনু (Menu)" Tab Button */}
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-200/90 overflow-x-auto shrink-0 flex items-center gap-1.5 no-scrollbar">
            
            {/* 1. Main Highlighted Menu Tab Button */}
            <button
              onClick={() => setIsMenuDrawerOpen(!isMenuDrawerOpen)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-serif-bn transition-all shrink-0 shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 border ${
                isMenuDrawerOpen 
                  ? 'bg-amber-500 text-emerald-950 border-amber-400 font-extrabold ring-2 ring-amber-400/30' 
                  : 'bg-gradient-to-r from-emerald-900 to-teal-900 text-amber-300 hover:text-white border-emerald-700'
              }`}
              title="ওয়েবসাইটের সকল পেজ ও বিষয়ের তালিকা"
            >
              <Menu className="w-3.5 h-3.5" />
              <span>(Menu)</span>
            </button>

            {/* 2. Admin & System Quick Action Buttons */}
            {quickActionTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setIsMenuDrawerOpen(false);
                  handleSendMessage(tab.query);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-emerald-50 hover:text-emerald-900 text-slate-700 text-[11px] font-bold font-serif-bn border border-slate-200 transition-all shrink-0 shadow-2xs hover:border-emerald-300 cursor-pointer active:scale-95"
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Expanded Menu Drawer Layer inside Chat Window */}
          {isMenuDrawerOpen && (
            <div className="p-3.5 bg-emerald-950/95 text-white border-b border-emerald-800 animate-fade-in shadow-inner max-h-[48%] overflow-y-auto shrink-0">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-800/80">
                <div className="flex items-center gap-2">
                  <Menu className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-bold text-amber-200">
                    বিষয় ও পেজ নির্বাচন করুন:
                  </span>
                </div>
                <button
                  onClick={() => setIsMenuDrawerOpen(false)}
                  className="text-slate-400 hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {siteNavMenu.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSendMessage(item.query)}
                      className="p-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-left border border-emerald-700/60 transition-all flex items-center gap-2 cursor-pointer group active:scale-95"
                    >
                      <div className="w-6 h-6 rounded-lg bg-emerald-950 flex items-center justify-center text-amber-300 shrink-0 group-hover:bg-amber-400 group-hover:text-emerald-950 transition-colors">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-100 group-hover:text-white leading-tight">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="text-[10px] text-emerald-300/70 font-sans-bn mt-2.5 text-center">
                * যেকোনো বাটনে চাপ দিলে এআই বিস্তারিত তথ্য প্রদর্শন করবে।
              </p>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isBot ? 'flex-row' : 'flex-row-reverse'} animate-fade-in`}
                >
                  {/* Bot Avatar */}
                  {isBot && (
                    <div className="p-[1px] rounded-lg bg-gradient-to-tr from-amber-400 to-amber-200 shadow-xs shrink-0 mt-0.5 overflow-hidden">
                      <div className="w-6 h-6 rounded-[7px] bg-emerald-950 text-amber-300 flex items-center justify-center overflow-hidden">
                        {db.settings.logoUrl ? (
                          <img
                            src={formatDriveImageUrl(db.settings.logoUrl)}
                            alt="Logo"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <Bot className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>
                  )}

                  <div className={`flex flex-col ${isBot ? 'items-start' : 'items-end'} max-w-[85%]`}>
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-2xs font-serif-bn whitespace-pre-line ${
                        isBot
                          ? 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                          : 'bg-emerald-800 text-white rounded-tr-xs shadow-emerald-900/10'
                      }`}
                    >
                      {msg.text}

                      {/* Bot Interactive Action Link Button */}
                      {isBot && msg.actionLink && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-end">
                          <button
                            onClick={() => handleActionClick(msg.actionLink!)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-serif-bn shadow-xs transition-colors cursor-pointer"
                          >
                            <span>{msg.actionLabel || 'বিস্তারিত পেজে যান'}</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] text-slate-400 font-sans-bn mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Bot Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="p-[1px] rounded-lg bg-gradient-to-tr from-amber-400 to-amber-200 shadow-xs shrink-0">
                  <div className="w-6 h-6 rounded-[7px] bg-emerald-950 text-amber-300 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white border border-slate-200/80 w-20 shadow-2xs animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 shrink-0 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="যেকোনো প্রশ্ন বাংলায় লিখুন (যেমন: দান করার নিয়ম)..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-serif-bn focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white shadow-md transition-all cursor-pointer shrink-0 disabled:cursor-not-allowed"
              title="পাঠান"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};

