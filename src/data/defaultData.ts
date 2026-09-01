import { DatabaseState } from '../types';
import { LOADING_PLACEHOLDER_IMAGE, LOADING_AVATAR_PLACEHOLDER } from '../utils/imageHelper';
import { TARGET_SPREADSHEET_ID, TARGET_SPREADSHEET_URL, DEFAULT_DEPLOYED_APP_SCRIPT_URL } from '../utils/googleAppsScriptCode';

export const INITIAL_DATABASE_STATE: DatabaseState = {
  settings: {
    foundationName: 'স্টেশন পাড়া দাওয়াহ্ কমিউনিটি',
    slogan: 'দ্বীনের দাওয়াহ, ভ্রাতৃত্ব ও মানবসেবায় নিয়োজিত',
    logoUrl: '', // uses clean SVG/Islamic crescent emblem or loading placeholder
    regNumber: 'রেজি নং: MUF-২০২৪/০৯৮৭',
    establishedYear: '২০২০',
    phone: '+৮৮০১৭00000000',
    altPhone: '+৮৮০১৯00000000',
    email: 'stationparadawahcommunity@gmail.com',
    address: 'নীলফামারী পুরাতন রেলওয়ে স্টেশন, নীলফামারী সদর-৫৩০০,নীলফামারী, বাংলাদেশ',
    whatsapp: '+8801700000000',
    facebookUrl: 'https://facebook.com',
    youtubeUrl: 'https://youtube.com',
    scriptUrl: DEFAULT_DEPLOYED_APP_SCRIPT_URL,
    googleSheetUrl: DEFAULT_DEPLOYED_APP_SCRIPT_URL,
    spreadsheetUrl: TARGET_SPREADSHEET_URL,
    spreadsheetId: TARGET_SPREADSHEET_ID,
    autoSyncIntervalMinutes: 10,
    adminPassword: 'admin',
    missionQuote: 'একটি সামাজিক সেবা মূলক প্লাটফর্ম। এলাকার মুসলিমদের মাঝে ভ্রাতৃত্ব ও দ্বীনি সচেতনতা বৃদ্ধি করার পাশাপাশি নববী আদর্শে ঐক্যবদ্ধ করা এর অন্যতম লক্ষ্য ও উদ্দেশ্য।',
    bkashNumber: '০১৭######## (মার্চেন্ট - পেমেন্ট)',
    nagadNumber: '০১৮######## (মার্চেন্ট)',
    rocketNumber: '০১৭########',
    bankName: 'ব্যাংক',
    bankAccountName: 'স্টেশন পাড়া দাওয়াহ্ কমিউনিটি',
    bankAccountNumber: 'loading...',
    bankBranch: 'নীলফামারী শাখা, নীলফামারী',
    bankRouting: '########',
    
    // Dynamic editable color theme (Hex codes)
    primaryColor: '#059669', // Emerald Green
    secondaryColor: '#d97706', // Warm Amber
    headingTextColor: '#022c22', // Deep Emerald Black
    bodyTextColor: '#334155', // Slate Grey
    cardBgColor: '#ffffff', // White
    cardBorderColor: '#e2e8f0', // Light Slate
    pageBgColor: '#f8fafc', // Clean Slate 50
    headerBgColor: '#ffffff', // Clean White
    footerBgColor: '#022c22', // Deep Forest Green

    // Divisions of Bangladesh
    divisions: [
      'ঢাকা',
      'চট্টগ্রাম',
      'রাজশাহী',
      'খুলনা',
      'বরিশাল',
      'সিলেট',
      'রংপুর',
      'ময়মনসিংহ'
    ],

    // Editable Volunteer Interest Areas
    interestAreas: [
      'ত্রাণ বিতরণ ও জরুরি উদ্ধার',
      'চিকিৎসা ক্যাম্প ও রক্তদান',
      'কোরআন ও দ্বীনি শিক্ষা',
      'এতিমখানা ও শিশু যত্ন',
      'আইটি, মিডিয়া ও প্রচার',
      'অর্থ সংগ্রহ ও ক্যাম্পেইন',
      'অন্যান্য'
    ],

    botTitle: 'ইসলামিক এআই সহকারী',
    botWelcomeMsg: 'আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহি ওয়া বারাকাতুহু! 🌙\n\nআমি ফাউন্ডেশনের ইসলামিক এআই সহকারী। আর্তমানবতার সেবা ও দ্বীনি কার্যক্রমে আপনাকে স্বাগতম। আপনি নিচে দেওয়া মেনু ট্যাবগুলো নির্বাচন করতে পারেন অথবা যেকোনো প্রশ্ন লিখে উত্তর পেতে পারেন।'
  },
  slides: [
    {
      id: 'slide-1',
      title: 'আর্তমানবতার সেবায় নিবেদিত এক বিশ্বস্ত ঠিকানা',
      subtitle: 'মহানবী মুহাম্মদ সা.-এর আদর্শে অনুপ্রাণিত হয়ে ক্ষুধা, দারিদ্র্য ও অসহায়ত্ব দূরীকরণে আমরা নিরলস কাজ করছি।',
      imageUrl: LOADING_PLACEHOLDER_IMAGE,
      videoUrl: '',
      ctaText: 'কার্যক্রমসমূহ দেখুন',
      ctaLink: 'activities',
      active: true,
      order: 1
    },
    {
      id: 'slide-2',
      title: 'এতিম ও অসহায় শিশুদের উজ্জ্বল ভবিষ্যৎ গড়ার প্রত্যয়',
      subtitle: 'তাদের শিক্ষা, সুস্বাস্থ্য ও দ্বীনি মূল্যবোধে গড়ে তুলতে আপনার দানের হাত বাড়িয়ে দিন।',
      imageUrl: LOADING_PLACEHOLDER_IMAGE,
      videoUrl: '',
      ctaText: 'দান করুন',
      ctaLink: 'join',
      active: true,
      order: 2
    },
    {
      id: 'slide-3',
      title: 'বিনামূল্যে চিকিৎসা সেবা ও বিশুদ্ধ পানির নিশ্চয়তা',
      subtitle: 'দুর্গম ও প্রান্তিক অঞ্চলের সুবিধাবঞ্চিত মানুষের কাছে স্বাস্থ্যসেবা পৌঁছে দিতে আমাদের উদ্যোগ।',
      imageUrl: LOADING_PLACEHOLDER_IMAGE,
      videoUrl: '',
      ctaText: 'স্বেচ্ছাসেবক হোন',
      ctaLink: 'volunteer',
      active: true,
      order: 3
    }
  ],
  notices: [
    {
      id: 'notice-1',
      title: 'পবিত্র মাহে রমজান উপলক্ষ্যে খাদ্যসামগ্রী বিতরণ কর্মসূচি ২০২৬',
      description: 'সারাদেশে ৫০০০ অসহায় ও দুস্থ পরিবারের মাঝে পূর্ণ এক মাসের প্রয়োজনীয় সাহরি ও ইফতার সামগ্রী বিতরণ শুরু হয়েছে। সকল শুভাকাঙ্ক্ষীদের অংশ নেওয়ার উদাত্ত আহ্বান জানাচ্ছি।',
      date: '২৬ আগস্ট ২০২৬',
      isImportant: true,
      category: 'জরুরি নোটিস',
      fileUrl: '',
      linkUrl: 'activities',
      active: true
    },
    {
      id: 'notice-2',
      title: 'বিনামূল্যে চক্ষু ও ডায়াবেটিস চিকিৎসা ক্যাম্পের তারিখ ঘোষণা',
      description: 'আগামী শুক্রবার সকাল ৯টা থেকে বিকেল ৫টা পর্যন্ত ফাউন্ডেশনের কেন্দ্রীয় কার্যালয়ে ফ্রি স্পেশালিস্ট ক্যাম্প অনুষ্ঠিত হবে।',
      date: '২০ আগস্ট ২০২৬',
      isImportant: false,
      category: 'স্বাস্থ্যসেবা',
      fileUrl: '',
      linkUrl: 'activities',
      active: true
    },
    {
      id: 'notice-3',
      title: 'নতুন সদস্য ও স্বেচ্ছাসেবক নিবন্ধন কার্যক্রম শুরু হয়েছে',
      description: 'মানবতার সেবায় অংশ নিতে আগ্রহী তরুণ ও নিষ্ঠাবান ভাই-বোনদের আবেদন করার আহ্বান জানানো হচ্ছে।',
      date: '১৫ আগস্ট ২০২৬',
      isImportant: false,
      category: 'নিবন্ধন',
      fileUrl: '',
      linkUrl: 'volunteer',
      active: true
    }
  ],
  activities: [
    {
      id: 'act-1',
      title: 'রমজান ফুড প্যাক ও ইফতার বিতরণ প্রকল্প',
      category: 'খাদ্য সহায়তা',
      shortDesc: 'দুস্থ ও দিনমজুর পরিবারের ঘরে ঘরে পূর্ণাঙ্গ খাদ্যসামগ্রী ও ইফতার সামগ্রী পৌঁছে দেওয়া।',
      fullDesc: 'পবিত্র রমজান মাসে কোনো পরিবার যেন অনাহারে না থাকে, সেজন্য আমরা তেল, চাল, ডাল, ছোলা, খেজুর ও চিনি সমৃদ্ধ ফুড প্যাক বিতরণ করছি। প্রতিটি প্যাকেটে একটি পরিবারের পুরো মাসের আহারের ব্যবস্থা রয়েছে।',
      imageUrl: LOADING_PLACEHOLDER_IMAGE,
      videoUrl: '',
      targetAmount: 500000,
      raisedAmount: 425000,
      beneficiariesCount: 1250,
      status: 'চলমান',
      location: 'কুড়িগ্রাম, গাইবান্ধা ও ঢাকা',
      date: 'রমজান ২০২৬',
      featured: true
    },
    {
      id: 'act-2',
      title: 'এতিম শিশু শিক্ষা ও হিফজ স্পনসরশিপ',
      category: 'এতিম প্রতিপালন',
      shortDesc: 'পিতৃহীন শিশুদের আবাসন, সাধারণ শিক্ষা ও হিফজুল কোরআন সম্পন্ন করার দায়িত্ব।',
      fullDesc: 'সুবিধাবঞ্চিত শিশুদের জন্য একটি সুন্দর ও নৈতিক জীবন নিশ্চিত করতে আমাদের ১০০ জন এতিম শিশু লালন-পালন প্রকল্প পরিচালিত হচ্ছে। এতে তাদের পোশাক, খাবার ও আদর্শ ধর্মীয় শিক্ষার সম্পূর্ণ ব্যয় বহন করা হয়।',
      imageUrl: LOADING_PLACEHOLDER_IMAGE,
      videoUrl: '',
      targetAmount: 300000,
      raisedAmount: 280000,
      beneficiariesCount: 100,
      status: 'চলমান',
      location: 'ঢাকা ও সিলেট',
      date: 'স্থায়ী প্রকল্প',
      featured: true
    },
    {
      id: 'act-3',
      title: 'বিনামূল্যে স্বাস্থ্যসেবা ও ওষুধ প্রদান ক্যাম্প',
      category: 'চিকিৎসা সেবা',
      shortDesc: 'প্রান্তিক জনগোষ্ঠীর জন্য অভিজ্ঞ চিকিৎসকদের ব্যবস্থাপত্র ও জরুরি ওষুধ সরবরাহ।',
      fullDesc: 'বিশেষজ্ঞ চিকিৎসকদের তত্ত্বাবধানে বিনামূল্যে রোগী দেখা, রক্তের গ্রুপ পরীক্ষা ও ডায়াবেটিস স্ক্রিনিং ক্যাম্প পরিচালনা। দুর্গম অঞ্চলের গরিব রোগীদের বিনামূল্যে উন্নত ওষুধ প্রদান।',
      imageUrl: LOADING_PLACEHOLDER_IMAGE,
      videoUrl: '',
      targetAmount: 200000,
      raisedAmount: 200000,
      beneficiariesCount: 1800,
      status: 'সম্পন্ন',
      location: 'সিরাজগঞ্জ ও কুড়িগ্রাম',
      date: 'আগস্ট ২০২৬',
      featured: false
    },
    {
      id: 'act-4',
      title: 'বিশুদ্ধ খাবার পানির গভীর নলকূপ স্থাপন',
      category: 'মসজিদ ও পানির প্রকল্প',
      shortDesc: 'আর্সেনিকমুক্ত ও নিরাপদ সুপেয় পানির সংকট নিরসনে গভীর টিউবওয়েল স্থাপন।',
      fullDesc: 'উপকূলীয় ও পাহাড়ি দুর্গম এলাকার মানুষের পানির তীব্র সংকট দূর করতে গভীর নলকূপ এবং ওজুখানা নির্মাণ। একটি নলকূপ থেকে প্রতিদিন শত শত পরিবার সুপেয় পানি গ্রহণ করে।',
      imageUrl: LOADING_PLACEHOLDER_IMAGE,
      videoUrl: '',
      targetAmount: 450000,
      raisedAmount: 390000,
      beneficiariesCount: 3500,
      status: 'চলমান',
      location: 'সাতক্ষীরা ও ভোলা',
      date: 'চলমান প্রকল্প',
      featured: true
    }
  ],
  blogs: [
    {
      id: 'blog-1',
      title: 'ইসলামে দান ও সদকার গুরুত্ব এবং সমাজের দায়িত্ব',
      slug: 'importance-of-charity-in-islam',
      excerpt: 'পবিত্র কোরআন ও সহীহ সুন্নাহর আলোকে আর্তমানবতার সেবায় ব্যয়ের অতুলনীয় ফযিলত ও পরকালীন সফলতা।',
      content: `দান-সদকা ইসলামের অন্যতম প্রধান বুনিয়াদ। আল্লাহ তাআলা পবিত্র কোরআনে এরশাদ করেছেন: "তোমরা যা ভালোবাস তা থেকে ব্যয় না করা পর্যন্ত কখনো প্রকৃত পুণ্য লাভ করতে পারবে না।" (সূরা আলে ইমরান: ৯২)

মানবতার সেবায় নিজের অর্থ ও শ্রম ব্যয় করা ঈমানের পূর্ণতার পরিচায়ক। মহানবী হযরত মুহাম্মদ সা. বলেছেন, 'দান সম্পদ কমায় না, বরং বৃদ্ধি করে।' 

একটি আদর্শ সমাজ বিনির্মাণে ধনী ও সামর্থ্যবানদের এগিয়ে আসা আবশ্যক। আসুন আমরা আর্তপীড়িত মানুষের পাশে দাঁড়াই।`,
      author: 'মাওলানা মাহমুদুর রহমান',
      authorRole: 'ইসলামী চিন্তাবিদ ও গবেষক',
      date: '২৪ আগস্ট ২০২৬',
      category: 'ইসলামী জীবন',
      imageUrl: LOADING_PLACEHOLDER_IMAGE,
      videoUrl: '',
      tags: ['সদকা', 'যাকাত', 'মানবসেবা', 'ইসলাম'],
      readTime: '৪ মিনিট',
      views: 342
    },
    {
      id: 'blog-2',
      title: 'এতিমদের প্রতিপালন: রাসূলুল্লাহ সা.-এর একটি শ্রেষ্ঠ সুন্নত',
      slug: 'caring-for-orphans-sunnah',
      excerpt: 'রাসূলুল্লাহ সা. বলেছেন: "আমি ও এতিমের লালন-পালনকারী জান্নাতে এমনভাবে থাকব..."',
      content: `রাসূলুল্লাহ সা. তর্জনী ও মধ্যমা আঙুল মিলিয়ে ইঙ্গিত করে বলেছিলেন, জান্নাতে তিনি এবং এতিমের দায়িত্ব গ্রহণকারী ব্যক্তি এই দুই আঙুলের মতো পাশাপাশি থাকবেন। 

পিতৃহীন শিশুদের মুখে হাসি ফোটানো এবং তাদের আদর্শ নাগরিক হিসেবে গড়ে তোলা আমাদের জাতীয় ও ধর্মীয় দায়িত্ব।`,
      author: 'মুফতী আব্দুল্লাহ বিন সাঈদ',
      authorRole: 'উপদেষ্টা, ইসলামিক রিসার্চ সেন্টার',
      date: '১৮ আগস্ট ২০২৬',
      category: 'কোরআন ও হাদিস',
      imageUrl: LOADING_PLACEHOLDER_IMAGE,
      videoUrl: '',
      tags: ['এতিম', 'সুন্নাহ', 'জান্নাত'],
      readTime: '৫ মিনিট',
      views: 520
    }
  ],
  gallery: [
    {
      id: 'gal-1',
      title: 'কুড়িগ্রাম চরাঞ্চলে খাদ্য ও ত্রাণ সামগ্রী বিতরণ ২০২৬',
      category: 'ত্রাণ বিতরণ',
      imageUrl: LOADING_PLACEHOLDER_IMAGE,
      images: [
        { url: LOADING_PLACEHOLDER_IMAGE, caption: 'চরাঞ্চলের ৫ শতাধিক পরিবারের মাঝে চাল, ডাল ও তেল বিতরণ' },
        { url: LOADING_PLACEHOLDER_IMAGE, caption: 'স্বেচ্ছাসেবকদের মাধ্যমে নৌকায় করে দুর্গম চরে ত্রাণ পরিবহন' },
        { url: LOADING_PLACEHOLDER_IMAGE, caption: 'বৃদ্ধ ও অসহায় মায়েদের হাতে খাদ্যপ্যাকেট তুলে দেওয়া হচ্ছে' }
      ],
      videoUrl: '',
      date: 'রমজান ২০২৬',
      location: 'কুড়িগ্রাম সদর ও চিলমারী',
      description: 'বন্যা ও নদীভাঙনে ক্ষতিগ্রস্ত দুর্গম চরাঞ্চলের মানুষের মাঝে জরুরি শুকনো ও রান্না করা খাদ্যসামগ্রী এবং নগদ সহায়তা পৌঁছে দেওয়া হয়।'
    },
    {
      id: 'gal-2',
      title: 'বিনামূল্যে চক্ষু ক্যাম্প ও চশমা বিতরণ',
      category: 'চিকিৎসা ক্যাম্প',
      imageUrl: LOADING_PLACEHOLDER_IMAGE,
      images: [
        { url: LOADING_PLACEHOLDER_IMAGE, caption: 'বিশেষজ্ঞ চক্ষু সার্জনদের দ্বারা রোগীদের চোখের দৃষ্টি পরীক্ষা' },
        { url: LOADING_PLACEHOLDER_IMAGE, caption: 'বিনামূল্যে প্রয়োজনীয় ঔষধ ও পাওয়ারের চশমা বিতরণ' },
        { url: LOADING_PLACEHOLDER_IMAGE, caption: 'ছানি অপারেশনের জন্য তালিকাভুক্ত রোগীদের ব্রিফিং' }
      ],
      videoUrl: '',
      date: 'জুলাই ২০২৬',
      location: 'ঢাকা কেন্দ্রীয় কার্যালয়',
      description: 'দরিদ্র ও সুবিধা বঞ্চিত ৮ শতাধিক রোগীর চক্ষু পরীক্ষা, ওষুধ প্রদান এবং প্রয়োজনীয় ছানি অপারেশনের ব্যবস্থা গ্রহণ করা হয়।'
    },
    {
      id: 'gal-3',
      title: 'পাহাড়ি ও প্রান্তিক অঞ্চলে গভীর নলকূপ উদ্বোধনী অনুষ্ঠান',
      category: 'কার্যক্রম',
      imageUrl: LOADING_PLACEHOLDER_IMAGE,
      images: [
        { url: LOADING_PLACEHOLDER_IMAGE, caption: 'পাহাড়ের চূড়ায় বিশুদ্ধ খাবার পানির গভীর নলকূপ স্থাপন' },
        { url: LOADING_PLACEHOLDER_IMAGE, caption: 'স্থানীয় গ্রামবাসীর সাথে উদ্বোধনী দোয়া ও মোনাজাত' }
      ],
      videoUrl: '',
      date: 'জুন ২০২৬',
      location: 'বান্দরবান ও খাগড়াছড়ি',
      description: 'পাহাড়ি অঞ্চলে সুপেয় পানির সংকট নিরসনে ৫০টিরও বেশি গভীর নলকূপ ও সৌরচালিত পাম্প স্থাপন করা হয়েছে।'
    },
    {
      id: 'gal-4',
      title: 'এতিম ও পথশিশুদের মাঝে ঈদের নতুন পোশাক ও খাদ্য উপহার',
      category: 'ইফতার ও খাদ্য',
      imageUrl: LOADING_PLACEHOLDER_IMAGE,
      images: [
        { url: LOADING_PLACEHOLDER_IMAGE, caption: '৩০০ এতিম শিশুর মুখে আনন্দের হাসি ও নতুন পোশাক গ্রহণ' },
        { url: LOADING_PLACEHOLDER_IMAGE, caption: 'ঈদ পুনর্মিলনী ভোজ ও বিশেষ দোয়া মাহফিল' }
      ],
      videoUrl: '',
      date: 'ঈদুল ফিতর ২০২৬',
      location: 'সিলেট ও চট্টগ্রাম',
      description: 'ঈদ আনন্দে যেন কোনো এতিম শিশু বাদ না যায়, সেজন্য নতুন জামাকাপড়, জুতো ও সুস্বাদু খাবারের ব্যবস্থা করা হয়।'
    }
  ],
  members: [
    {
      id: 'mem-1',
      name: 'ড. মাওলানা আব্দুল কাইয়ূম',
      designation: 'প্রধান উপদেষ্টা ও প্রতিষ্ঠাতা',
      category: 'উপদেষ্টা পরিষদ',
      photoUrl: LOADING_AVATAR_PLACEHOLDER,
      bio: 'বিশিষ্ট ইসলামী চিন্তাবিদ, লেখক এবং সমাজ সংস্কারক। দীর্ঘদিন যাবত আর্তমানবতার সেবায় নিয়োজিত।',
      phone: '+৮৮০১৭১২-১১২২৩৩',
      email: 'dr.qayyum@foundation.org',
      order: 1,
      active: true
    },
    {
      id: 'mem-2',
      name: 'ইঞ্জিনিয়ার মুস্তাফিজুর রহমান',
      designation: 'সভাপতি',
      category: 'কার্যনির্বাহী পরিষদ',
      photoUrl: LOADING_AVATAR_PLACEHOLDER,
      bio: 'সাবেক প্রধান প্রকৌশলী, সমাজসেবক ও দ্বীনি শিক্ষা আন্দোলনের অগ্রপথিক।',
      phone: '+৮৮০১৭১২-৪৪৫৫৬৬',
      email: 'president@foundation.org',
      order: 2,
      active: true
    },
    {
      id: 'mem-3',
      name: 'মাওলানা উমর ফারুক',
      designation: 'সাধারণ সম্পাদক',
      category: 'কার্যনির্বাহী পরিষদ',
      photoUrl: LOADING_AVATAR_PLACEHOLDER,
      bio: 'ফাউন্ডেশনের সকল ত্রাণ, শিক্ষা ও সেবামূলক কার্যক্রমের ফিল্ড কো-অর্ডিনেটর।',
      phone: '+৮৮০১৭১২-৭৭৮৮৯৯',
      email: 'gs@foundation.org',
      order: 3,
      active: true
    },
    {
      id: 'mem-4',
      name: 'জনাব রফিকুল ইসলাম সিএ',
      designation: 'অর্থ ও তহবিল সম্পাদক',
      category: 'কার্যনির্বাহী পরিষদ',
      photoUrl: LOADING_AVATAR_PLACEHOLDER,
      bio: 'চার্টার্ড অ্যাকাউন্ট্যান্ট, স্বচ্ছ ও জবাবদিহিতামূলক আর্থিক ব্যবস্থাপনা তদারককারী।',
      phone: '+৮৮০১৯৮৭-১১২২৩৩',
      email: 'finance@foundation.org',
      order: 4,
      active: true
    }
  ],
  customFields: [
    {
      id: 'cf-vol-1',
      formType: 'volunteer',
      label: 'পেশা / কর্মসংস্থান',
      fieldType: 'dropdown',
      placeholder: 'আপনার পেশা নির্বাচন করুন',
      required: true,
      options: ['শিক্ষার্থী', 'শিক্ষক / আলেম', 'চাকরিজীবী', 'ব্যবসায়ী', 'চিকিৎসক / ইঞ্জিনিয়ার', 'অন্যান্য'],
      order: 1,
      active: true
    },
    {
      id: 'cf-vol-2',
      formType: 'volunteer',
      label: 'রক্তের গ্রুপ',
      fieldType: 'dropdown',
      placeholder: 'রক্তের গ্রুপ',
      required: false,
      options: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'জানা নেই'],
      order: 2,
      active: true
    },
    {
      id: 'cf-vol-3',
      formType: 'volunteer',
      label: 'কোন সেবামূলক কাজে অংশ নিতে চান?',
      fieldType: 'dropdown',
      placeholder: 'কাজের ক্ষেত্র নির্বাচন করুন',
      required: true,
      options: ['খাদ্য ও ত্রাণ বিতরণ', 'চিকিৎসা ক্যাম্প সহায়তা', 'এতিমখানা ও শিক্ষা কার্যক্রম', 'অনলাইন প্রচার ও মিডিয়া', 'রক্তদান সেবা', 'জরুরি দুর্যোগ উদ্ধার'],
      order: 3,
      active: true
    },
    {
      id: 'cf-don-1',
      formType: 'donation',
      label: 'অনুদানের উদ্দেশ্য / খাত',
      fieldType: 'dropdown',
      placeholder: 'খাত নির্বাচন করুন',
      required: true,
      options: ['সাধারণ সদকা ও যাকাত তহবিল', 'রমজান ফুড প্যাক ও ইফতার বিতরণ', 'এতিম শিশু শিক্ষা স্পনসরশিপ', 'বিনামূল্যে চিকিৎসা ক্যাম্প', 'গভীর নলকূপ স্থাপন', 'জরুরি দুর্যোগ ত্রাণ'],
      order: 1,
      active: true
    },
    {
      id: 'cf-1',
      formType: 'volunteer',
      label: 'শিক্ষাগত যোগ্যতা',
      fieldType: 'dropdown',
      placeholder: 'আপনার শিক্ষাগত যোগ্যতা নির্বাচন করুন',
      required: false,
      options: ['মাধ্যমিক/দাখিল', 'উচ্চ মাধ্যমিক/আলিম', 'স্নাতক/ফাজিল', 'স্নাতকোত্তর/কামিল', 'অন্যান্য'],
      order: 1,
      active: true
    },
    {
      id: 'cf-2',
      formType: 'volunteer',
      label: 'সপ্তাহে কত ঘণ্টা সময় দিতে পারবেন?',
      fieldType: 'dropdown',
      placeholder: 'সময় নির্বাচন করুন',
      required: true,
      options: ['২-৪ ঘণ্টা', '৫-১০ ঘণ্টা', '১০+ ঘণ্টা', 'শুধুমাত্র ছুটির দিন (শুক্র-শনি)'],
      order: 2,
      active: true
    },
    {
      id: 'cf-3',
      formType: 'volunteer',
      label: 'পূর্বের কোনো স্বেচ্ছাসেবী কাজের অভিজ্ঞতা (যদি থাকে)',
      fieldType: 'textarea',
      placeholder: 'সংক্ষেপে অভিজ্ঞতা উল্লেখ করুন...',
      required: false,
      order: 3,
      active: true
    }
  ],
  volunteers: [
    {
      id: 'vol-1',
      fullName: 'আব্দুর রহমান',
      phone: '০১৭XXXXXXXX',
      email: 'rahman@example.com',
      address: 'ধানমন্ডি, ঢাকা',
      district: 'ঢাকা',
      profession: 'শিক্ষার্থী',
      bloodGroup: 'B+',
      interestArea: 'খাদ্য ও ত্রাণ বিতরণ',
      message: 'আল্লাহর সন্তুষ্টির জন্য ফাউন্ডেশনের সাথে স্বেচ্ছাসেবী হিসেবে কাজ করতে চাই।',
      joinedDate: '২০ আগস্ট ২০২৬',
      status: 'অনুমোদিত'
    }
  ],
  messages: [
    {
      id: 'msg-1',
      name: 'মুহাম্মদ তারিক',
      phone: '০১৮XXXXXXXX',
      email: 'tariq@example.com',
      subject: 'এতিম স্পনসরশিপ পদ্ধতি সম্পর্কে জানতে চাই',
      message: 'আসসালামু আলাইকুম। আমি প্রতি মাসে একজন এতিম শিশুর পড়াশোনার খরচ বহন করতে আগ্রহী। নিয়ম জানাবেন।',
      date: '২২ আগস্ট ২০২৬',
      status: 'নতুন'
    }
  ],
  donations: [
    {
      id: 'don-1',
      donorName: 'আল্লাহর এক বান্দা',
      phone: '০১৭XXXXXX৭৮',
      amount: 25000,
      paymentMethod: 'bKash',
      transactionId: 'TRX98273619',
      purpose: 'রমজান খাদ্য সহায়তা তহবিল',
      date: '২৪ আগস্ট ২০২৬',
      verified: true
    },
    {
      id: 'don-2',
      donorName: 'আব্দুল করিম',
      phone: '০১৮XXXXXX১২',
      amount: 10000,
      paymentMethod: 'Bank Transfer',
      transactionId: 'IBBL-928374',
      purpose: 'টিউবওয়েল স্থাপন প্রকল্প',
      date: '২১ আগস্ট ২০২৬',
      verified: true
    }
  ],
  botQnA: [
    {
      id: 'bq-1',
      question: 'দান ও যাকাত প্রদানের নিয়ম কী?',
      answer: 'আপনি বিকাশ, নগদ, রকেট অথবা সরাসরি ইসলামী ব্যাংকের মাধ্যমে আমাদের দান পাঠাতে পারেন। টাকা পাঠানোর পর ডোনেশন পেজে ট্রানজেকশন আইডি এন্ট্রি করলে আপনার রশিদ সংরক্ষণ হবে।',
      category: 'দান ও যাকাত',
      quickMenu: true,
      order: 1,
      active: true
    },
    {
      id: 'bq-2',
      question: 'চলমান প্রকল্পসমূহ কী কী?',
      answer: 'বর্তমানে রমজান খাদ্য সহায়তা, এতিম শিশু প্রতিপালন, সুপেয় পানির নলকূপ এবং ফ্রি মেডিকেল ক্যাম্প পুরোদমে পরিচালিত হচ্ছে। আপনি যেকোনো প্রকল্পে এককভাবে অংশগ্রহণ করতে পারেন।',
      category: 'কার্যক্রম',
      quickMenu: true,
      order: 2,
      active: true
    },
    {
      id: 'bq-3',
      question: 'কীভাবে স্বেচ্ছাসেবক হিসেবে নিবন্ধন করব?',
      answer: 'আমাদের ওয়েবসাইটের "স্বেচ্ছাসেবক" ট্যাবে গিয়ে আপনার নাম, মোবাইল নম্বর, বিভাগ ও আগ্রহের খাত সিলেক্ট করে আবেদন সাবমিট করুন। আমাদের টিম দ্রুত আপনার সাথে যোগাযোগ করবে।',
      category: 'স্বেচ্ছাসেবক',
      quickMenu: true,
      order: 3,
      active: true
    },
    {
      id: 'bq-4',
      question: 'অফিসের ঠিকানা ও যোগাযোগের মাধ্যম কী?',
      answer: 'আমাদের প্রধান কার্যালয়: বাড়ি নং ১২, রোড নং ৫, ধানমন্ডি, ঢাকা-১২০৫। মোবাইল: +৮৮০১৭১২-৩৪৫৬৭৮। জরুরি প্রয়োজনে যেকোনো সময় মেসেজ পাঠাতে পারেন।',
      category: 'যোগাযোগ',
      quickMenu: true,
      order: 4,
      active: true
    },
    {
      id: 'bq-5',
      question: 'যাকাত ফান্ডের অর্থ কীভাবে ব্যয় করা হয়?',
      answer: 'যাকাত ফান্ডের প্রতিটি টাকা শরীয়াহ সম্মত আটটি খাতের মধ্যে শুধুমাত্র প্রকৃত হকদার, বিধবা, এতিম ও ঋণগ্রস্তদের সরাসরি পুনর্বাসন এবং চিকিৎসায় ব্যয় করা হয়।',
      category: 'যাকাত নীতিমালা',
      quickMenu: false,
      order: 5,
      active: true
    }
  ],
  socialLinks: [
    {
      id: 'soc-1',
      platform: 'facebook',
      title: 'অফিসিয়াল ফেসবুক পেজ',
      url: 'https://facebook.com',
      badgeText: 'ফলো ও লাইক করুন',
      icon: 'facebook',
      active: true,
      order: 1
    },
    {
      id: 'soc-2',
      platform: 'youtube',
      title: 'ইসলামিক ইউটিউব চ্যানেল',
      url: 'https://youtube.com',
      badgeText: 'ভিডিও ও বয়ান',
      icon: 'youtube',
      active: true,
      order: 2
    },
    {
      id: 'soc-3',
      platform: 'whatsapp',
      title: 'হোয়াটসঅ্যাপ হেল্পলাইন',
      url: 'https://wa.me/8801712345678',
      badgeText: 'সরাসরি চ্যাট',
      icon: 'whatsapp',
      active: true,
      order: 3
    },
    {
      id: 'soc-4',
      platform: 'telegram',
      title: 'টেলিগ্রাম ইসলামিক চ্যানেল',
      url: 'https://t.me',
      badgeText: 'জরুরি আপডেট',
      icon: 'telegram',
      active: true,
      order: 4
    },
    {
      id: 'soc-5',
      platform: 'instagram',
      title: 'ইনস্টাগ্রাম অ্যাকাউন্ট',
      url: 'https://instagram.com',
      badgeText: 'ফটোগ্যালারি',
      icon: 'instagram',
      active: false,
      order: 5
    },
    {
      id: 'soc-6',
      platform: 'twitter',
      title: 'টুইটার (X) একাউন্ট',
      url: 'https://x.com',
      badgeText: 'খবর ও নোটিস',
      icon: 'twitter',
      active: false,
      order: 6
    }
  ],
  missionQuotes: [
    {
      id: 'mq-1',
      category: 'কুরআনের আয়াত',
      quote: 'তোমরা সৎকর্ম ও তাকওয়ার কাজে পরস্পরকে সহযোগিতা কর, আর পাপ ও শত্রুতার কাজে একে অপরকে সাহায্য করো না।',
      arabicText: 'وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ ۖ وَلَا تَعَاوَنُوا عَلَى الْإِثْمِ وَالْعُدْوَانِ',
      source: 'আল-কুরআন — সূরা আল-মায়েদা: ২',
      order: 1,
      active: true
    },
    {
      id: 'mq-2',
      category: 'হাদীস শরীফ',
      quote: 'নিশ্চয় আল্লাহ সেই বান্দার সাহায্যে থাকেন, যতক্ষণ সে তার ভাইয়ের সাহায্যে রত থাকে।',
      arabicText: 'وَاللهُ فِي عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِي عَوْنِ أَخِيهِ',
      source: 'সহীহ মুসলিম — হাদিস: ২৬৯৯',
      order: 2,
      active: true
    },
    {
      id: 'mq-3',
      category: 'হাদীস শরীফ',
      quote: 'মানুষের মধ্যে সর্বোত্তম সেই ব্যক্তি, যে মানুষের জন্য সবচেয়ে বেশি উপকারী ও কল্যাণকর।',
      arabicText: 'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ',
      source: "আল-মু'জামুল আওসাত — হাদিস: ৫৭৮৭",
      order: 3,
      active: true
    },
    {
      id: 'mq-4',
      category: 'হাদীস শরীফ',
      quote: 'তোমরা জমিনে যারা আছে তাদের প্রতি দয়া প্রদর্শন করো, তাহলে আকাশে যিনি আছেন তিনি তোমাদের প্রতি দয়া করবেন।',
      arabicText: 'ارْحَمُوا مَنْ فِي الأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ',
      source: 'জামে আত-তিরমিযী — হাদিস: ১৯২৪',
      order: 4,
      active: true
    },
    {
      id: 'mq-5',
      category: 'হাদীস শরীফ',
      quote: 'দান-সাদাকাহ কোনো সম্পদ কমায় না, বরং আল্লাহ এর দ্বারা বান্দার মর্যাদা বৃদ্ধি করেন।',
      arabicText: 'مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ',
      source: 'সহীহ মুসলিম — হাদিস: ২৫৮৮',
      order: 5,
      active: true
    },
    {
      id: 'mq-6',
      category: 'মূল অঙ্গীকার',
      quote: 'এই প্রতিষ্ঠান মানবতার শিক্ষক, মানুষের মুক্তি ও শান্তির দূত, মানবসেবার আদর্শ, মহানবী মুহাম্মদ সা.-এর পদাঙ্ক অনুসরণ করে আর্তমানবতার সেবায় একটি আদর্শ কল্যাণসমাজ বিনির্মাণে সর্বদা নিয়োজিত।',
      arabicText: 'وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ',
      source: 'ইসলামী ধারার ফাউন্ডেশন — মূল ঘোষণাপত্র',
      order: 6,
      active: true
    }
  ],
  lastSyncedAt: null
};
