import React, { useState } from 'react';
import { formatDriveImageUrl, LOADING_PLACEHOLDER_IMAGE, LOADING_AVATAR_PLACEHOLDER } from '../utils/imageHelper';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  fallback?: string;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  fallback = LOADING_PLACEHOLDER_IMAGE,
  className,
  ...props
}) => {
  const [error, setError] = useState(false);
  const resolvedSrc = error || !src ? fallback : formatDriveImageUrl(src);

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
      className={className}
      referrerPolicy="no-referrer"
      {...props}
    />
  );
};

export const SmartAvatar: React.FC<SmartImageProps> = ({
  src,
  alt,
  fallback = LOADING_AVATAR_PLACEHOLDER,
  className,
  ...props
}) => {
  const [error, setError] = useState(false);
  const resolvedSrc = error || !src ? fallback : formatDriveImageUrl(src);

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
      className={className}
      referrerPolicy="no-referrer"
      {...props}
    />
  );
};
