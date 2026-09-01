import { DatabaseState, SiteSettings, VolunteerItem, ContactMessage, DonationRecord } from '../types';
import { INITIAL_DATABASE_STATE } from '../data/defaultData';
import { GOOGLE_APPS_SCRIPT_CODE as APPS_SCRIPT_SOURCE } from '../utils/googleAppsScriptCode';

const LOCAL_STORAGE_KEY = 'islamic_foundation_db_v1';

/**
 * Load data from LocalStorage or initialize with default data
 */
export function getLocalDatabase(): DatabaseState {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_DATABASE_STATE));
      return INITIAL_DATABASE_STATE;
    }
    const parsed = JSON.parse(raw);
    const mergedSettings = { ...INITIAL_DATABASE_STATE.settings, ...parsed.settings };
    
    // Ensure adminPassword is a string
    if (mergedSettings.adminPassword !== undefined && mergedSettings.adminPassword !== null) {
      mergedSettings.adminPassword = String(mergedSettings.adminPassword);
    }

    // Ensure default deployed script URL is used if empty, whitespace, or matching older default
    const OLD_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxlr5dtZq3FmUdnAVPQ8tNfjucWYKDEYgy-Xj0DNpA6eBdsQJ4BXCMamsZAiI_lkT1yxA/exec";
    if (!mergedSettings.scriptUrl || !String(mergedSettings.scriptUrl).trim() || mergedSettings.scriptUrl === OLD_SCRIPT_URL) {
      mergedSettings.scriptUrl = INITIAL_DATABASE_STATE.settings.scriptUrl;
    }
    if (!mergedSettings.googleSheetUrl || !String(mergedSettings.googleSheetUrl).trim() || mergedSettings.googleSheetUrl === OLD_SCRIPT_URL) {
      mergedSettings.googleSheetUrl = INITIAL_DATABASE_STATE.settings.googleSheetUrl || INITIAL_DATABASE_STATE.settings.scriptUrl;
    }

    const OLD_SHEET_ID = "1mN4KQTrnqhX0oiykGI1VIBvmAxag0DsdXSh1A6N17KQ";
    if (!mergedSettings.spreadsheetUrl || !String(mergedSettings.spreadsheetUrl).trim() || mergedSettings.spreadsheetId === OLD_SHEET_ID) {
      mergedSettings.spreadsheetUrl = INITIAL_DATABASE_STATE.settings.spreadsheetUrl;
      mergedSettings.spreadsheetId = INITIAL_DATABASE_STATE.settings.spreadsheetId;
    }

    return {
      ...INITIAL_DATABASE_STATE,
      ...parsed,
      settings: mergedSettings
    };
  } catch (err) {
    console.error('Failed to load local DB:', err);
    return INITIAL_DATABASE_STATE;
  }
}

/**
 * Save data to LocalStorage
 */
export function saveLocalDatabase(db: DatabaseState): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));
  } catch (err) {
    console.error('Failed to save to local storage:', err);
  }
}

/**
 * Fetch all data from Google Apps Script Web App URL in a single API call
 */
export async function syncFromGoogleSheets(scriptUrl: string): Promise<{ success: boolean; data?: DatabaseState; error?: string }> {
  if (!scriptUrl || !scriptUrl.trim()) {
    return { success: false, error: 'গুগল অ্যাপস স্ক্রিপ্ট Web App URL দেওয়া হয়নি।' };
  }

  const cleanUrl = scriptUrl.trim();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(cleanUrl, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP Error ${response.status}: ${response.statusText}`
      };
    }

    const resJson = await response.json().catch(() => null);

    if (resJson && resJson.status === 'success' && resJson.data) {
      const fetched = resJson.data;
      const current = getLocalDatabase();
      const fetchedSettings = fetched.settings || {};
      if (fetchedSettings.adminPassword !== undefined && fetchedSettings.adminPassword !== null) {
        fetchedSettings.adminPassword = String(fetchedSettings.adminPassword);
      }
      
      const mergedDb: DatabaseState = {
        ...current,
        settings: {
          ...current.settings,
          ...fetchedSettings,
          scriptUrl: cleanUrl // retain existing scriptUrl
        },
        slides: Array.isArray(fetched.slides) ? fetched.slides : current.slides,
        notices: Array.isArray(fetched.notices) ? fetched.notices : current.notices,
        activities: Array.isArray(fetched.activities) ? fetched.activities : current.activities,
        blogs: Array.isArray(fetched.blogs) ? fetched.blogs : current.blogs,
        gallery: Array.isArray(fetched.gallery) ? fetched.gallery : current.gallery,
        members: Array.isArray(fetched.members) ? fetched.members : current.members,
        volunteers: Array.isArray(fetched.volunteers) ? fetched.volunteers : current.volunteers,
        messages: Array.isArray(fetched.messages) ? fetched.messages : current.messages,
        donations: Array.isArray(fetched.donations) ? fetched.donations : current.donations,
        customFields: Array.isArray(fetched.customFields) ? fetched.customFields : current.customFields,
        botQnA: Array.isArray(fetched.botQnA) ? fetched.botQnA : current.botQnA,
        socialLinks: Array.isArray(fetched.socialLinks) ? fetched.socialLinks : current.socialLinks,
        missionQuotes: Array.isArray(fetched.missionQuotes) ? fetched.missionQuotes : current.missionQuotes,
        lastSyncedAt: new Date().toISOString()
      };

      saveLocalDatabase(mergedDb);
      return { success: true, data: mergedDb };
    } else {
      return {
        success: false,
        error: resJson?.message || 'গুগল শিট থেকে ডাটা লোড হয়নি (লোকাল ডাটা সচল রয়েছে)।'
      };
    }
  } catch (err: any) {
    // Graceful fallback to local storage database silently without throwing unhandled console warnings
    return {
      success: false,
      error: err?.message || 'গুগল শিটের সাথে সংযোগ স্থাপন করা যায়নি (লোকাল ডাটা সচল রয়েছে)।'
    };
  }
}

/**
 * Send payload to Google Apps Script Web App
 */
export async function pushToGoogleSheets(scriptUrl: string, action: string, payload: any): Promise<{ success: boolean; message?: string }> {
  if (!scriptUrl || !scriptUrl.trim()) {
    // If no script URL, local save is sufficient
    return { success: true, message: 'লোকাল ডেটাবেজে সফলভাবে সংরক্ষিত হয়েছে।' };
  }

  try {
    const response = await fetch(scriptUrl.trim(), {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Google Apps Script handles text/plain CORS smoothly
      },
      body: JSON.stringify({
        action,
        payload
      })
    });

    const resJson = await response.json().catch(() => null);
    if (resJson && resJson.status === 'success') {
      return { success: true, message: resJson.message || 'গুগল শিটে সফলভাবে সংরক্ষিত হয়েছে।' };
    }
    return { success: true, message: 'ডাটা পাঠানো হয়েছে।' };
  } catch (_err: any) {
    // Graceful fallback to local storage
    return { success: true, message: 'লোকাল স্টোরেজে সংরক্ষিত হয়েছে।' };
  }
}

export const GOOGLE_APPS_SCRIPT_CODE = APPS_SCRIPT_SOURCE;
