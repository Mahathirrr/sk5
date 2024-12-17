'use client';

import { useState } from 'react';
import { parseVideoUrl, getEmbedUrl } from '@/lib/videos/validation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface VideoPreviewProps {
  url: string;
}

export function VideoPreview({ url }: VideoPreviewProps) {
  const [error, setError] = useState<string | null>(null);

  if (!url) {
    return null;
  }

  const metadata = parseVideoUrl(url);

  if (!metadata) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Invalid video URL. Please enter a valid YouTube or Google Drive video URL.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg border bg-muted">
      <iframe
        src={getEmbedUrl(metadata)}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}