export interface SiteSettings {
  foundationName: string;
  slogan: string;
  logoUrl: string;
  regNumber: string;
  establishedYear: string;
  phone: string;
  altPhone: string;
  email: string;
  address: string;
  whatsapp: string;
  facebookUrl: string;
  youtubeUrl: string;
  telegramUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  tiktokUrl?: string;
  scriptUrl: string; // Google Apps Script Web App URL
  spreadsheetUrl?: string; // Direct Google Sheets URL
  googleSheetUrl?: string; // Google Sheets / Apps Script URL
  spreadsheetId?: string; // Direct Google Sheets ID
  autoSyncIntervalMinutes: number; // 0 for manual only, or 5, 15, 30
  adminPassword: string;
  missionQuote: string;
  bkashNumber: string;
  nagadNumber: string;
  rocketNumber: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankBranch: string;
  bankRouting: string;
  
  // Dynamic Color Theme Customizer
  primaryColor?: string; // e.g. #059669
  secondaryColor?: string; // e.g. #d97706
  headingTextColor?: string; // e.g. #022c22
  bodyTextColor?: string; // e.g. #334155
  cardBgColor?: string; // e.g. #ffffff
  cardBorderColor?: string; // e.g. #e2e8f0
  pageBgColor?: string; // e.g. #f8fafc
  headerBgColor?: string; // e.g. #ffffff
  footerBgColor?: string; // e.g. #022c22

  // Editable Options
  divisions?: string[];
  interestAreas?: string[];
  botWelcomeMsg?: string;
  botTitle?: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  videoUrl?: string; // YouTube or video URL (16:9 aspect ratio)
  ctaText: string;
  ctaLink: string; // e.g. 'join', 'activities', 'about'
  active: boolean;
  order: number;
}

export interface NoticeItem {
  id: string;
  title: string;
  description: string;
  date: string;
  isImportant: boolean;
  category: string;
  fileUrl?: string;
  linkUrl?: string;
  active: boolean;
}

export interface ActivityItem {
  id: string;
  title: string;
  category: 'খাদ্য সহায়তা' | 'শিক্ষা ও কোরআন' | 'চিকিৎসা সেবা' | 'এতিম প্রতিপালন' | 'দুর্যোগ ত্রাণ' | 'মসজিদ ও পানির প্রকল্প' | 'অন্যান্য';
  shortDesc: string;
  fullDesc: string;
  imageUrl: string;
  videoUrl?: string; // YouTube video embed support
  targetAmount: number;
  raisedAmount: number;
  beneficiariesCount: number;
  status: 'চলমান' | 'সম্পন্ন' | 'আসন্ন';
  location: string;
  date: string;
  featured: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  date: string;
  category: 'ইসলামী জীবন' | 'মানবসেবা' | 'কোরআন ও হাদিস' | 'ফাউন্ডেশন সংবাদ' | 'পরামর্শ';
  imageUrl: string;
  videoUrl?: string; // YouTube video embed support
  tags: string[];
  readTime: string;
  views?: number;
}

export interface GalleryPhoto {
  id?: string;
  url: string;
  caption?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'কার্যক্রম' | 'ত্রাণ বিতরণ' | 'চিকিৎসা ক্যাম্প' | 'ইফতার ও খাদ্য' | 'শিক্ষা কার্যক্রম' | 'সম্মেলন' | 'ভিডিও ডকুমেন্টারি';
  imageUrl: string; // Album cover
  images?: GalleryPhoto[]; // Multiple photos with captions
  videoUrl?: string; // YouTube video embed support
  date: string;
  location?: string;
  description?: string;
}

export interface MemberItem {
  id: string;
  name: string;
  designation: string;
  category: 'উপদেষ্টা পরিষদ' | 'কার্যনির্বাহী পরিষদ' | 'আজীবন সদস্য' | 'সাধারণ সদস্য';
  photoUrl: string;
  bio?: string;
  phone?: string;
  email?: string;
  order: number;
  active: boolean;
}

export interface CustomFormField {
  id: string;
  formType: 'volunteer' | 'donation' | 'contact';
  label: string;
  fieldType: 'text' | 'number' | 'email' | 'tel' | 'dropdown' | 'textarea';
  placeholder?: string;
  required: boolean;
  options?: string[]; // for dropdown box
  order: number;
  active: boolean;
}

export interface VolunteerItem {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  division?: string; // বিভাগ (ঢাকা, চট্টগ্রাম, রাজশাহী, etc.)
  district?: string; // Backward compatibility
  profession: string;
  bloodGroup: string;
  interestArea: string;
  message?: string;
  extraAnswers?: Record<string, string>; // Dynamic form answers
  joinedDate: string;
  status: 'অনুমোদিত' | 'অপেক্ষমান' | 'বাতিল';
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  extraAnswers?: Record<string, string>; // Dynamic form answers
  date: string;
  status: 'নতুন' | 'পঠিত';
}

export interface DonationRecord {
  id: string;
  donorName: string;
  phone: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  purpose: string;
  extraAnswers?: Record<string, string>; // Dynamic form answers
  date: string;
  verified: boolean;
}

export interface BotQnAItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  quickMenu?: boolean; // if true, shows as a quick prompt button in the chatbot
  order: number;
  active: boolean;
}

export interface SocialLinkItem {
  id: string;
  platform: 'facebook' | 'youtube' | 'whatsapp' | 'telegram' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'threads' | 'pinterest' | 'website' | 'other' | string;
  title: string; // e.g. 'অফিসিয়াল ফেসবুক পেজ'
  url: string; // e.g. 'https://facebook.com/...'
  badgeText?: string; // e.g. '১০০k+ ফলোয়ার', 'ভিডিও ও আলোচনা', 'সরাসরি চ্যাট'
  icon?: string; // 'facebook' | 'youtube' | 'whatsapp' | 'telegram' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'globe' | 'share2'
  active: boolean;
  order: number;
}

export interface MissionQuoteItem {
  id: string;
  quote: string; // The Bengali quote/verse/hadith text
  arabicText?: string; // Optional Arabic text (e.g. الآية / الحديث)
  source: string; // e.g. "আল-কুরআন — সূরা আল-মায়েদা: ২", "সহীহ বুখারী: ৬০১১"
  category?: 'কুরআনের আয়াত' | 'হাদীস শরীফ' | 'মহৎ উক্তি' | 'মূল অঙ্গীকার' | string;
  order: number;
  active: boolean;
}

export interface DatabaseState {
  settings: SiteSettings;
  slides: HeroSlide[];
  notices: NoticeItem[];
  activities: ActivityItem[];
  blogs: BlogPost[];
  gallery: GalleryItem[];
  members: MemberItem[];
  customFields: CustomFormField[];
  volunteers: VolunteerItem[];
  messages: ContactMessage[];
  donations: DonationRecord[];
  botQnA?: BotQnAItem[];
  socialLinks?: SocialLinkItem[];
  missionQuotes?: MissionQuoteItem[];
  lastSyncedAt: string | null;
}
