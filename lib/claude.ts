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

// gemini-2.5-flash is confirmed free-tier on this key.
// gemini-2.0-flash has free-tier limit: 0 (billing required).
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const API_KEY = process.env.GOOGLE_AI_API_KEY ?? '';

// Log startup state on first module load — safe to see in server logs.
console.log(
  `[gemini] init — model="${MODEL}" key_set=${!!API_KEY && API_KEY !== 'build-placeholder'} key_len=${API_KEY.length}`
);

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

  // The @google/generative-ai SDK wraps errors as:
  //   "Error fetching from <url>: [<httpStatus> <httpText>] <apiMessage>"
  // We match on HTTP status codes AND on legacy gRPC-style codes (e.g. "5 NOT_FOUND")
  // so both old and new SDK versions are covered.

  // 404 / gRPC 5 = NOT_FOUND → wrong model name
  if (
    msg.includes('[404') ||
    msg.includes('NOT_FOUND') ||
    msg.includes('not found') ||
    msg.startsWith('5 ')
  ) {
    return new Error(
      `AI model "${MODEL}" was not found. ` +
      `Set GEMINI_MODEL in your .env.local to a valid name ` +
      `(e.g. gemini-2.5-flash). Current value: "${MODEL}".`
    );
  }

  // 401 / 403 / gRPC 7 = PERMISSION_DENIED, gRPC 16 = UNAUTHENTICATED → bad API key
  if (
    msg.includes('[401') ||
    msg.includes('[403') ||
    msg.includes('PERMISSION_DENIED') ||
    msg.includes('UNAUTHENTICATED') ||
    msg.includes('API_KEY') ||
    msg.includes('API key') ||
    msg.startsWith('7 ') ||
    msg.startsWith('16 ')
  ) {
    return new Error(
      'Google AI API key is invalid or missing. Check GOOGLE_AI_API_KEY in your .env.local.'
    );
  }

  // 429 / gRPC 8 = RESOURCE_EXHAUSTED → quota or free-tier limit
  if (
    msg.includes('[429') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('quota') ||
    msg.includes('Quota') ||
    msg.includes('rate limit') ||
    msg.includes('Too Many Requests') ||
    msg.startsWith('8 ')
  ) {
    return new Error(
      `Google AI quota exceeded for model "${MODEL}". ` +
      `The free tier for this model may have a limit of 0 (billing required). ` +
      `Try switching GEMINI_MODEL to gemini-2.5-flash or gemini-2.5-flash-lite.`
    );
  }

  // 504 / gRPC 4 = DEADLINE_EXCEEDED → timeout
  if (
    msg.includes('[504') ||
    msg.includes('DEADLINE_EXCEEDED') ||
    msg.includes('timed out') ||
    msg.startsWith('4 ')
  ) {
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
    console.error(`[gemini] ${label} failed after ${Date.now() - start}ms:`, err instanceof Error ? err.message : err);
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
