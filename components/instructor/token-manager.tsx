{`'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { generateAccessToken } from '@/lib/access-tokens/api';
import { Loader2, Copy, Check } from 'lucide-react';

interface TokenManagerProps {
  courseId: string;
}

export function TokenManager({ courseId }: TokenManagerProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerateToken = async () => {
    try {
      setIsGenerating(true);
      const newToken = await generateAccessToken({
        courseId,
      });
      
      setToken(newToken);
      toast({
        title: 'Token berhasil dibuat',
        description: 'Token akses baru telah dibuat dan siap digunakan.',
      });
    } catch (error) {
      toast({
        title: 'Gagal membuat token',
        description: 'Terjadi kesalahan saat membuat token. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToken = async () => {
    if (token) {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: 'Token disalin',
        description: 'Token telah disalin ke clipboard.',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Akses</CardTitle>
        <CardDescription>
          Generate token akses untuk memberikan akses gratis ke kursus ini
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {token ? (
          <div className="flex items-center gap-2 rounded-lg border p-4">
            <code className="flex-1 font-mono text-sm">{token}</code>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyToken}
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        ) : null}

        <Button
          onClick={handleGenerateToken}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {isGenerating ? 'Membuat Token...' : 'Generate Token Baru'}
        </Button>
      </CardContent>
    </Card>
  );
}`}