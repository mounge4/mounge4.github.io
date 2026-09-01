import React, { useState, useEffect } from 'react';
import { 
  DatabaseState, 
  SiteSettings, 
  HeroSlide, 
  NoticeItem, 
  ActivityItem, 
  BlogPost, 
  MemberItem, 
  GalleryItem, 
  VolunteerItem, 
  ContactMessage, 
  DonationRecord,
  CustomFormField,
  BotQnAItem,
  SocialLinkItem,
  MissionQuoteItem
} from '../../types';
import { GOOGLE_APPS_SCRIPT_CODE, pushToGoogleSheets } from '../../services/sheetSync';
import { DEFAULT_DEPLOYED_APP_SCRIPT_URL, TARGET_SPREADSHEET_URL } from '../../utils/googleAppsScriptCode';
import { formatDriveImageUrl } from '../../utils/imageHelper';
import { ThemeTab } from './ThemeTab';
import { VolunteerFormTab } from './VolunteerFormTab';
import { BotQnATab } from './BotQnATab';
import { SocialMediaTab } from './SocialMediaTab';
import { TabSyncActionBar } from './TabSyncActionBar';
import { ChangePasswordModal } from './ChangePasswordModal';
import { 
  SlideModal, 
  NoticeModal, 
  ActivityModal, 
  BlogModal, 
  MemberModal, 
  GalleryModal, 
  CustomFieldModal,
  BotQnAModal,
  SocialLinkModal,
  MissionQuoteModal
} from './EntityModals';
import { 
  Lock, 
  Key, 
  Check, 
  Copy, 
  Save, 
  RefreshCw, 
  Trash2, 
  Plus, 
  Settings, 
  Image as ImageIcon, 
  Bell, 
  HeartHandshake, 
  BookOpen, 
  Users, 
  Layers, 
  MessageSquare, 
  DollarSign, 
  Code, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Shield,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  Palette,
  FileText,
  Edit3,
  Bot,
  Menu,
  Sparkles,
  Share2,
  Globe,
  ArrowLeft
} from 'lucide-react';
import { SmartImage, SmartAvatar } from '../SmartImage';

interface AdminPanelProps {
  db: DatabaseState;
  onUpdateDb: (updater: (prev: DatabaseState) => DatabaseState) => void;
  onPushToSheet: () => Promise<boolean>;
  onPullFromSheet: () => Promise<boolean>;
  isSyncing: boolean;
  onClose: () => void;
}

