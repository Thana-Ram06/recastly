import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  buildLinkedInPrompt,
  buildTwitterPrompt,
  buildNewsletterPrompt,
  buildInstagramPrompt,
} from '@/utils/prompts';
import {
  parseLinkedInPosts,
  parseTwitterThreads,
  parseNewsletter,
  parseInstagramCaptions,
} from '@/utils/helpers';

// Model is configurable via env — falls back to a known-stable model.
// If you want Gemini 2.5 Flash, set GEMINI_MODEL=gemini-2.5-flash-preview-05-20
// or the current stable alias in your .env.local.
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

const API_KEY = process.env.GOOGLE_AI_API_KEY ?? '';

if (!API_KEY || API_KEY === 'build-placeholder') {
  console.warn('[gemini] WARNING: GOOGLE_AI_API_KEY is not set — generation will fail at runtime');
}

const genAI = new GoogleGenerativeAI(API_KEY || 'build-placeholder');

const model = genAI.getGenerativeModel({
  model: MODEL,
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 4096,
  },
});

const TIMEOUT_MS = 90_000;

function mapGeminiError(err: unknown, label: string): Error {
  if (!(err instanceof Error)) {
    return new Error(`AI generation failed (${label}). Please try again.`);
  }
  const msg = err.message;

  // gRPC status code 5 = NOT_FOUND → wrong model name
  if (msg.startsWith('5 ') || msg.includes('NOT_FOUND')) {
    return new Error(
      `AI model "${MODEL}" was not found. ` +
      `Set GEMINI_MODEL in your .env.local to a valid Gemini model name (e.g. gemini-2.0-flash).`
    );
  }
  // gRPC status code 7 = PERMISSION_DENIED, 16 = UNAUTHENTICATED
  if (msg.startsWith('7 ') || msg.startsWith('16 ') || msg.includes('PERMISSION_DENIED') || msg.includes('UNAUTHENTICATED') || msg.includes('API_KEY')) {
    return new Error('Google AI API key is invalid or missing. Check GOOGLE_AI_API_KEY in your .env.local.');
  }
  // gRPC status code 8 = RESOURCE_EXHAUSTED (quota)
  if (msg.startsWith('8 ') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('QUOTA')) {
    return new Error('Google AI API quota exceeded. Please try again later or check your Gemini API plan.');
  }
  // gRPC status code 4 = DEADLINE_EXCEEDED
  if (msg.startsWith('4 ') || msg.includes('DEADLINE_EXCEEDED')) {
    return new Error('AI generation timed out. Please try with a shorter video.');
  }
  // Catch-all for remaining raw gRPC codes like "3 INVALID_ARGUMENT: ..."
  if (/^\d+ [A-Z_]+/.test(msg)) {
    return new Error(`AI generation failed: ${msg}`);
  }
  return err;
}

async function callGemini(prompt: string, label: string): Promise<string> {
  const start = Date.now();
  console.log(`[gemini] starting ${label} model=${MODEL} (prompt length=${prompt.length})`);

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Gemini ${label} timed out after ${TIMEOUT_MS / 1000}s`)), TIMEOUT_MS)
  );

  try {
    const result = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise,
    ]);
    const text = result.response.text();
    console.log(`[gemini] ${label} done in ${Date.now() - start}ms (response length=${text.length})`);
    return text;
  } catch (err) {
    console.error(`[gemini] ${label} failed after ${Date.now() - start}ms:`, err);
    throw mapGeminiError(err, label);
  }
}

export interface GeneratedContent {
  linkedinPosts: string[];
  twitterThreads: string[][];
  newsletter: { subject: string; content: string };
  instagramCaptions: string[];
}

export async function generateAllContent(transcript: string): Promise<GeneratedContent> {
  const [linkedinRaw, twitterRaw, newsletterRaw, instagramRaw] = await Promise.all([
    callGemini(buildLinkedInPrompt(transcript), 'linkedin'),
    callGemini(buildTwitterPrompt(transcript), 'twitter'),
    callGemini(buildNewsletterPrompt(transcript), 'newsletter'),
    callGemini(buildInstagramPrompt(transcript), 'instagram'),
  ]);

  const linkedinPosts     = parseLinkedInPosts(linkedinRaw);
  const twitterThreads    = parseTwitterThreads(twitterRaw);
  const newsletter        = parseNewsletter(newsletterRaw);
  const instagramCaptions = parseInstagramCaptions(instagramRaw);

  console.log(
    '[gemini] parsed — linkedin:', linkedinPosts.length,
    'twitter:', twitterThreads.length,
    'instagram:', instagramCaptions.length
  );

  return { linkedinPosts, twitterThreads, newsletter, instagramCaptions };
}
