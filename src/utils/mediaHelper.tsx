import React from 'react';
import { Play } from 'lucide-react';
import { formatDriveImageUrl, LOADING_PLACEHOLDER_IMAGE } from './imageHelper';

/**
 * Extracts YouTube video ID from various YouTube URL patterns:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 */
export function extractYouTubeId(url?: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // youtube.com/watch?v=ID
  const watchMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1];
  }

  // youtube.com/shorts/ID
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([^"&?\/\s]{11})/i);
  if (shortsMatch && shortsMatch[1]) {
    return shortsMatch[1];
  }

  // 11 characters ID directly
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

export function getYouTubeEmbedUrl(url?: string): string | null {
  const id = extractYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?rel=0` : null;
}

export function getYouTubeThumbnailUrl(url?: string): string | null {
  const id = extractYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

interface MediaViewerProps {
  imageUrl?: string;
  videoUrl?: string;
  alt?: string;
  className?: string;
  aspectRatio?: '16/9' | '4/3' | 'square';
  allowVideo?: boolean;
}

/**
 * Universal Media Viewer supporting 16:9 images and responsive YouTube video embeds
 */
export const MediaViewer: React.FC<MediaViewerProps> = ({
  imageUrl,
  videoUrl,
  alt = 'মিডিয়া',
  className = '',
  aspectRatio = '16/9',
  allowVideo = true,
}) => {
  const embedUrl = allowVideo ? getYouTubeEmbedUrl(videoUrl) : null;
  const finalImageUrl = formatDriveImageUrl(imageUrl);

  const aspectClass =
    aspectRatio === '16/9'
      ? 'aspect-[16/9]'
      : aspectRatio === '4/3'
      ? 'aspect-[4/3]'
      : 'aspect-square';

  if (embedUrl) {
    return (
      <div className={`relative w-full ${aspectClass} overflow-hidden rounded-xl bg-black ${className}`}>
        <iframe
          src={embedUrl}
          title={alt}
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className={`relative w-full ${aspectClass} overflow-hidden rounded-xl bg-slate-100 ${className}`}>
      <img
        src={finalImageUrl}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={(e) => {
          (e.target as HTMLImageElement).src = LOADING_PLACEHOLDER_IMAGE;
        }}
      />
    </div>
  );
};