type AdminTab = 
  | 'script' 
  | 'theme' 
  | 'social_media'
  | 'volunteer_form' 
  | 'bot_qna'
  | 'quotes'
  | 'settings' 
  | 'slides' 
  | 'notices' 
  | 'activities' 
  | 'blogs' 
  | 'members' 
  | 'gallery' 
  | 'volunteers' 
  | 'messages' 
  | 'donations';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  db,
  onUpdateDb,
  onPushToSheet,
  onPullFromSheet,
  isSyncing,
  onClose
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<AdminTab>('theme');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Local state for forms
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(db.settings);
  const [slides, setSlides] = useState<HeroSlide[]>(db.slides || []);
  const [notices, setNotices] = useState<NoticeItem[]>(db.notices || []);
  const [activities, setActivities] = useState<ActivityItem[]>(db.activities || []);
  const [blogs, setBlogs] = useState<BlogPost[]>(db.blogs || []);
  const [members, setMembers] = useState<MemberItem[]>(db.members || []);
  const [gallery, setGallery] = useState<GalleryItem[]>(db.gallery || []);
  const [volunteers, setVolunteers] = useState<VolunteerItem[]>(db.volunteers || []);
  const [messages, setMessages] = useState<ContactMessage[]>(db.messages || []);
  const [donations, setDonations] = useState<DonationRecord[]>(db.donations || []);
  const [customFields, setCustomFields] = useState<CustomFormField[]>(db.customFields || []);
  const [botQnA, setBotQnA] = useState<BotQnAItem[]>(db.botQnA || []);
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>(db.socialLinks || []);
  const [missionQuotes, setMissionQuotes] = useState<MissionQuoteItem[]>(db.missionQuotes || []);

  // Synchronize internal state whenever db prop is updated (e.g. from Google Sheets sync or password update)
  useEffect(() => {
    setSettingsForm(db.settings);
    setSlides(db.slides || []);
    setNotices(db.notices || []);
    setActivities(db.activities || []);
    setBlogs(db.blogs || []);
    setMembers(db.members || []);
    setGallery(db.gallery || []);
    setVolunteers(db.volunteers || []);
    setMessages(db.messages || []);
    setDonations(db.donations || []);
    setCustomFields(db.customFields || []);
    setBotQnA(db.botQnA || []);
    setSocialLinks(db.socialLinks || []);
    setMissionQuotes(db.missionQuotes || []);
  }, [db]);

  // Modal States
  const [editingSlide, setEditingSlide] = useState<{ isOpen: boolean; item: HeroSlide | null }>({ isOpen: false, item: null });
  const [editingNotice, setEditingNotice] = useState<{ isOpen: boolean; item: NoticeItem | null }>({ isOpen: false, item: null });
  const [editingActivity, setEditingActivity] = useState<{ isOpen: boolean; item: ActivityItem | null }>({ isOpen: false, item: null });
  const [editingBlog, setEditingBlog] = useState<{ isOpen: boolean; item: BlogPost | null }>({ isOpen: false, item: null });
  const [editingMember, setEditingMember] = useState<{ isOpen: boolean; item: MemberItem | null }>({ isOpen: false, item: null });
  const [editingGallery, setEditingGallery] = useState<{ isOpen: boolean; item: GalleryItem | null }>({ isOpen: false, item: null });
  const [editingField, setEditingField] = useState<{ isOpen: boolean; item: CustomFormField | null }>({ isOpen: false, item: null });
  const [editingQnA, setEditingQnA] = useState<{ isOpen: boolean; item: BotQnAItem | null }>({ isOpen: false, item: null });
  const [editingSocial, setEditingSocial] = useState<{ isOpen: boolean; item: SocialLinkItem | null }>({ isOpen: false, item: null });
  const [editingQuote, setEditingQuote] = useState<{ isOpen: boolean; item: MissionQuoteItem | null }>({ isOpen: false, item: null });

  // Custom In-App Deletion Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmButtonText?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmButtonText: 'হ্যাঁ, ডিলিট করুন',
    onConfirm: () => {}
  });

  const requestConfirmation = (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmButtonText = 'হ্যাঁ, ডিলিট করুন'
  ) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmButtonText,
      onConfirm
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  const showSaveSuccess = (msg = 'সফলভাবে সংরক্ষিত হয়েছে!') => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Check temporary lockout
    if (lockoutTime && Date.now() < lockoutTime) {
      const remainingSecs = Math.ceil((lockoutTime - Date.now()) / 1000);
      setAuthError(`অতিরিক্ত ভুল চেষ্টার কারণে লগইন সাময়িকভাবে লক করা হয়েছে। ${remainingSecs} সেকেন্ড পর আবার চেষ্টা করুন।`);
      return;
    }

    const correctPass = String(db.settings.adminPassword || 'admin').trim();
    const entered = String(passwordInput || '').trim();

    // STRICT CHECK: Only exact matching updated password is valid!
    if (entered === correctPass) {
      setIsAuthenticated(true);
      setAuthError(null);
      setFailedAttempts(0);
      setLockoutTime(null);
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= 5) {
        setLockoutTime(Date.now() + 30000); // 30s cooldown
        setAuthError('অতিরিক্ত ভুল পাসওয়ার্ড দেওয়া হয়েছে! ৩০ সেকেন্ড পর পুনরায় চেষ্টা করুন।');
      } else {
        setAuthError(`ভুল পাসওয়ার্ড! শুধুমাত্র আপনার হালনাগাদকৃত সক্রিয় সঠিক পাসওয়ার্ড প্রদান করুন। (ভুল চেষ্টা: ${newAttempts}/৫)`);
      }
    }
  };

  const copyAppsScript = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
      setCopiedCode(true);
      showSaveSuccess('গুগল অ্যাপস স্ক্রিপ্ট কোড (Code.gs) কপি করা হয়েছে!');
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  // Direct persistence helper with auto-sync to Sheets
  const commitToDb = (newPartial: Partial<DatabaseState>, successMsg = 'পরিবর্তন সফলভাবে সংরক্ষিত হয়েছে!') => {
    onUpdateDb(prev => ({
      ...prev,
      ...newPartial
    }));
    showSaveSuccess(successMsg);
  };

  // Password update handler that securely saves and syncs
  const handleSavePassword = async (newPassword: string) => {
    const updatedSettings: SiteSettings = {
      ...settingsForm,
      ...db.settings,
      adminPassword: newPassword
    };
    setSettingsForm(updatedSettings);
    commitToDb({ settings: updatedSettings }, 'এডমিন পাসওয়ার্ড সফলভাবে পরিবর্তিত ও সংরক্ষিত হয়েছে!');
    setIsPasswordModalOpen(false);

    // Auto-push settings to Google Sheets immediately if connected
    const scriptUrl = updatedSettings.googleSheetUrl || updatedSettings.scriptUrl;
    if (scriptUrl) {
      await pushToGoogleSheets(scriptUrl, 'updateSettings', updatedSettings);
    }
  };

  /* ---------------- Handlers for Item Modals ---------------- */
  const handleSaveSlide = (saved: HeroSlide) => {
    const exists = slides.some(s => s.id === saved.id);
    const updated = exists ? slides.map(s => s.id === saved.id ? saved : f => f) : [...slides, saved];
    const finalSlides = exists ? slides.map(s => s.id === saved.id ? saved : s) : [...slides, saved];
    setSlides(finalSlides);
    commitToDb({ slides: finalSlides }, 'স্লাইডার সফলভাবে সংরক্ষিত হয়েছে!');
    const scriptUrl = settingsForm.googleSheetUrl || settingsForm.scriptUrl || db.settings.googleSheetUrl || db.settings.scriptUrl;
    if (scriptUrl) {
      pushToGoogleSheets(scriptUrl, 'saveSlides', finalSlides);
    }
  };

  const handleDeleteSlide = (id: string) => {
    requestConfirmation('স্লাইডার ডিলিট', 'আপনি কি নিশ্চিত যে এই স্লাইডটি ডিলিট করতে চান?', async () => {
      const updated = slides.filter(s => s.id !== id);
      setSlides(updated);
      commitToDb({ slides: updated }, 'স্লাইড ডিলিট করা হয়েছে');
      const scriptUrl = settingsForm.googleSheetUrl || settingsForm.scriptUrl || db.settings.googleSheetUrl || db.settings.scriptUrl;
      if (scriptUrl) {
        await pushToGoogleSheets(scriptUrl, 'saveSlides', updated);
      }
      closeConfirmModal();
    });
  };

  const handleSaveNotice = (saved: NoticeItem) => {
    const exists = notices.some(n => n.id === saved.id);
    const updated = exists ? notices.map(n => n.id === saved.id ? saved : n) : [saved, ...notices];
    setNotices(updated);
    commitToDb({ notices: updated }, 'নোটিস সফলভাবে সংরক্ষিত হয়েছে!');
    const scriptUrl = settingsForm.googleSheetUrl || settingsForm.scriptUrl || db.settings.googleSheetUrl || db.settings.scriptUrl;
    if (scriptUrl) {
      pushToGoogleSheets(scriptUrl, 'saveNotices', updated);
    }
  };

  const handleDeleteNotice = (id: string) => {
    requestConfirmation('নোটিস ডিলিট', 'আপনি কি নিশ্চিত যে এই নোটিসটি ডিলিট করতে চান?', async () => {
      const updated = notices.filter(n => n.id !== id);
      setNotices(updated);
      commitToDb({ notices: updated }, 'নোটিস ডিলিট করা হয়েছে');
      const scriptUrl = settingsForm.googleSheetUrl || settingsForm.scriptUrl || db.settings.googleSheetUrl || db.settings.scriptUrl;
      if (scriptUrl) {
        await pushToGoogleSheets(scriptUrl, 'saveNotices', updated);
      }
      closeConfirmModal();
    });
  };

  const handleSaveActivity = (saved: ActivityItem) => {
    const exists = activities.some(a => a.id === saved.id);
    const updated = exists ? activities.map(a => a.id === saved.id ? saved : a) : [saved, ...activities];
    setActivities(updated);
    commitToDb({ activities: updated }, 'কার্যক্রম সফলভাবে সংরক্ষিত হয়েছে!');
    const scriptUrl = settingsForm.googleSheetUrl || settingsForm.scriptUrl || db.settings.googleSheetUrl || db.settings.scriptUrl;
    if (scriptUrl) {
      pushToGoogleSheets(scriptUrl, 'saveActivities', updated);
    }
  };

  const handleDeleteActivity = (id: string) => {
    requestConfirmation('কার্যক্রম ডিলিট', 'আপনি কি নিশ্চিত যে এই কার্যক্রমটি ডিলিট করতে চান?', async () => {
      const updated = activities.filter(a => a.id !== id);
      setActivities(updated);
      commitToDb({ activities: updated }, 'কার্যক্রম ডিলিট করা হয়েছে');
      const scriptUrl = settingsForm.googleSheetUrl || settingsForm.scriptUrl || db.settings.googleSheetUrl || db.settings.scriptUrl;
      if (scriptUrl) {
        await pushToGoogleSheets(scriptUrl, 'saveActivities', updated);
      }
      closeConfirmModal();
    });
  };

  const handleSaveBlog = (saved: BlogPost) => {
    const exists = blogs.some(b => b.id === saved.id);
    const updated = exists ? blogs.map(b => b.id === saved.id ? saved : b) : [saved, ...blogs];
    setBlogs(updated);
    commitToDb({ blogs: updated }, 'প্রবন্ধ সফলভাবে সংরক্ষিত হয়েছে!');
    const scriptUrl = settingsForm.googleSheetUrl || settingsForm.scriptUrl || db.settings.googleSheetUrl || db.settings.scriptUrl;
    if (scriptUrl) {
      pushToGoogleSheets(scriptUrl, 'saveBlogs', updated);
    }
  };

  const handleDeleteBlog = (id: string) => {
    requestConfirmation('প্রবন্ধ ডিলিট', 'আপনি কি নিশ্চিত যে এই প্রবন্ধটি ডিলিট করতে চান?', async () => {
      const updated = blogs.filter(b => b.id !== id);
      setBlogs(updated);
      commitToDb({ blogs: updated }, 'প্রবন্ধ ডিলিট করা হয়েছে');
      const scriptUrl = settingsForm.googleSheetUrl || settingsForm.scriptUrl || db.settings.googleSheetUrl || db.settings.scriptUrl;
      if (scriptUrl) {
        await pushToGoogleSheets(scriptUrl, 'saveBlogs', updated);
      }
      closeConfirmModal();
    });
  };

  const handleSaveMember = (saved: MemberItem) => {
    const exists = members.some(m => m.id === saved.id);
    const updated = exists ? members.map(m => m.id === saved.id ? saved : m) : [...members, saved];
    setMembers(updated);
    commitToDb({ members: updated }, 'সদস্যের তথ্য সংরক্ষিত হয়েছে!');
    const scriptUrl = settingsForm.googleSheetUrl || settingsForm.scriptUrl || db.settings.googleSheetUrl || db.settings.scriptUrl;
    if (scriptUrl) {
      pushToGoogleSheets(scriptUrl, 'saveMembers', updated);
    }
  };

  const handleDeleteMember = (id: string) => {
    requestConfirmation('সদস্য তথ্য ডিলিট', 'আপনি কি নিশ্চিত যে এই সদস্যের তথ্য ডিলিট করতে চান?', async () => {
      const updated = members.filter(m => m.id !== id);
      setMembers(updated);
      commitToDb({ members: updated }, 'সদস্যের তথ্য ডিলিট করা হয়েছে');
      const scriptUrl = settingsForm.googleSheetUrl || settingsForm.scriptUrl || db.settings.googleSheetUrl || db.settings.scriptUrl;
      if (scriptUrl) {
        await pushToGoogleSheets(scriptUrl, 'saveMembers', updated);
      }
      closeConfirmModal();
    });
  };

  const handleSaveGallery = (saved: GalleryItem) => {
    const exists = gallery.some(g => g.id === saved.id);
    const updated = exists ? gallery.map(g => g.id === saved.id ? saved : g) : [saved, ...gallery];
    setGallery(updated);
    commitToDb({ gallery: updated }, 'গ্যালারি আইটেম সংরক্ষিত হয়েছে!');
    const scriptUrl = settingsForm.googleSheetUrl || settingsForm.scriptUrl || db.settings.googleSheetUrl || db.settings.scriptUrl;
    if (scriptUrl) {
      pushToGoogleSheets(scriptUrl, 'saveGallery', updated);
    }
  };

  const handleDeleteGallery = (id: string) => {
    requestConfirmation('গ্যালারি ছবি ডিলিট', 'আপনি কি নিশ্চিত যে এই গ্যালারি আইটেমটি ডিলিট করতে চান?', async () => {
      const updated = gallery.filter(g => g.id !== id);
      setGallery(updated);
      commitToDb({ gallery: updated }, 'গ্যালারি আইটেম ডিলিট করা হয়েছে');
      const scriptUrl = settingsForm.googleSheetUrl || settingsForm.scriptUrl || db.settings.googleSheetUrl || db.settings.scriptUrl;
      if (scriptUrl) {
        await pushToGoogleSheets(scriptUrl, 'saveGallery', updated);
      }
      closeConfirmModal();
    });
  };

  const handleSaveField = (saved: CustomFormField) => {
    const exists = customFields.some(f => f.id === saved.id);
    const updated = exists ? customFields.map(f => f.id === saved.id ? saved : f) : [...customFields, saved];
    setCustomFields(updated);
    commitToDb({ customFields: updated }, 'ফরমের ফিল্ড সংরক্ষিত হয়েছে!');
    const scriptUrl = settingsForm.googleSheetUrl || settingsForm.scriptUrl || db.settings.googleSheetUrl || db.settings.scriptUrl;
    if (scriptUrl) {
      pushToGoogleSheets(scriptUrl, 'saveCustomFields', updated);
    }
  };

  const handleSaveQnA = (saved: BotQnAItem) => {
    const exists = botQnA.some(q => q.id === saved.id);
    const updated = exists ? botQnA.map(q => q.id === saved.id ? saved : q) : [saved, ...botQnA];
    setBotQnA(updated);
    commitToDb({ botQnA: updated }, 'এআই প্রশ্নোত্তর সংরক্ষিত হয়েছে!');
    const scriptUrl = settingsForm.googleSheetUrl || settingsForm.scriptUrl || db.settings.googleSheetUrl || db.settings.scriptUrl;
    if (scriptUrl) {
      pushToGoogleSheets(scriptUrl, 'saveBotQnA', updated);
    }
  };

  const handleSaveSocial = (saved: SocialLinkItem) => {
    const exists = socialLinks.some(s => s.id === saved.id);
    const updated = exists ? socialLinks.map(s => s.id === saved.id ? saved : s) : [...socialLinks, saved];
    setSocialLinks(updated);
    commitToDb({ socialLinks: updated }, 'সোশ্যাল মিডিয়া লিংক সংরক্ষিত হয়েছে!');
    const scriptUrl = settingsForm.googleSheetUrl || settingsForm.scriptUrl || db.settings.googleSheetUrl || db.settings.scriptUrl;
    if (scriptUrl) {
      pushToGoogleSheets(scriptUrl, 'saveSocialLinks', updated);
    }
  };

  const handleDeleteSocial = (id: string) => {
    requestConfirmation('সোশ্যাল লিংক ডিলিট', 'আপনি কি নিশ্চিত যে এই সোশ্যাল প্ল্যাটফর্ম লিংকটি ডিলিট করতে চান?', async () => {
      const updated = socialLinks.filter(s => s.id !== id);
      setSocialLinks(updated);
      commitToDb({ socialLinks: updated }, 'সোশ্যাল লিংক ডিলিট করা হয়েছে');
      const scriptUrl = settingsForm.googleSheetUrl || settingsForm.scriptUrl || db.settings.googleSheetUrl || db.settings.scriptUrl;
      if (scriptUrl) {
        await pushToGoogleSheets(scriptUrl, 'saveSocialLinks', updated);
      }
      closeConfirmModal();
    });
  };

  const handleSaveQuote = (saved: MissionQuoteItem) => {
    const exists = missionQuotes.some(q => q.id === saved.id);
    const updated = exists ? missionQuotes.map(q => q.id === saved.id ? saved : q) : [saved, ...missionQuotes];
    setMissionQuotes(updated);
    commitToDb({ missionQuotes: updated }, 'উক্তি / হাদীস স্লাইডার সংরক্ষিত হয়েছে!');
    const scriptUrl = settingsForm.googleSheetUrl || settingsForm.scriptUrl || db.settings.googleSheetUrl || db.settings.scriptUrl;
    if (scriptUrl) {
      pushToGoogleSheets(scriptUrl, 'saveMissionQuotes', updated);
    }
  };

  const handleDeleteQuote = (id: string) => {
    requestConfirmation('উক্তি / আয়াত ডিলিট', 'আপনি কি নিশ্চিত যে এই উক্তি বা আয়াতটি ডিলিট করতে চান?', async () => {
      const updated = missionQuotes.filter(q => q.id !== id);
      setMissionQuotes(updated);
      commitToDb({ missionQuotes: updated }, 'উক্তি ডিলিট করা হয়েছে');
      const scriptUrl = settingsForm.googleSheetUrl || settingsForm.scriptUrl || db.settings.googleSheetUrl || db.settings.scriptUrl;
      if (scriptUrl) {
        await pushToGoogleSheets(scriptUrl, 'saveMissionQuotes', updated);
      }
      closeConfirmModal();
    });
  };

  /* ---------------- Delete Handlers for Volunteers, Messages & Donations ---------------- */
  const handleDeleteVolunteer = (id: string) => {
    requestConfirmation(
      'স্বেচ্ছাসেবক আবেদন ডিলিট',
      'আপনি কি নিশ্চিত যে এই আবেদনকারীর রেকর্ডটি ডিলিট করতে চান? এটি লোকাল এবং গুগল শিট উভয় জায়গা থেকেই স্থায়ীভাবে মুছে যাবে।',
      async () => {
        const updated = volunteers.filter(v => v.id !== id);
        setVolunteers(updated);
        commitToDb({ volunteers: updated }, 'স্বেচ্ছাসেবক আবেদন সফলভাবে ডিলিট করা হয়েছে');
        const scriptUrl = settingsForm.googleSheetUrl || settingsForm.scriptUrl || db.settings.googleSheetUrl || db.settings.scriptUrl;
        if (scriptUrl) {
          await pushToGoogleSheets(scriptUrl, 'saveVolunteers', updated);
        }
        closeConfirmModal();
      }
    );
  };

  const handleDeleteMessage = (id: string) => {
    requestConfirmation(
      'বার্তা ডিলিট',
      'আপনি কি নিশ্চিত যে এই বার্তাটি ডিলিট করতে চান? এটি লোকাল এবং গুগল শিট উভয় জায়গা থেকেই স্থায়ীভাবে মুছে যাবে।',
      async () => {
        const updated = messages.filter(m => m.id !== id);
        setMessages(updated);
        commitToDb({ messages: updated }, 'বার্তা সফলভাবে ডিলিট করা হয়েছে');
        const scriptUrl = settingsForm.googleSheetUrl || settingsForm.scriptUrl || db.settings.googleSheetUrl || db.settings.scriptUrl;
        if (scriptUrl) {
          await pushToGoogleSheets(scriptUrl, 'saveMessages', updated);
        }
        closeConfirmModal();
      }
    );
  };

  const handleDeleteDonation = (id: string) => {
    requestConfirmation(
      'অনুদানের রেকর্ড ডিলিট',
      'আপনি কি নিশ্চিত যে এই অনুদানের রেকর্ডটি ডিলিট করতে চান? এটি লোকাল এবং গুগল শিট উভয় জায়গা থেকেই স্থায়ীভাবে মুছে যাবে।',
      async () => {
        const updated = donations.filter(d => d.id !== id);
        setDonations(updated);
        commitToDb({ donations: updated }, 'অনুদানের রেকর্ড সফলভাবে ডিলিট করা হয়েছে');
        const scriptUrl = settingsForm.googleSheetUrl || settingsForm.scriptUrl || db.settings.googleSheetUrl || db.settings.scriptUrl;
        if (scriptUrl) {
          await pushToGoogleSheets(scriptUrl, 'saveDonations', updated);
        }
        closeConfirmModal();
      }
    );
  };

  // If not logged in, render Islamic Admin Login Screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-serif-bn">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200 text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-100 rounded-full blur-2xl pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-lg border border-emerald-800 overflow-hidden">
            {db.settings.logoUrl ? (
              <img
                src={formatDriveImageUrl(db.settings.logoUrl)}
                alt={db.settings.foundationName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <Lock className="w-8 h-8" />
            )}
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1">
            ফাউন্ডেশন এডমিন প্যানেল
          </h2>
          <p className="text-xs text-slate-500 font-sans-bn mb-6">
            গুগল শিট ডাটাবেস ও ওয়েবসাইট কনফিগারেশনে প্রবেশ করতে পাসওয়ার্ড প্রদান করুন
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="নির্ধারিত এডমিন পাসওয়ার্ড লিখুন"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-4 pr-11 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-sans focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title={showLoginPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authError && (
                <p className="text-xs text-rose-600 font-sans-bn mt-2.5 text-left flex items-start gap-1.5 p-2.5 bg-rose-50 border border-rose-200 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-700/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>লগইন করুন</span>
            </button>
          </form>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-sans-bn">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>শুধুমাত্র নির্ধারিত ও হালনাগাদকৃত পাসওয়ার্ড কার্যকর</span>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-600 font-sans-bn transition-colors cursor-pointer"
            >
              ← ওয়েবসাইটে ফিরে যান
            </button>
          </div>
        </div>
      </div>
    );
  }

  const navTabs: { id: AdminTab; label: string; icon: any; count?: number; badge?: string }[] = [
    { id: 'theme', label: 'কালার and থিম', icon: Palette, badge: 'রঙ' },
    { id: 'quotes', label: 'দর্শন, আয়াত ও হাদীস', icon: Sparkles, count: missionQuotes.length, badge: 'স্লাইডার' },
    { id: 'social_media', label: 'সোশ্যাল মিডিয়া ও লিংক', icon: Share2, count: socialLinks.length, badge: 'লিংক' },
    { id: 'volunteer_form', label: 'ভলান্টিয়ার ফরম', icon: FileText, badge: 'কাস্টম' },
    { id: 'bot_qna', label: 'ইসলামিক এআই চ্যাটবট (Q&A)', icon: Bot, count: botQnA.length, badge: 'এআই' },
    { id: 'script', label: 'গুগল শিট ও স্ক্রিপ্ট', icon: Code },
    { id: 'settings', label: 'সাধারণ তথ্য ও সেটিংস', icon: Settings },
    { id: 'slides', label: 'ইমেজ স্লাইডার', icon: ImageIcon, count: slides.length },
    { id: 'notices', label: 'নোটিস বোর্ড', icon: Bell, count: notices.length },
    { id: 'activities', label: 'কার্যক্রমসমূহ', icon: HeartHandshake, count: activities.length },
    { id: 'blogs', label: 'ব্লগ ও প্রবন্ধ', icon: BookOpen, count: blogs.length },
    { id: 'members', label: 'কমিটি ও সদস্য', icon: Users, count: members.length },
    { id: 'gallery', label: 'ফটোগ্যালারি', icon: Layers, count: gallery.length },
    { id: 'volunteers', label: 'স্বেচ্ছাসেবক আবেদন', icon: Users, count: volunteers.length },
    { id: 'messages', label: 'বার্তা ও ইনবক্স', icon: MessageSquare, count: messages.length },
    { id: 'donations', label: 'অনুদানের রেকর্ড', icon: DollarSign, count: donations.length }
  ];

  const currentTabObj = navTabs.find(t => t.id === activeTab) || navTabs[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col overflow-hidden animate-fade-in font-serif-bn">
      
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-950 text-emerald-100 border border-emerald-700 shadow-2xl flex items-center gap-2.5 animate-bounce text-xs font-sans-bn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{saveToast}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="px-3 sm:px-6 py-2.5 sm:py-3 bg-emerald-950 text-white flex items-center justify-between border-b border-emerald-900 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-700/60 transition-colors cursor-pointer flex items-center gap-1.5"
            title="সব পেজ বা সাইড মেনু খুলুন"
          >
            <Menu className="w-4 h-4" />
            <span className="text-xs font-bold font-serif-bn">মেনু</span>
          </button>

          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-900 flex items-center justify-center text-emerald-300 font-bold border border-emerald-700 shrink-0 overflow-hidden">
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
              '☪'
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-xs sm:text-base md:text-lg font-bold text-white leading-tight truncate">
              {db.settings.foundationName} — কন্ট্রোল প্যানেল
            </h1>
            <p className="text-[10px] sm:text-[11px] text-emerald-300/80 font-sans-bn hidden sm:block">
              রিয়েলটাইম ওয়েবসাইট ডাটাবেস ও কনফিগারেশন
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Go to Website Button */}
          <button
            onClick={onClose}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-emerald-950 font-bold text-xs font-serif-bn transition-all flex items-center gap-1 sm:gap-1.5 shadow-sm cursor-pointer"
            title="এডমিন প্যানেল থেকে মূল ওয়েবসাইটে যান"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-950" />
            <span className="hidden sm:inline">ওয়েবসাইটে যান</span>
          </button>

          {/* Change Password Button in Header */}
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-100 hover:text-white text-xs font-bold font-serif-bn transition-all flex items-center gap-1 cursor-pointer border border-emerald-700/80 shadow-xs"
            title="এডমিন পাসওয়ার্ড পরিবর্তন করুন"
          >
            <Key className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">পাসওয়ার্ড পরিবর্তন</span>
          </button>

          {/* Quick Sheet Pull / Refresh Button */}
          <button
            onClick={onPullFromSheet}
            disabled={isSyncing}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-emerald-200 hover:text-white text-xs font-serif-bn transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 border border-emerald-700/80"
            title="গুগল শিট থেকে সর্বশেষ ডাটা সিঙ্ক / পুল করুন"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden lg:inline">শিট থেকে সিঙ্ক</span>
          </button>

          {/* Quick Sheet Push Button */}
          <button
            onClick={onPushToSheet}
            disabled={isSyncing}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-serif-bn shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="সকল আপডেট ডাটা গুগল শিটে পুশ / সংরক্ষণ করুন"
          >
            <Save className="w-3.5 h-3.5" />
            <span>শিটে পুশ করুন</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 hover:bg-rose-900 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="এডমিন প্যানেল বন্ধ করুন"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      {/* Main Admin Content Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Navigation Sidebar (Desktop View - Always on the Side, instant in-place switching) */}
        <aside className="hidden md:flex w-64 lg:w-72 bg-white border-r border-slate-200 flex-col justify-between overflow-y-auto shrink-0 shadow-xs">
          <div className="p-3 space-y-1">
            {/* Quick Back to Website button in sidebar */}
            <div className="mb-2">
              <button
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/70 text-xs font-bold font-serif-bn transition-all cursor-pointer shadow-2xs"
              >
                <Globe className="w-3.5 h-3.5 text-amber-700" />
                <span>ওয়েবসাইটে ফিরে যান</span>
              </button>
            </div>

            <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans-bn">
              ম্যানেজমেন্ট মেনু
            </div>

            {navTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold font-serif-bn transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-emerald-950 text-white shadow-md shadow-emerald-950/20' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </div>

                  {tab.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-emerald-800 text-emerald-200' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {tab.badge}
                    </span>
                  )}

                  {tab.count !== undefined && !tab.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                      isActive ? 'bg-emerald-900 text-emerald-200' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-3 border-t border-slate-100 flex flex-col gap-2 bg-slate-50/50">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-sans-bn">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-600" />
                <span>পাসওয়ার্ড স্ট্যাটাস:</span>
              </span>
              <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px] flex items-center gap-1">
                <span>••••••••</span>
                <span className="text-[9px] bg-emerald-600 text-white px-1 py-0.2 rounded-xs">সক্রিয়</span>
              </span>
            </div>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 active:scale-98 text-emerald-800 border border-emerald-200 font-bold text-xs font-serif-bn flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-emerald-700" />
              <span>পাসওয়ার্ড পরিবর্তন করুন</span>
            </button>
          </div>
        </aside>

        {/* Mobile Left-Side Slide-in Drawer Menu (Slides from the LEFT, never opens a bottom window!) */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-slate-950/60 backdrop-blur-xs flex justify-start animate-fade-in font-serif-bn">
            <div className="w-72 sm:w-80 max-w-[85vw] bg-white h-full border-r border-slate-200 shadow-2xl flex flex-col p-4 overflow-y-auto">
              
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-950 text-emerald-300 flex items-center justify-center text-sm font-bold">
                    ☪
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">সাইড নেভিগেশন</h3>
                    <p className="text-[10px] text-slate-500 font-sans-bn">ট্যাব নির্বাচন করুন</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                  title="মেনু বন্ধ করুন"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Go to Website */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onClose();
                }}
                className="w-full mb-3 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs font-serif-bn shadow-xs cursor-pointer"
              >
                <Globe className="w-4 h-4 text-emerald-950" />
                <span>ওয়েবসাইটে ফিরে যান</span>
              </button>

              {/* Tab List */}
              <div className="space-y-1 py-1 flex-1">
                {navTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold font-serif-bn transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-950 text-white shadow-md'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-slate-500'}`} />
                        <span>{tab.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {tab.badge && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isActive ? 'bg-emerald-800 text-emerald-200' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {tab.badge}
                          </span>
                        )}
                        {tab.count !== undefined && !tab.badge && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                            isActive ? 'bg-emerald-900 text-emerald-200' : 'bg-white border border-slate-200 text-slate-600'
                          }`}>
                            {tab.count}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Drawer Footer with Change Password */}
              <div className="pt-3 mt-2 border-t border-slate-100 space-y-2 shrink-0">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-sans-bn">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-emerald-600" />
                    <span>পাসওয়ার্ড:</span>
                  </span>
                  <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px] flex items-center gap-1">
                    <span>••••••••</span>
                    <span className="text-[9px] bg-emerald-600 text-white px-1 py-0.2 rounded-xs">সক্রিয়</span>
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsPasswordModalOpen(true);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 active:scale-98 text-emerald-800 border border-emerald-200 font-bold text-xs font-serif-bn flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5 text-emerald-700" />
                  <span>পাসওয়ার্ড পরিবর্তন করুন</span>
                </button>
              </div>
            </div>

            {/* Click outside backdrop to close */}
            <div 
              className="flex-1"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </div>
        )}

        {/* Right Tab Content View (Clean main workspace) */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 bg-slate-50 w-full">
          <div className="max-w-5xl mx-auto">

            {/* Persistent Google Sheets Sync Bar across all tabs */}
            <TabSyncActionBar
              tabTitle={currentTabObj.label}
              hasScriptUrl={Boolean(db.settings.googleSheetUrl || db.settings.scriptUrl || settingsForm.googleSheetUrl || settingsForm.scriptUrl)}
              isSyncing={isSyncing}
              onPushToSheet={onPushToSheet}
              onPullFromSheet={onPullFromSheet}
              onNavigateToScriptTab={() => setActiveTab('script')}
            />

            {/* TAB 1: THEME & COLOR SETTINGS */}
            {activeTab === 'theme' && (
              <ThemeTab
                settings={settingsForm}
                onChangeSettings={(newS) => {
                  setSettingsForm(newS);
                  commitToDb({ settings: newS }, 'কালার ও থিম আপডেট করা হয়েছে');
                }}
                onSave={() => commitToDb({ settings: settingsForm }, 'কালার ও থিম সফলভাবে সংরক্ষিত হয়েছে!')}
              />
            )}

            {/* TAB: MISSION QUOTES, QURAN & HADITH SLIDER */}
            {activeTab === 'quotes' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-600" />
                      <span>মূল দর্শন, হাদীস ও কুরআনের আয়াত স্লাইডার ({missionQuotes.length})</span>
                    </h2>
                    <p className="text-xs text-slate-500 font-sans-bn mt-1">
                      হোমপেজের 'মূল দর্শন ও অঙ্গীকার' সেকশনে স্বয়ংক্রিয়ভাবে পরিবর্তিত হওয়া আয়াত ও হাদীস নিয়ন্ত্রণ করুন
                    </p>
                  </div>

                  <button
                    onClick={() => setEditingQuote({ isOpen: true, item: null })}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন উক্তি / আয়াত যোগ করুন</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {missionQuotes.map((mq) => (
                    <div 
                      key={mq.id} 
                      className={`p-5 rounded-2xl bg-white border transition-all shadow-xs space-y-3 relative ${
                        mq.active ? 'border-emerald-200' : 'border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold font-serif-bn">
                          {mq.category || 'উক্তি'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setEditingQuote({ isOpen: true, item: mq })}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 cursor-pointer"
                            title="সম্পাদনা করুন"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuote(mq.id)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {mq.arabicText && (
                        <p className="text-right text-sm font-arabic text-emerald-950 font-medium" dir="rtl">
                          {mq.arabicText}
                        </p>
                      )}

                      <p className="text-xs text-slate-700 font-serif-bn leading-relaxed">
                        "{mq.quote}"
                      </p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-serif-bn">
                        <span className="font-semibold text-emerald-900">— {mq.source}</span>
                        <span className="text-[10px] text-slate-400">ক্রম: {mq.order || 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: SOCIAL MEDIA & PLATFORM LINKS */}
            {activeTab === 'social_media' && (
              <SocialMediaTab
                socialLinks={socialLinks}
                settings={settingsForm}
                onChangeSocialLinks={(newLinks) => {
                  setSocialLinks(newLinks);
                  commitToDb({ socialLinks: newLinks }, 'সোশ্যাল মিডিয়া তালিকা আপডেট করা হয়েছে');
                }}
                onUpdateSettings={(newS) => {
                  setSettingsForm(newS);
                  commitToDb({ settings: newS }, 'সোশ্যাল মিডিয়া সেটিংস সংরক্ষিত হয়েছে');
                }}
                onOpenSocialModal={(item) => setEditingSocial({ isOpen: true, item: item || null })}
              />
            )}

            {/* TAB 2: VOLUNTEER FORM CUSTOMIZATION */}
            {activeTab === 'volunteer_form' && (
              <VolunteerFormTab
                customFields={customFields}
                settings={settingsForm}
                onChangeCustomFields={(newFields) => {
                  setCustomFields(newFields);
                  commitToDb({ customFields: newFields }, 'স্বেচ্ছাসেবক ফরম ফিল্ড আপডেট করা হয়েছে');
                }}
                onUpdateSettings={(newS) => {
                  setSettingsForm(newS);
                  commitToDb({ settings: newS }, 'স্বেচ্ছাসেবক ফরম সেটিংস সংরক্ষিত হয়েছে');
                }}
                onOpenFieldModal={(field) => setEditingField({ isOpen: true, item: field || null })}
              />
            )}

            {/* TAB: BOT Q&A MANAGEMENT */}
            {activeTab === 'bot_qna' && (
              <BotQnATab
                botQnA={botQnA}
                settings={settingsForm}
                onChangeBotQnA={(newQnA) => {
                  setBotQnA(newQnA);
                  commitToDb({ botQnA: newQnA }, 'এআই প্রশ্নোত্তর তালিকা আপডেট করা হয়েছে');
                }}
                onUpdateSettings={(newS) => {
                  setSettingsForm(newS);
                  commitToDb({ settings: newS }, 'এআই চ্যাটবট সেটিংস সংরক্ষিত হয়েছে');
                }}
                onOpenQnAModal={(item) => setEditingQnA({ isOpen: true, item: item || null })}
              />
            )}

            {/* TAB 3: GOOGLE APPS SCRIPT & SYNC SETUP */}
            {activeTab === 'script' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Code className="w-5 h-5 text-emerald-600" />
                      <span>গুগল শিট ও অ্যাপস স্ক্রিপ্ট ব্যাকএন্ড সেটআপ</span>
                    </h2>
                    <p className="text-xs text-slate-500 font-sans-bn mt-1">
                      গুগল শিটের সাথে সংযোগ করে ১টি এপিআই দিয়ে সকল ডাটা স্বয়ংক্রিয়ভাবে সিঙ্ক করুন
                    </p>
                  </div>

                  <button
                    onClick={copyAppsScript}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode ? 'কোড কপি হয়েছে!' : 'Apps Script কোড কপি করুন'}</span>
                  </button>
                </div>

                {/* Step-by-step Setup instructions */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                  {/* Connected Spreadsheet Box */}
                  <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-sans-bn">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                        <span className="text-xs font-bold text-emerald-950 font-serif-bn">সংযুক্ত গুগল স্প্রেডশীট (Google Sheet)</span>
                      </div>
                      <p className="text-[11px] text-emerald-800 font-mono break-all">
                        {TARGET_SPREADSHEET_URL}
                      </p>
                    </div>
                    <a
                      href={TARGET_SPREADSHEET_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer font-serif-bn"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>গুগল শিট খুলুন</span>
                    </a>
                  </div>

                  <h3 className="text-sm font-bold text-slate-800">
                    ৩ মিনিটে ফ্রি গুগল শিট ডাটাবেস চালু করার নিয়মাবলী:
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans-bn">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold mb-2">১</div>
                      <h4 className="font-bold text-slate-900 mb-1">গুগল শিট খুলুন</h4>
                      <p className="text-slate-600 leading-relaxed">
                        উপরের <strong>"গুগল শিট খুলুন"</strong> বাটনে ক্লিক করে শিটটি ওপেন করুন। এরপর মেনুবার থেকে <strong>Extensions → Apps Script</strong>-এ যান।
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold mb-2">২</div>
                      <h4 className="font-bold text-slate-900 mb-1">কোড পেস্ট ও ডিপ্লয়</h4>
                      <p className="text-slate-600 leading-relaxed">
                        Apps Script-এ বিদ্যমান কোড মুছে উপরের <strong>"Apps Script কোড কপি করুন"</strong> বাটন থেকে কপি করা কোড পেস্ট করুন এবং <strong>Deploy → New deployment → Web app</strong> (Anyone access) সিলেক্ট করে ডিপ্লয় করুন।
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold mb-2">৩</div>
                      <h4 className="font-bold text-slate-900 mb-1">Web App URL পেস্ট</h4>
                      <p className="text-slate-600 leading-relaxed">
                        প্রাপ্ত Web App URL-টি নিচের বক্সে পেস্ট করে সেভ করুন। এখন থেকে সকল ডাটা রিয়েলটাইমে গুগল শিটের সাথে সিঙ্ক থাকবে!
                      </p>
                    </div>
                  </div>

                  {/* Web App URL Config Input */}
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-800">
                        গুগল অ্যাপস স্ক্রিপ্ট ওয়েব অ্যাপ URL (Web App URL) <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = {
                            ...settingsForm,
                            googleSheetUrl: DEFAULT_DEPLOYED_APP_SCRIPT_URL,
                            scriptUrl: DEFAULT_DEPLOYED_APP_SCRIPT_URL
                          };
                          setSettingsForm(updated);
                          commitToDb({ settings: updated }, 'ডিফল্ট Apps Script URL রিস্টোর করা হয়েছে!');
                        }}
                        className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer"
                      >
                        ডিফল্ট URL ব্যবহার করুন
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="url"
                        placeholder="https://script.google.com/macros/s/.../exec"
                        value={settingsForm.googleSheetUrl || settingsForm.scriptUrl || DEFAULT_DEPLOYED_APP_SCRIPT_URL}
                        onChange={(e) => setSettingsForm({ ...settingsForm, googleSheetUrl: e.target.value, scriptUrl: e.target.value })}
                        className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        onClick={() => {
                          const updated = {
                            ...settingsForm,
                            googleSheetUrl: settingsForm.googleSheetUrl || settingsForm.scriptUrl || DEFAULT_DEPLOYED_APP_SCRIPT_URL,
                            scriptUrl: settingsForm.scriptUrl || settingsForm.googleSheetUrl || DEFAULT_DEPLOYED_APP_SCRIPT_URL
                          };
                          commitToDb({ settings: updated }, 'গুগল শিট URL সংরক্ষিত হয়েছে!');
                        }}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer shrink-0"
                      >
                        URL সেভ করুন
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: GENERAL SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-emerald-600" />
                      <span>সাধারণ তথ্য ও কন্টাক্ট সেটিংস</span>
                    </h2>
                    <p className="text-xs text-slate-500 font-sans-bn mt-1">
                      ফাউন্ডেশনের নাম, স্লোগান, ঠিকানা, হেল্পলাইন ও ডোনেশন অ্যাকাউন্ট নম্বরসমূহ
                    </p>
                  </div>

                  <button
                    onClick={() => commitToDb({ settings: settingsForm }, 'সেটিংস সংরক্ষিত হয়েছে!')}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>সেটিংস সেভ করুন</span>
                  </button>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs font-sans-bn">
                  {/* Unified Logo & Icon URL Section */}
                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <label className="block font-bold text-emerald-950 mb-1 font-serif-bn text-sm flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-emerald-700" />
                          <span>ফাউন্ডেশন লোগো ও আইকন ইমেজ URL (একত্রিত লোগো সিস্টেম)</span>
                        </label>
                        <p className="text-[11px] text-emerald-800/80 mb-2">
                          এখানে যেকোনো ইমেজ বা গুগল ড্রাইভের শেয়ার লিংক দিলে স্বয়ংক্রিয়ভাবে হেডার, ফুটার, এডমিন প্যানেল, চ্যাটবট ও ব্রাউজার ট্যাবের সকল আইকন ও লোগো আপডেট হয়ে যাবে।
                        </p>
                        <input
                          type="text"
                          placeholder="ইমেজ লিংক দিন (যেমন: https://drive.google.com/file/d/... অথবা https://.../logo.png)"
                          value={settingsForm.logoUrl || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-emerald-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 font-sans"
                        />
                      </div>

                      {/* Live Thumbnail Preview */}
                      <div className="flex flex-col items-center gap-1.5 shrink-0 self-center sm:self-end">
                        <span className="text-[10px] font-bold text-slate-500 font-serif-bn">লোগো প্রিভিউ:</span>
                        <div className="w-14 h-14 rounded-xl border-2 border-emerald-600 bg-white shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                          {settingsForm.logoUrl ? (
                            <img
                              src={formatDriveImageUrl(settingsForm.logoUrl)}
                              alt="Logo Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="text-2xl text-emerald-700">☪</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1 font-serif-bn">ফাউন্ডেশনের নাম</label>
                      <input
                        type="text"
                        value={settingsForm.foundationName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, foundationName: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1 font-serif-bn">ইংরেজি নাম</label>
                      <input
                        type="text"
                        value={settingsForm.foundationNameEn || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, foundationNameEn: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1 font-serif-bn">স্লোগান / বাণী</label>
                    <input
                      type="text"
                      value={settingsForm.slogan}
                      onChange={(e) => setSettingsForm({ ...settingsForm, slogan: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1 font-serif-bn">মোবাইল / হেল্পলাইন</label>
                      <input
                        type="text"
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1 font-serif-bn">ইমেইল</label>
                      <input
                        type="email"
                        value={settingsForm.email}
                        onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1 font-serif-bn">এডমিন পাসওয়ার্ড নিরাপত্তা</label>
                      <button
                        type="button"
                        onClick={() => setIsPasswordModalOpen(true)}
                        className="w-full px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold font-serif-bn text-emerald-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Key className="w-3.5 h-3.5 text-emerald-700" />
                        <span>পাসওয়ার্ড পরিবর্তন করুন</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1 font-serif-bn">অফিসের ঠিকানা</label>
                    <input
                      type="text"
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif-bn focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Donation Accounts */}
                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="font-bold text-slate-900 font-serif-bn text-sm mb-3">
                      অনুদানের মোবাইল ব্যাংকিং অ্যাকাউন্টসমূহ:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">বিকাশ (bKash)</label>
                        <input
                          type="text"
                          value={settingsForm.bkashNumber || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, bkashNumber: e.target.value })}
                          placeholder="০১৭... (পার্সোনাল/মার্চেন্ট)"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">নগদ (Nagad)</label>
                        <input
                          type="text"
                          value={settingsForm.nagadNumber || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, nagadNumber: e.target.value })}
                          placeholder="০১৮... (পার্সোনাল/মার্চেন্ট)"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">রকেট (Rocket)</label>
                        <input
                          type="text"
                          value={settingsForm.rocketNumber || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, rocketNumber: e.target.value })}
                          placeholder="০১৯... (পার্সোনাল)"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: SLIDES (Window Modal Trigger) */}
            {activeTab === 'slides' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-emerald-600" />
                      <span>হোম ইমেজ ও ভিডিও স্লাইডার ({slides.length})</span>
                    </h2>
                    <p className="text-xs text-slate-500 font-sans-bn mt-1">
                      হোমপেজের মূল ব্যানারে প্রদর্শিত স্লাইড ও ভিডিও নিয়ন্ত্রণ করুন
                    </p>
                  </div>

                  <button
                    onClick={() => setEditingSlide({ isOpen: true, item: null })}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন স্লাইড যুক্ত করুন</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {slides.map((slide, idx) => (
                    <div key={slide.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between gap-3">
                      <div className="space-y-2">
                        <div className="w-full h-36 rounded-xl bg-slate-100 overflow-hidden relative">
                          <SmartImage src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                          <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md bg-emerald-950/80 text-white text-[10px] font-bold">
                            স্লাইড #{idx + 1}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{slide.title}</h4>
                        <p className="text-xs text-slate-500 font-sans-bn line-clamp-2">{slide.subtitle}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${slide.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {slide.active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingSlide({ isOpen: true, item: slide })}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 cursor-pointer"
                            title="সম্পাদনা করুন"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSlide(slide.id)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                            title="ডিলিট করুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: NOTICES (Window Modal Trigger) */}
            {activeTab === 'notices' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Bell className="w-5 h-5 text-emerald-600" />
                      <span>নোটিস বোর্ড ম্যানেজমেন্ট ({notices.length})</span>
                    </h2>
                    <p className="text-xs text-slate-500 font-sans-bn mt-1">
                      জরুরি বিজ্ঞপ্তি ও সাধারণ নোটিস যোগ বা সম্পাদনা করুন
                    </p>
                  </div>

                  <button
                    onClick={() => setEditingNotice({ isOpen: true, item: null })}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন নোটিস যুক্ত করুন</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {notices.map((notice) => (
                    <div key={notice.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 font-mono">{notice.date}</span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                            {notice.category}
                          </span>
                          {notice.isImportant && (
                            <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold">
                              জরুরি
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">{notice.title}</h4>
                        <p className="text-xs text-slate-500 font-sans-bn line-clamp-1">{notice.description}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setEditingNotice({ isOpen: true, item: notice })}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteNotice(notice.id)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: ACTIVITIES (Window Modal Trigger) */}
            {activeTab === 'activities' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <HeartHandshake className="w-5 h-5 text-emerald-600" />
                      <span>কার্যক্রম ও সেবামূলক প্রজেক্টসমূহ ({activities.length})</span>
                    </h2>
                    <p className="text-xs text-slate-500 font-sans-bn mt-1">
                      আর্তমানবতার সেবামূলক সকল প্রকল্প ও অনুদান সংগ্রহ কার্যক্রম
                    </p>
                  </div>

                  <button
                    onClick={() => setEditingActivity({ isOpen: true, item: null })}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন কার্যক্রম যুক্ত করুন</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activities.map((act) => (
                    <div key={act.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between gap-3">
                      <div className="space-y-2">
                        <div className="w-full h-36 rounded-xl bg-slate-100 overflow-hidden relative">
                          <SmartImage src={act.imageUrl} alt={act.title} className="w-full h-full object-cover" />
                          <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md bg-emerald-900 text-white text-[10px] font-bold">
                            {act.category}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{act.title}</h4>
                        <p className="text-xs text-slate-500 font-sans-bn line-clamp-2">{act.shortDesc}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-xs font-bold text-emerald-700 font-mono">
                          লক্ষ্য: ৳{act.targetAmount.toLocaleString('bn-BD')}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingActivity({ isOpen: true, item: act })}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteActivity(act.id)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 8: BLOGS (Window Modal Trigger) */}
            {activeTab === 'blogs' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-emerald-600" />
                      <span>ইসলামিক ব্লগ ও প্রবন্ধ ({blogs.length})</span>
                    </h2>
                    <p className="text-xs text-slate-500 font-sans-bn mt-1">
                      দ্বীনি ও সেবামূলক আর্টিকেলের তালিকা
                    </p>
                  </div>

                  <button
                    onClick={() => setEditingBlog({ isOpen: true, item: null })}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন প্রবন্ধ লিখুন</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {blogs.map((b) => (
                    <div key={b.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                          {b.category}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">{b.title}</h4>
                        <p className="text-xs text-slate-500 font-sans-bn line-clamp-1">{b.excerpt}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setEditingBlog({ isOpen: true, item: b })}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(b.id)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 9: MEMBERS (Window Modal Trigger) */}
            {activeTab === 'members' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-600" />
                      <span>কমিটি ও সদস্যবৃন্দ ({members.length})</span>
                    </h2>
                    <p className="text-xs text-slate-500 font-sans-bn mt-1">
                      উপদেষ্টা, কার্যনির্বাহী পরিষদ ও সাধারণ সদস্যদের তালিকা
                    </p>
                  </div>

                  <button
                    onClick={() => setEditingMember({ isOpen: true, item: null })}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন সদস্য যুক্ত করুন</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {members.map((mem) => (
                    <div key={mem.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between gap-3 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full overflow-hidden mb-2 border-2 border-emerald-500 shadow-xs">
                          <SmartAvatar src={mem.photoUrl} alt={mem.name} className="w-full h-full object-cover" />
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">{mem.name}</h4>
                        <p className="text-xs text-emerald-700 font-bold font-serif-bn">{mem.designation}</p>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] mt-1">
                          {mem.category}
                        </span>
                      </div>

                      <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => setEditingMember({ isOpen: true, item: mem })}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(mem.id)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 10: GALLERY (Window Modal Trigger) */}
            {activeTab === 'gallery' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-emerald-600" />
                      <span>ফটোগ্যালারি ও ভিডিও ডকুমেন্টারি ({gallery.length})</span>
                    </h2>
                    <p className="text-xs text-slate-500 font-sans-bn mt-1">
                      ছবি ও ভিডিও প্রদর্শনীর ডাটাবেস
                    </p>
                  </div>

                  <button
                    onClick={() => setEditingGallery({ isOpen: true, item: null })}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন ছবি / ভিডিও যোগ করুন</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {gallery.map((g) => (
                    <div key={g.id} className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                      <div className="w-full h-32 rounded-xl bg-slate-100 overflow-hidden">
                        <SmartImage src={g.imageUrl} alt={g.title} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{g.title}</h4>
                      
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400 font-mono">{g.date}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setEditingGallery({ isOpen: true, item: g })}
                            className="p-1 rounded-md bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteGallery(g.id)}
                            className="p-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 11: VOLUNTEERS (WITH DEDICATED DELETE BUTTON) */}
            {activeTab === 'volunteers' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-600" />
                      <span>স্বেচ্ছাসেবক আবেদনপত্রসমূহ ({volunteers.length})</span>
                    </h2>
                    <p className="text-xs text-slate-500 font-sans-bn mt-1">
                      ওয়েবসাইট থেকে আসা স্বেচ্ছাসেবকদের তথ্যাদি ও ডিলিট অপশন
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {volunteers.length === 0 ? (
                    <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center text-slate-400 text-sm">
                      এখনো কোনো আবেদন জমা পড়েনি।
                    </div>
                  ) : (
                    volunteers.map((vol) => (
                      <div key={vol.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-sm text-slate-900">{vol.fullName}</h4>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold font-mono">
                              {vol.phone}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">
                              {vol.district}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold">
                              রক্ত: {vol.bloodGroup}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 font-sans-bn">
                            <strong>আগ্রহের খাত:</strong> {vol.interestArea} | <strong>পেশা:</strong> {vol.profession || 'উল্লেখ নেই'}
                          </p>

                          {vol.extraAnswers && Object.keys(vol.extraAnswers).length > 0 && (
                            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700 font-sans-bn mt-1">
                              <strong>কাস্টম প্রশ্নের উত্তর: </strong>
                              {Object.entries(vol.extraAnswers).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                            </div>
                          )}

                          {vol.message && (
                            <p className="text-xs text-slate-500 italic font-sans-bn">"{vol.message}"</p>
                          )}
                        </div>

                        {/* Prominent Red Delete Button */}
                        <button
                          onClick={() => handleDeleteVolunteer(vol.id)}
                          className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold font-serif-bn transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 self-end sm:self-center"
                          title="এই আবেদনটি ডিলিট করুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>ডিলেট</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 12: MESSAGES (WITH DEDICATED DELETE BUTTON) */}
            {activeTab === 'messages' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-emerald-600" />
                      <span>যোগাযোগ বার্তা ও ইনবক্স ({messages.length})</span>
                    </h2>
                    <p className="text-xs text-slate-500 font-sans-bn mt-1">
                      ওয়েবসাইটের যোগাযোগ ফরম থেকে আসা মেসেজসমূহ
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {messages.length === 0 ? (
                    <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center text-slate-400 text-sm">
                      ইনবক্সে কোনো বার্তা নেই।
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900">{msg.name}</h4>
                            <span className="text-xs text-slate-400 font-mono">{msg.date}</span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono">
                              {msg.phone || msg.email}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-emerald-800 font-sans-bn">বিষয়: {msg.subject}</p>
                          <p className="text-xs text-slate-600 font-sans-bn leading-relaxed">{msg.message}</p>
                        </div>

                        {/* Prominent Red Delete Button */}
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold font-serif-bn transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 self-end sm:self-center"
                          title="এই বার্তাটি ডিলিট করুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>ডিলেট</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 13: DONATIONS (WITH DEDICATED DELETE BUTTON) */}
            {activeTab === 'donations' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                      <span>অনুদানের রেকর্ড ও ট্রানজেকশন ({donations.length})</span>
                    </h2>
                    <p className="text-xs text-slate-500 font-sans-bn mt-1">
                      দানকারীদের ট্রানজেকশন আইডি ও অনুদানের তথ্য
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {donations.length === 0 ? (
                    <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center text-slate-400 text-sm">
                      এখনো কোনো অনুদানের রেকর্ড জমা পড়েনি।
                    </div>
                  ) : (
                    donations.map((don) => (
                      <div key={don.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-sm text-slate-900">{don.donorName || 'বেনামী দানকারী'}</h4>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-bold font-mono">
                              ৳{don.amount.toLocaleString('bn-BD')}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                              {don.paymentMethod}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-mono">
                              TrxID: {don.transactionId}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-sans-bn">
                            খাত: <strong>{don.purpose}</strong> | ফোন: {don.phone} | তারিখ: {don.date}
                          </p>
                        </div>

                        {/* Prominent Red Delete Button */}
                        <button
                          onClick={() => handleDeleteDonation(don.id)}
                          className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold font-serif-bn transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 self-end sm:self-center"
                          title="এই অনুদানের রেকর্ডটি ডিলিট করুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>ডিলেট</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* ALL POPUP MODAL WINDOWS (ভাইন্ডো) */}
      <SlideModal
        isOpen={editingSlide.isOpen}
        slide={editingSlide.item}
        onSave={handleSaveSlide}
        onClose={() => setEditingSlide({ isOpen: false, item: null })}
      />

      <NoticeModal
        isOpen={editingNotice.isOpen}
        notice={editingNotice.item}
        onSave={handleSaveNotice}
        onClose={() => setEditingNotice({ isOpen: false, item: null })}
      />

      <ActivityModal
        isOpen={editingActivity.isOpen}
        activity={editingActivity.item}
        onSave={handleSaveActivity}
        onClose={() => setEditingActivity({ isOpen: false, item: null })}
      />

      <BlogModal
        isOpen={editingBlog.isOpen}
        blog={editingBlog.item}
        onSave={handleSaveBlog}
        onClose={() => setEditingBlog({ isOpen: false, item: null })}
      />

      <MemberModal
        isOpen={editingMember.isOpen}
        member={editingMember.item}
        onSave={handleSaveMember}
        onClose={() => setEditingMember({ isOpen: false, item: null })}
      />

      <GalleryModal
        isOpen={editingGallery.isOpen}
        item={editingGallery.item}
        onSave={handleSaveGallery}
        onClose={() => setEditingGallery({ isOpen: false, item: null })}
      />

      <CustomFieldModal
        isOpen={editingField.isOpen}
        field={editingField.item}
        onSave={handleSaveField}
        onClose={() => setEditingField({ isOpen: false, item: null })}
      />

      <BotQnAModal
        isOpen={editingQnA.isOpen}
        item={editingQnA.item}
        onSave={handleSaveQnA}
        onClose={() => setEditingQnA({ isOpen: false, item: null })}
      />

      <SocialLinkModal
        isOpen={editingSocial.isOpen}
        item={editingSocial.item}
        onSave={handleSaveSocial}
        onClose={() => setEditingSocial({ isOpen: false, item: null })}
      />

      <MissionQuoteModal
        isOpen={editingQuote.isOpen}
        quoteItem={editingQuote.item}
        onSave={handleSaveQuote}
        onClose={() => setEditingQuote({ isOpen: false, item: null })}
      />

      {/* Admin Password Change Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        currentPassword={db.settings.adminPassword || 'admin'}
        onClose={() => setIsPasswordModalOpen(false)}
        onSavePassword={handleSavePassword}
      />

      {/* Global In-App Deletion Confirmation Modal Dialog */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in font-serif-bn">
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-scale-up relative"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {confirmModal.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans-bn">
                  {confirmModal.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={closeConfirmModal}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={() => confirmModal.onConfirm()}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>{confirmModal.confirmButtonText || 'হ্যাঁ, ডিলিট করুন'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
