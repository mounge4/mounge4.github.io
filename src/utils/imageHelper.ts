/**
 * High-quality SVG loading placeholder image with Bengali text "ছবি লোড হচ্ছে..."
 * Designed with 16:9 ratio and elegant Islamic green theme.
 */
export const LOADING_PLACEHOLDER_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450" fill="none"><rect width="800" height="450" fill="%23064e3b"/><rect x="20" y="20" width="760" height="410" rx="12" fill="%23047857" stroke="%2310b981" stroke-width="2" stroke-dasharray="6 6"/><circle cx="400" cy="190" r="48" fill="%23065f46" stroke="%2334d399" stroke-width="3"/><path d="M400 160v60M370 190h60" stroke="%2334d399" stroke-width="3" stroke-linecap="round"/><text x="400" y="270" fill="%23ecfdf5" font-size="22" font-family="sans-serif" font-weight="bold" text-anchor="middle">ছবি লোড হচ্ছে...</text><text x="400" y="305" fill="%23a7f3d0" font-size="14" font-family="sans-serif" text-anchor="middle">গুগল শিট বা ড্রাইভ থেকে ছবি যুক্ত করতে পারবেন</text></svg>`;

export const LOADING_AVATAR_PLACEHOLDER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300" fill="none"><rect width="300" height="300" rx="150" fill="%23065f46"/><circle cx="150" cy="110" r="45" fill="%2310b981"/><path d="M75 240c0-45 35-70 75-70s75 25 75 70" fill="%2310b981"/><text x="150" y="270" fill="%23ecfdf5" font-size="13" font-family="sans-serif" font-weight="bold" text-anchor="middle">ছবি লোড হচ্ছে...</text></svg>`;

/**
 * Helper to normalize and convert Google Drive and general image URLs
 * Formats Google Drive image IDs/URLs to: https://lh3.googleusercontent.com/d/[IMAGE_ID]
 */
export function formatDriveImageUrl(urlOrId?: string): string {
  if (!urlOrId || typeof urlOrId !== 'string') {
    return LOADING_PLACEHOLDER_IMAGE;
  }

  const trimmed = urlOrId.trim();
  if (!trimmed) return LOADING_PLACEHOLDER_IMAGE;

  // If already in https://lh3.googleusercontent.com/d/ format
  if (trimmed.startsWith('https://lh3.googleusercontent.com/d/')) {
    return trimmed;
  }

  // Check if standard Google Drive sharing link: https://drive.google.com/file/d/FILE_ID/view...
  const driveFileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveFileMatch[1]}`;
  }

  // Check if Google Drive open?id=FILE_ID format
  const driveIdMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (driveIdMatch && driveIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}`;
  }

  // Check if Google Drive uc?export=view&id=FILE_ID format
  const driveUcMatch = trimmed.match(/\/uc\?id=([a-zA-Z0-9_-]+)/);
  if (driveUcMatch && driveUcMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveUcMatch[1]}`;
  }

  // If user entered only a bare alphanumeric ID (approx 20-50 chars with typical Drive ID pattern)
  if (/^[a-zA-Z0-9_-]{20,50}$/.test(trimmed)) {
    return `https://lh3.googleusercontent.com/d/${trimmed}`;
  }

  // Otherwise return standard valid URL or trimmed string
  return trimmed;
}

/**
 * Validates if an image string looks like a valid URL or Drive ID
 */
export function isValidImageUrl(input: string): boolean {
  if (!input || !input.trim()) return false;
  const trimmed = input.trim();
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:image/') ||
    /^[a-zA-Z0-9_-]{20,50}$/.test(trimmed)
  );
}
