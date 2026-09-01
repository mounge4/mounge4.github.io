import { DatabaseState, BotQnAItem } from '../types';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  actionLink?: string;
  actionLabel?: string;
}

/**
 * Islamic AI Knowledge Engine
 * Provides instant answers based on Google Sheets knowledge base (Activities, Settings, Notices, Blogs, BotQnA)
 * without needing external API keys.
 */
export function generateIslamicAIResponse(
  userQuery: string,
  db: DatabaseState
): { text: string; actionLink?: string; actionLabel?: string } {
  const query = userQuery.trim().toLowerCase();

  // 1. Check Custom Bot Q&A defined by Admin / Google Sheets
  const customQnA = db.botQnA || [];
  const exactCustom = customQnA.find(q => 
    q.active && 
    (q.question.toLowerCase().includes(query) || query.includes(q.question.toLowerCase()))
  );
  if (exactCustom) {
    return {
      text: exactCustom.answer
    };
  }

  // 2. Greetings and Islamic Manners (সালাম ও কুশল বিনিময়)
  if (
    query.includes('সালাম') || 
    query.includes('salam') || 
    query.includes('assalamu') || 
    query.includes('আসসালামু') ||
    query.includes('alaikum')
  ) {
    return {
      text: `**ওয়ালাইকুম আসসালাম ওয়া রাহমাতুল্লাহি ওয়া বারাকাতুহু!** 🌙\n\nআল্লাহ তাআলা আপনাকে ও আপনার পরিবারকে উত্তম প্রতিদান ও বরকত দান করুন। আমি **${db.settings.foundationName}**-এর ইসলামিক এআই সহকারী।\n\nফাউন্ডেশনের যেসকল তথ্য আমি আপনাকে জানাতে পারি:\n• 🌟 আমাদের চলমান জনকল্যাণমূলক প্রকল্পসমূহ\n• 💳 দান ও যাকাত প্রদানের বিশ্বস্ত মাধ্যম ও একাউন্ট নম্বর\n• 🤝 স্বেচ্ছাসেবক হিসেবে যোগদানের নিয়ম\n• 📢 সর্বশেষ নোটিস ও জরুরি বিজ্ঞপ্তি\n• 📞 প্রধান কার্যালয়ের ঠিকানা ও যোগাযোগের নম্বর\n\nআপনি উপরের **'📋 মেনু (Menu)'** অপশন থেকে যেকোনো বিষয় বেছে নিতে পারেন অথবা সরাসরি প্রশ্ন করতে পারেন।`
    };
  }

  if (query.includes('হোম পেজ') || query.includes('home page') || query.includes('মূল পেজ')) {
    return {
      text: `**${db.settings.foundationName} — হোম পেজের সংক্ষিপ্ত রূপরেখা:**\n\n• **স্লোগান:** ${db.settings.slogan}\n• **জরুরি নোটিস বার:** সর্বশেষ বিজ্ঞপ্তি ও গুরুত্বপূর্ণ ঘোষণা\n• **প্রধান প্রকল্প ও কার্যক্রম:** চলমান ত্রাণ, স্বাস্থ্য ও শিক্ষা প্রজেক্ট\n• **অনলাইন অনুদান বাটন:** সহজে বিকাশ, নগদ ও ব্যাংকে দান\n• **সাম্প্রতিক ব্লগ ও গ্যালারি:** ইসলামিক প্রবন্ধ ও সেবামূলক কাজের আলোকচিত্র`,
      actionLink: 'home',
      actionLabel: 'হোম পেজে যান →'
    };
  }

  if (query.includes('কেমন আছেন') || query.includes('kemon achen') || query.includes('halal') || query.includes('haal')) {
    return {
      text: `**আলহামদুলিল্লাহ!** মহান আল্লাহ সুবহানাহু ওয়া তাআলার অশেষ রহমতে আমি ভালো আছি। আপনি ও আপনার পরিবারের সকলে কেমন আছেন? ফাউন্ডেশন সংক্রান্ত যেকোনো সহায়তায় আমি আপনার পাশে আছি।`
    };
  }

  if (query.includes('ধন্যবাদ') || query.includes('thanks') || query.includes('shukriya') || query.includes('শুকরিয়া') || query.includes('জাজাকাল্লাহ')) {
    return {
      text: `**জাযাকুমুল্লাহু খাইরান!** (আল্লাহ আপনাকে সর্বোত্তম প্রতিদান দিন)। দ্বীনি ও মানবিক কাজের সাথে থাকার জন্য আপনাকে আন্তরিক মোবারকবাদ। আর কোনো তথ্য প্রয়োজন হলে নির্দ্বিধায় জিজ্ঞেস করতে পারেন।`
    };
  }

  // 3. Donation & Payment Accounts (দান, যাকাত, বিকাশ, নগদ, ব্যাংক)
  if (
    query.includes('দান') || 
    query.includes('ডোনেশন') || 
    query.includes('donate') || 
    query.includes('যাকাত') || 
    query.includes('সদকা') || 
    query.includes('বিকাশ') || 
    query.includes('bkash') || 
    query.includes('নগদ') || 
    query.includes('nagad') || 
    query.includes('রকেট') || 
    query.includes('rocket') || 
    query.includes('ব্যাংক') || 
    query.includes('bank') || 
    query.includes('একাউন্ট')
  ) {
    const s = db.settings;
    return {
      text: `**দান ও সদকা প্রদানের বিশ্বস্ত মাধ্যমসমূহ:**\n\n“নিশ্চয়ই দানশীল পুরুষ ও দানশীল নারী... তাদেরকে দেওয়া হবে বহুগুণ এবং তাদের জন্য রয়েছে সম্মানজনক পুরস্কার।” — (সূরা আল-হাদীদ: ১৮)\n\n📱 **মোবাইল ব্যাংকিং:**\n• **বিকাশ:** \`${s.bkashNumber || '০১৭০০-১২৩৪৫৬'}\`\n• **নগদ:** \`${s.nagadNumber || '০১৮০০-১২৩৪৫৬'}\`\n• **রকেট:** \`${s.rocketNumber || '০১৭০০-১২৩৪৫৬-৭'}\`\n\n🏦 **ব্যাংক একাউন্ট বিবরণ:**\n• **ব্যাংক:** ${s.bankName || 'ইসলামী ব্যাংক বাংলাদেশ পিএলসি'}\n• **হিসাবের নাম:** ${s.bankAccountName || s.foundationName}\n• **হিসাব নম্বর:** \`${s.bankAccountNumber || '২০৫০১২৩৪৫৬৭৮৯০০'}\`\n• **শাখা:** ${s.bankBranch || 'প্রধান শাখা'}\n• **রাউটিং:** ${s.bankRouting || '১২৫২৬০৯৮৭'}\n\nটাকা পাঠানোর পর ট্রানজেকশন আইডি দিয়ে আমাদের ডোনেশন পেজে নিশ্চিত করতে পারেন।`,
      actionLink: 'join',
      actionLabel: 'অনলাইনে দান করুন →'
    };
  }

  // 4. Activities & Projects (কার্যক্রম, প্রজেক্ট, ত্রাণ, শিক্ষা, চিকিৎসা)
  if (
    query.includes('কার্যক্রম') || 
    query.includes('প্রজেক্ট') || 
    query.includes('ত্রাণ') || 
    query.includes('চিকিৎসা') || 
    query.includes('এতিম') || 
    query.includes('পানি') || 
    query.includes('activity') || 
    query.includes('project')
  ) {
    const activeList = db.activities.slice(0, 4).map((a, i) => 
      `${i + 1}. **${a.title}** (${a.category})\n   • লক্ষ্যমাত্রা: ৳${a.targetAmount?.toLocaleString('bn-BD') || 0} | সংগৃহীত: ৳${a.raisedAmount?.toLocaleString('bn-BD') || 0}\n   • অবস্থা: ${a.status}`
    ).join('\n\n');

    return {
      text: `**আমাদের চলমান প্রধান প্রধান কার্যক্রমসমূহ:**\n\n${activeList}\n\nআপনি নির্দিষ্ট কোনো প্রকল্পে সরাসরি সদকা বা যাকাত দিতে পারেন। বিস্তারিত দেখতে আমাদের কার্যক্রম পেজে ভিজিট করুন।`,
      actionLink: 'activities',
      actionLabel: 'সকল কার্যক্রম দেখুন →'
    };
  }

  // 5. Volunteer Information (স্বেচ্ছাসেবক, ভলান্টিয়ার, জয়েন)
  if (
    query.includes('স্বেচ্ছাসেবক') || 
    query.includes('ভলান্টিয়ার') || 
    query.includes('volunteer') || 
    query.includes('মেম্বার') || 
    query.includes('যোগদান') || 
    query.includes('কাজ করতে চাই')
  ) {
    return {
      text: `**স্বেচ্ছাসেবক হিসেবে যোগদানের নিয়ম:**\n\nফাউন্ডেশনের মানবকল্যাণমূলক কাজে আপনার মেধা ও সময় দিয়ে অংশ নিতে পারেন।\n\n✅ **আবেদনের ধাপ:**\n১. আমাদের অনলাইন স্বেচ্ছাসেবক নিবন্ধন ফরম পূরণ করুন।\n২. আপনার বিভাগ, পেশা ও আগ্রহের খাত নির্বাচন করুন।\n৩. আমাদের টিম আপনার সাথে যোগাযোগ করে কার্যক্রম বুঝিয়ে দেবে।`,
      actionLink: 'volunteer',
      actionLabel: 'স্বেচ্ছাসেবক ফরম পূরণ করুন →'
    };
  }

  // 6. Notices & Announcements (নোটিস, বিজ্ঞপ্তি, ঘোষণা)
  if (
    query.includes('নোটিস') || 
    query.includes('notice') || 
    query.includes('বিজ্ঞপ্তি') || 
    query.includes('ঘোষণা') || 
    query.includes('খবর') || 
    query.includes('সংবাদ')
  ) {
    const latestNotices = db.notices.filter(n => n.active).slice(0, 3).map((n, i) => 
      `${i + 1}. 📌 **${n.title}** (${n.date})\n   ${n.description}`
    ).join('\n\n');

    return {
      text: `**ফাউন্ডেশনের সর্বশেষ নোটিস ও বিজ্ঞপ্তি:**\n\n${latestNotices || 'বর্তমানে কোনো নতুন বিজ্ঞপ্তি নেই।'}\n\nসকল নোটিস ও পিডিএফ ডাউনলোড করতে নোটিস বোর্ডে যান।`,
      actionLink: 'notices',
      actionLabel: 'নোটিস বোর্ড দেখুন →'
    };
  }

  // 7. Contact & Address (যোগাযোগ, ফোন, ঠিকানা, ইমেইল, অফিস, হেড অফিস)
  if (
    query.includes('যোগাযোগ') || 
    query.includes('contact') || 
    query.includes('ফোন') || 
    query.includes('phone') || 
    query.includes('ঠিকানা') || 
    query.includes('address') || 
    query.includes('অফিস') || 
    query.includes('ইমেইল') || 
    query.includes('email') || 
    query.includes('নাম্বার')
  ) {
    const s = db.settings;
    return {
      text: `**${s.foundationName} — যোগাযোগ ও ঠিকানা:**\n\n📍 **অফিস ঠিকানা:** ${s.address}\n📞 **হটলাইন / মোবাইল:** ${s.phone}\n📱 **বিকল্প মোবাইল:** ${s.altPhone || 'উপলব্ধ নেই'}\n💬 **হোয়াটসঅ্যাপ:** ${s.whatsapp || s.phone}\n✉️ **ইমেইল:** ${s.email}\n🏛️ **রেজিস্ট্রেশন নম্বর:** ${s.regNumber || 'IDF-২০২৪'}\n\nসরাসরি বার্তা পাঠাতে আমাদের যোগাযোগ পেজ ব্যবহার করুন।`,
      actionLink: 'contact',
      actionLabel: 'মেসেজ পাঠান →'
    };
  }

  // 8. About Foundation (আমাদের সম্পর্কে, পরিচিতি, লক্ষ্য, ইতিহাস)
  if (
    query.includes('সম্পর্কে') || 
    query.includes('about') || 
    query.includes('পরিচিতি') || 
    query.includes('লক্ষ্য') || 
    query.includes('উদ্দেশ্য') || 
    query.includes('কবে প্রতিষ্ঠিত')
  ) {
    const s = db.settings;
    return {
      text: `**${s.foundationName} সম্পর্কে সংক্ষেপে:**\n\n${s.slogan}\n\n“${s.missionQuote}”\n\n• **প্রতিষ্ঠা সাল:** ${s.establishedYear || '২০২০'}\n• **রেজি নং:** ${s.regNumber || 'IDF-২০২৪'}\n• **মূল লক্ষ্য:** এতিম প্রতিপালন, স্বাস্থ্যসেবা, জরুরি ত্রাণ সহায়তা ও দ্বীনি শিক্ষা বিস্তার।`,
      actionLink: 'about',
      actionLabel: 'আমাদের সম্পর্কে বিস্তারিত →'
    };
  }

  // 9. Committee & Members (কমিটি, পরিচালক, সদস্য, সভাপতি, সাধারণ সম্পাদক)
  if (
    query.includes('কমিটি') || 
    query.includes('সদস্য') || 
    query.includes('পরিচালক') || 
    query.includes('সভাপতি') || 
    query.includes('মেম্বার') || 
    query.includes('উপদেষ্টা')
  ) {
    const memberList = db.members.filter(m => m.active).slice(0, 4).map(m => 
      `• **${m.name}** — ${m.designation} (${m.category})`
    ).join('\n');

    return {
      text: `**ফাউন্ডেশনের পরিচালনা পরিষদ ও সম্মানিত সদস্যবৃন্দ:**\n\n${memberList}\n\nসকল সম্মানিত সদস্যদের তালিকা দেখতে পরিষদ পেজে যান।`,
      actionLink: 'members',
      actionLabel: 'পরিচালনা পরিষদ দেখুন →'
    };
  }

  // 10. Blogs & Islamic Articles (ব্লগ, প্রবন্ধ, লেখা, কোরআন, হাদিস)
  if (
    query.includes('ব্লগ') || 
    query.includes('আর্টিকেল') || 
    query.includes('blog') || 
    query.includes('প্রবন্ধ') || 
    query.includes('লেখা')
  ) {
    const blogList = db.blogs.slice(0, 3).map((b, i) => 
      `${i + 1}. **${b.title}** (${b.category})\n   লেখক: ${b.author} | পাঠকাল: ${b.readTime}`
    ).join('\n\n');

    return {
      text: `**সাম্প্রতিক প্রকাশিত ইসলামিক ব্লগ ও প্রবন্ধ:**\n\n${blogList}\n\nইসলামিক জ্ঞান ও সমাজসেবামূলক আরও প্রবন্ধ পড়তে ভিজিট করুন।`,
      actionLink: 'blog',
      actionLabel: 'সকল ব্লগ পড়ুন →'
    };
  }

  // 11. Photos & Gallery (ছবি, গ্যালারি, ভিডিও)
  if (
    query.includes('ছবি') || 
    query.includes('গ্যালারি') || 
    query.includes('gallery') || 
    query.includes('ফটো') || 
    query.includes('ভিডিও')
  ) {
    return {
      text: `**আমাদের মাঠপর্যায়ের কার্যক্রমের ফটোগ্যালারি:**\n\nআমাদের সকল ত্রাণ বিতরণ, ফ্রি মেডিকেল ক্যাম্প, খাদ্যসামগ্রী বিতরণ এবং সমাজসেবামূলক ইভেন্টের উচ্চমানের স্থিরচিত্র ও ভিডিও গ্যালারিতে সংরক্ষিত রয়েছে।`,
      actionLink: 'gallery',
      actionLabel: 'ফটোগ্যালারি দেখুন →'
    };
  }

  // Fallback: Polite Islamic intelligent guidance
  return {
    text: `জাযাকুমুল্লাহু খাইরান আপনার প্রশ্নের জন্য।\n\nআপনি নিম্নোক্ত বিষয়গুলোর যেকোনো একটি সম্পর্কে জানতে নিচে দেয়া বোতামগুলোতে চাপ দিতে পারেন অথবা নির্দিষ্ট প্রশ্ন লিখতে পারেন:\n\n• **দান ও যাকাত:** বিকাশ, নগদ ও ব্যাংক একাউন্ট নম্বর\n• **চলমান প্রকল্প:** খাদ্য সহায়তা, এতিম প্রতিপালন, ফ্রি চিকিৎসা\n• **স্বেচ্ছাসেবক:** কীভাবে আবেদন করবেন\n• **বিজ্ঞপ্তি:** সর্বশেষ প্রাতিষ্ঠানিক নোটিস\n• **ঠিকানা ও হটলাইন:** অফিস লোকেশন ও ফোন নম্বর\n\nজরুরি প্রয়োজনে সরাসরি আমাদের হটলাইনে কল করতে পারেন: **${db.settings.phone}**`,
    actionLink: 'contact',
    actionLabel: 'সরাসরি যোগাযোগ করুন →'
  };
}
