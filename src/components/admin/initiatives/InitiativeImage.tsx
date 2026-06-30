'use client';

import { useState, useEffect } from 'react';

interface InitiativeImageProps {
  imageUrl?: string | null;
  title?: string | null;
}

export function InitiativeImage({ imageUrl, title }: InitiativeImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [imageUrl]);

  if (!imageUrl || failed) {
    return (
      <div className="flex h-48 w-full items-center justify-center rounded-t-lg bg-muted">
        <span className="text-sm text-muted-foreground">No image available</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={title ?? 'Initiative image'}
      className="h-48 w-full rounded-t-lg object-cover"
      onError={() => setFailed(true)}
    />
  );
}
