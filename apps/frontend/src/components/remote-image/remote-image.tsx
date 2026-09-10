'use client';

import React, { useState } from 'react';
import Image, { StaticImageData } from 'next/image';

export function isExternalUrl(src: string): boolean {
  return /^https?:\/\//.test(src);
}

export interface RemoteImageProps {
  src: string | StaticImageData;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  fallback?: React.ReactNode;
}

export const RemoteImage: React.FC<RemoteImageProps> = ({
  src,
  alt,
  width,
  height,
  fill,
  className = '',
  fallback,
}) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <>{fallback ?? null}</>;
  }

  if (typeof src === 'string' && isExternalUrl(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- external S3 URLs can't go through next/image without remotePatterns
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        draggable={false}
        onError={() => setFailed(true)}
        className={`${fill ? 'absolute inset-0 w-full h-full' : ''} ${className}`}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      loading="lazy"
      draggable={false}
      onError={() => setFailed(true)}
      className={className}
    />
  );
};