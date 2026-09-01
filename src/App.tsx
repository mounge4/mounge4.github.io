import React, { useState, useEffect, useCallback } from 'react';
import { DatabaseState, VolunteerItem, ContactMessage, DonationRecord } from './types';
import { getLocalDatabase, saveLocalDatabase, syncFromGoogleSheets, pushToGoogleSheets } from './services/sheetSync';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { NoticeTicker } from './components/NoticeTicker';
import { MissionBanner } from './components/MissionBanner';
import { AboutSection } from './components/AboutSection';
import { ActivitiesSection } from './components/ActivitiesSection';
import { MemberSlider } from './components/MemberSlider';
import { BlogSection } from './components/BlogSection';
import { GallerySection } from './components/GallerySection';
import { JoinDonateSection } from './components/JoinDonateSection';
import { VolunteerSection } from './components/VolunteerSection';
import { ContactSection } from './components/ContactSection';
import { NoticesSection } from './components/NoticesSection';
import { IslamicAIChatbot } from './components/IslamicAIChatbot';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel/AdminPanel';
import { CheckCircle2, AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react';

export default function App() {
  const [db, setDb] = useState<DatabaseState>(() => getLocalDatabase());
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [selectedDonationProject, setSelectedDonationProject] = useState<string>('সাধারণ সদকা ও যাকাত তহবিল');
  const [targetArticleId, setTargetArticleId] = useState<string | null>(null);
  const [targetNoticeId, setTargetNoticeId] = useState<string | null>(null);
  const [targetActivityId, setTargetActivityId] = useState<string | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Parse deep link on initial load & popstate/hashchange
  const processLocationDeepLink = useCallback(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const tabParam = searchParams.get('tab');
      const articleParam = searchParams.get('article') || searchParams.get('blog');
      const noticeParam = searchParams.get('notice');
      const activityParam = searchParams.get('activity') || searchParams.get('project');

      const hash = window.location.hash || '';

      if (articleParam) {
        setActiveTab('blogs');
        setTargetArticleId(decodeURIComponent(articleParam));
        return;
      }

      if (noticeParam) {
        setActiveTab('notices');
        setTargetNoticeId(decodeURIComponent(noticeParam));
        return;
      }

      if (activityParam) {
        setActiveTab('activities');
        setTargetActivityId(decodeURIComponent(activityParam));
        return;
      }

      if (hash.startsWith('#blog-')) {
        setActiveTab('blogs');
        setTargetArticleId(decodeURIComponent(hash.replace('#blog-', '')));
        return;
      }

      if (hash.startsWith('#notice-')) {
        setActiveTab('notices');
        setTargetNoticeId(decodeURIComponent(hash.replace('#notice-', '')));
        return;
      }

      if (hash.startsWith('#activity-')) {
        setActiveTab('activities');
        setTargetActivityId(decodeURIComponent(hash.replace('#activity-', '')));
        return;
      }

      if (tabParam) {
        setActiveTab(tabParam);
        return;
      }

      if (hash && hash.length > 1) {
        const cleanHash = hash.replace('#', '');
        const validTabs = ['home', 'about', 'activities', 'notices', 'members', 'blogs', 'blog', 'gallery', 'join', 'volunteer', 'contact'];
        if (validTabs.includes(cleanHash)) {
          setActiveTab(cleanHash === 'blog' ? 'blogs' : cleanHash);
        }
      }
    } catch (e) {
      console.error('Deep link parse error', e);
    }
  }, []);

  useEffect(() => {
    processLocationDeepLink();

    const handleLocationChange = () => processLocationDeepLink();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [processLocationDeepLink]);

  // Perform single API call sync from Google Sheets
  const triggerSync = useCallback(async (showFeedback = true) => {
    const scriptUrl = db.settings.googleSheetUrl || db.settings.scriptUrl;
    if (!scriptUrl) {
      if (showFeedback) {
        showToast('গুগল শিট কানেক্ট করতে এডমিন প্যানেলে Web App URL যুক্ত করুন।', 'info');
      }
      return;
    }

    setIsSyncing(true);
    const result = await syncFromGoogleSheets(scriptUrl);
    setIsSyncing(false);

    if (result.success && result.data) {
      setDb(result.data);
      if (showFeedback) {
        showToast('গুগল শিট থেকে সকল ডাটা সফলভাবে সিঙ্ক হয়েছে!', 'success');
      }
    } else {
      if (showFeedback) {
        showToast(`সিঙ্ক ব্যর্থ: ${result.error || 'সংযোগ চেক করুন'}`, 'error');
      }
    }
  }, [db.settings.googleSheetUrl, db.settings.scriptUrl]);

  // Initial auto sync on load if URL present
  useEffect(() => {
    const scriptUrl = db.settings.googleSheetUrl || db.settings.scriptUrl;
    if (scriptUrl) {
      triggerSync(false);
    }
  }, []);

  // Periodic background auto-sync if configured
  useEffect(() => {
    const scriptUrl = db.settings.googleSheetUrl || db.settings.scriptUrl;
    const minutes = db.settings.autoSyncIntervalMinutes || 10;
    if (!scriptUrl || minutes <= 0) return;

    const interval = setInterval(() => {
      triggerSync(false);
    }, minutes * 60 * 1000);

    return () => clearInterval(interval);
  }, [db.settings.googleSheetUrl, db.settings.scriptUrl, db.settings.autoSyncIntervalMinutes, triggerSync]);

  // Navigate to any page and scroll to top
  const handleNavigate = (tabId: string) => {
    const normalizedTab = tabId === 'blog' ? 'blogs' : tabId;
    setActiveTab(normalizedTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const newUrl = normalizedTab === 'home' 
        ? window.location.pathname 
        : `${window.location.pathname}?tab=${normalizedTab}`;
      window.history.pushState(null, '', newUrl);
    } catch (e) {}
  };

  // Update complete database state (from Admin Panel)
  const handleUpdateDatabase = async (updater: (prev: DatabaseState) => DatabaseState) => {
    setDb((prevDb) => {
      const newDb = updater(prevDb);
      saveLocalDatabase(newDb);

      const scriptUrl = newDb.settings.googleSheetUrl || newDb.settings.scriptUrl;
      if (scriptUrl) {
        pushToGoogleSheets(scriptUrl, 'syncAll', newDb);
      }
      return newDb;
    });
  };

  // Volunteer registration handler
  const handleRegisterVolunteer = async (volData: Omit<VolunteerItem, 'id' | 'joinedDate' | 'status'>): Promise<boolean> => {
    const newVol: VolunteerItem = {
      ...volData,
      id: `vol-${Date.now()}`,
      joinedDate: new Date().toLocaleDateString('bn-BD'),
      status: 'অনুমোদিত'
    };

    const updatedVolunteers = [newVol, ...db.volunteers];
    const updatedDb: DatabaseState = { ...db, volunteers: updatedVolunteers };
    
    setDb(updatedDb);
    saveLocalDatabase(updatedDb);

    const scriptUrl = db.settings.googleSheetUrl || db.settings.scriptUrl;
    if (scriptUrl) {
      pushToGoogleSheets(scriptUrl, 'addVolunteer', newVol);
    }

    return true;
  };

  // Contact message submit handler
  const handleSubmitMessage = async (msgData: Omit<ContactMessage, 'id' | 'date' | 'status'>): Promise<boolean> => {
    const newMsg: ContactMessage = {
      ...msgData,
      id: `msg-${Date.now()}`,
      date: new Date().toLocaleDateString('bn-BD'),
      status: 'নতুন'
    };

    const updatedMessages = [newMsg, ...db.messages];
    const updatedDb: DatabaseState = { ...db, messages: updatedMessages };
    
    setDb(updatedDb);
    saveLocalDatabase(updatedDb);

    const scriptUrl = db.settings.googleSheetUrl || db.settings.scriptUrl;
    if (scriptUrl) {
      pushToGoogleSheets(scriptUrl, 'addMessage', newMsg);
    }

    return true;
  };

  // Donation transaction notification handler
  const handleSubmitDonationRecord = async (recordData: Omit<DonationRecord, 'id' | 'date' | 'verified'>): Promise<boolean> => {
    const newDonation: DonationRecord = {
      ...recordData,
      id: `don-${Date.now()}`,
      date: new Date().toLocaleDateString('bn-BD'),
      verified: false
    };

    const updatedDonations = [newDonation, ...db.donations];
    const updatedDb: DatabaseState = { ...db, donations: updatedDonations };
    
    setDb(updatedDb);
    saveLocalDatabase(updatedDb);

    const scriptUrl = db.settings.googleSheetUrl || db.settings.scriptUrl;
    if (scriptUrl) {
      pushToGoogleSheets(scriptUrl, 'addDonation', newDonation);
    }

    return true;
  };

  const handleDonateProjectSelect = (projectTitle: string) => {
    setSelectedDonationProject(projectTitle);
    handleNavigate('join');
  };

  // If Admin Panel is requested, show full screen admin view
  if (isAdminOpen) {
    return (
      <AdminPanel
        db={db}
        onUpdateDb={handleUpdateDatabase}
        onPullFromSheet={() => triggerSync(true)}
        onPushToSheet={async () => {
          const scriptUrl = db.settings.googleSheetUrl || db.settings.scriptUrl;
          if (scriptUrl) {
            setIsSyncing(true);
            const res = await pushToGoogleSheets(scriptUrl, 'syncAll', db);
            setIsSyncing(false);
            if (res.success) {
              showToast('গুগল শিটে ডাটা পাঠানো হয়েছে!', 'success');
              return true;
            } else {
              showToast('গুগল শিটে ডাটা পাঠাতে ব্যর্থ', 'error');
              return false;
            }
          }
          showToast('গুগল শিট URL কনফিগার করুন', 'info');
          return false;
        }}
        isSyncing={isSyncing}
        onClose={() => setIsAdminOpen(false)}
      />
    );
  }

  // Active page renderer function
  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'about':
        return (
          <div className="py-8 space-y-8 animate-fade-in">
            <AboutSection
              settings={db.settings}
              onNavigate={handleNavigate}
            />
          </div>
        );

      case 'activities':
        return (
          <div className="py-8 space-y-8 animate-fade-in">
            <ActivitiesSection
              activities={db.activities}
              initialActivityId={targetActivityId}
              onDonateClick={handleDonateProjectSelect}
              onClearActivity={() => setTargetActivityId(null)}
            />
          </div>
        );

      case 'notices':
        return (
          <div className="py-8 space-y-8 animate-fade-in">
            <NoticesSection
              notices={db.notices}
              initialNoticeId={targetNoticeId}
              onNavigate={handleNavigate}
              onClearNotice={() => setTargetNoticeId(null)}
            />
          </div>
        );

      case 'members':
        return (
          <div className="py-8 space-y-8 animate-fade-in">
            <MemberSlider members={db.members} />
          </div>
        );

      case 'blog':
      case 'blogs':
        return (
          <div className="py-8 space-y-8 animate-fade-in">
            <BlogSection 
              blogs={db.blogs} 
              initialArticleId={targetArticleId}
              onClearArticle={() => setTargetArticleId(null)}
            />
          </div>
        );

      case 'gallery':
        return (
          <div className="py-8 space-y-8 animate-fade-in">
            <GallerySection gallery={db.gallery} />
          </div>
        );

      case 'join':
        return (
          <div className="py-8 space-y-8 animate-fade-in">
            <JoinDonateSection
              settings={db.settings}
              selectedProject={selectedDonationProject}
              onSubmitDonationRecord={handleSubmitDonationRecord}
            />
          </div>
        );

      case 'volunteer':
        return (
          <div className="py-8 space-y-8 animate-fade-in">
            <VolunteerSection
              customFields={db.customFields || []}
              onRegisterVolunteer={handleRegisterVolunteer}
            />
          </div>
        );

      case 'contact':
        return (
          <div className="py-8 space-y-8 animate-fade-in">
            <ContactSection
              settings={db.settings}
              onSubmitMessage={handleSubmitMessage}
            />
          </div>
        );

      case 'home':
      default:
        return (
          <div className="space-y-0 animate-fade-in">
            {/* 1. Hero Image & Video Slider */}
            <HeroSlider
              slides={db.slides}
              onNavigate={handleNavigate}
            />

            {/* 2. Notice Ticker with quick action */}
            <NoticeTicker notices={db.notices} />

            {/* 3. Core Islamic Mission & Hadith/Quran Banner Slider */}
            <MissionBanner 
              quotes={db.missionQuotes}
              quote={db.settings.missionQuote} 
            />

            {/* 4. Featured Activities */}
            <ActivitiesSection
              activities={db.activities}
              initialActivityId={targetActivityId}
              onDonateClick={handleDonateProjectSelect}
              onClearActivity={() => setTargetActivityId(null)}
            />

            {/* 5. About Section Highlight */}
            <AboutSection
              settings={db.settings}
              onNavigate={handleNavigate}
            />

            {/* 6. Members & Leadership Slider */}
            <MemberSlider members={db.members} />

            {/* 7. Recent Islamic Blogs & Articles */}
            <BlogSection 
              blogs={db.blogs} 
              initialArticleId={targetArticleId}
              onClearArticle={() => setTargetArticleId(null)}
            />

            {/* 8. Gallery Highlights */}
            <GallerySection gallery={db.gallery} />

            {/* 9. Join & Donate Section */}
            <JoinDonateSection
              settings={db.settings}
              selectedProject={selectedDonationProject}
              onSubmitDonationRecord={handleSubmitDonationRecord}
            />

            {/* 10. Volunteer Section */}
            <VolunteerSection
              customFields={db.customFields || []}
              divisions={db.settings?.divisions}
              interestAreas={db.settings?.interestAreas}
              onRegisterVolunteer={handleRegisterVolunteer}
            />

            {/* 11. Contact & Location */}
            <ContactSection
              settings={db.settings}
              onSubmitMessage={handleSubmitMessage}
            />
          </div>
        );
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col font-serif-bn selection:bg-emerald-100 selection:text-emerald-900 transition-colors duration-200"
      style={{ backgroundColor: db.settings.pageBgColor || '#f8fafc' }}
    >
      
      {/* 1. Main Navbar Header */}
      <Header
        settings={db.settings}
        activeTab={activeTab}
        onTabChange={handleNavigate}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onSync={() => triggerSync(true)}
        isSyncing={isSyncing}
        lastSyncedAt={db.lastSyncedAt}
      />

      {/* Breadcrumb Navigation when on sub-page */}
      {activeTab !== 'home' && (
        <div className="bg-emerald-50/80 border-b border-emerald-100/80 py-2.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={() => handleNavigate('home')}
              className="inline-flex items-center gap-1.5 text-xs font-bold font-serif-bn text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← মূল হোম পেজে ফিরে যান</span>
            </button>

            <span className="text-xs text-emerald-600 font-sans-bn">
              বর্তমানে দেখছেন: <strong className="font-serif-bn text-emerald-900">{
                activeTab === 'about' ? 'আমাদের সম্পর্কে' :
                activeTab === 'activities' ? 'কার্যক্রমসমূহ' :
                activeTab === 'notices' ? 'নোটিস বোর্ড' :
                activeTab === 'members' ? 'পরিচালনা পরিষদ' :
                activeTab === 'blogs' || activeTab === 'blog' ? 'ইসলামিক ব্লগ' :
                activeTab === 'gallery' ? 'ফটোগ্যালারি' :
                activeTab === 'join' ? 'দান করুন' :
                activeTab === 'volunteer' ? 'স্বেচ্ছাসেবক নিবন্ধন' :
                activeTab === 'contact' ? 'যোগাযোগ' : 'পেজ'
              }</strong>
            </span>
          </div>
        </div>
      )}

      {/* 2. Main Page Content View */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* 3. Footer */}
      <Footer
        settings={db.settings}
        socialLinks={db.socialLinks}
        onNavigate={handleNavigate}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 4. Floating Islamic AI Chatbot Agent Icon Button (Visible on all screens) */}
      <IslamicAIChatbot 
        db={db} 
        onNavigate={handleNavigate} 
      />

      {/* Global Toast Alerts */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border font-serif-bn text-sm animate-fade-in ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950 text-white border-emerald-600'
              : toastMessage.type === 'error'
              ? 'bg-rose-950 text-white border-rose-600'
              : 'bg-slate-900 text-white border-slate-700'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-amber-300" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

    </div>
  );
}
