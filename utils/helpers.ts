import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
    /^[a-zA-Z0-9_-]{11}$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function isValidYouTubeUrl(url: string): boolean {
  return extractVideoId(url) !== null;
}

export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(timestamp));
}

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(timestamp);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function parseTwitterThreads(raw: string): string[][] {
  try {
    const parsed = JSON.parse(raw);
    if (parsed.threads && Array.isArray(parsed.threads)) {
      return parsed.threads.map((t: { tweets: string[] }) => t.tweets);
    }
    return [];
  } catch {
    return [];
  }
}

export function parseLinkedInPosts(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    if (parsed.posts && Array.isArray(parsed.posts)) return parsed.posts;
    return [];
  } catch {
    return [];
  }
}

export function parseNewsletter(raw: string): { subject: string; content: string } {
  try {
    const parsed = JSON.parse(raw);
    return { subject: parsed.subject || '', content: parsed.content || '' };
  } catch {
    return { subject: '', content: raw };
  }
}

export function parseInstagramCaptions(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    if (parsed.captions && Array.isArray(parsed.captions)) return parsed.captions;
    return [];
  } catch {
    return [];
  }
}
