import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractVideoId(url: string): string | null {
  // Handles: watch?v=, youtu.be/, /embed/, /v/, /shorts/
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (match) return match[1];
  // Bare video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
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

/**
 * Strip markdown code fences that Gemini wraps around JSON responses.
 * e.g. ```json\n{...}\n``` → {...}
 */
function extractJson(raw: string): string {
  // Try to strip ```json ... ``` or ``` ... ``` wrappers
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  // Fall back: find the first { and last } to extract raw JSON object
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    return raw.slice(start, end + 1);
  }
  return raw.trim();
}

export function parseLinkedInPosts(raw: string): string[] {
  try {
    const cleaned = extractJson(raw);
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed.posts) && parsed.posts.length > 0) return parsed.posts;
    // Fallback: if model returned a single string
    if (typeof parsed === 'string') return [parsed];
    return [raw.trim()];
  } catch {
    // Raw text fallback — return the whole response as one post
    const text = raw.trim();
    return text ? [text] : [];
  }
}

export function parseTwitterThreads(raw: string): string[][] {
  try {
    const cleaned = extractJson(raw);
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed.threads) && parsed.threads.length > 0) {
      return parsed.threads.map((t: { tweets?: string[]; thread?: string[] }) =>
        Array.isArray(t.tweets) ? t.tweets : Array.isArray(t.thread) ? t.thread : []
      );
    }
    return [];
  } catch {
    // Split by newlines as a rough fallback
    const lines = raw.trim().split('\n').filter(Boolean);
    return lines.length > 0 ? [lines] : [];
  }
}

export function parseNewsletter(raw: string): { subject: string; content: string } {
  try {
    const cleaned = extractJson(raw);
    const parsed = JSON.parse(cleaned);
    return {
      subject: typeof parsed.subject === 'string' ? parsed.subject : '',
      content: typeof parsed.content === 'string' ? parsed.content : raw.trim(),
    };
  } catch {
    return { subject: '', content: raw.trim() };
  }
}

export function parseInstagramCaptions(raw: string): string[] {
  try {
    const cleaned = extractJson(raw);
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed.captions) && parsed.captions.length > 0) return parsed.captions;
    return [raw.trim()];
  } catch {
    const text = raw.trim();
    return text ? [text] : [];
  }
}
