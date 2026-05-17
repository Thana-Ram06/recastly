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

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY ?? 'build-placeholder');

const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: {
    // Ensure consistent JSON output
    temperature: 0.7,
    maxOutputTokens: 4096,
  },
});

const TIMEOUT_MS = 90_000; // 90 seconds — Gemini 2.5 Flash can be slow on large prompts

async function callGemini(prompt: string, label: string): Promise<string> {
  const start = Date.now();
  console.log(`[gemini] starting ${label} (prompt length=${prompt.length})`);

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
    throw err;
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

  const linkedinPosts    = parseLinkedInPosts(linkedinRaw);
  const twitterThreads   = parseTwitterThreads(twitterRaw);
  const newsletter       = parseNewsletter(newsletterRaw);
  const instagramCaptions = parseInstagramCaptions(instagramRaw);

  console.log('[gemini] parsed — linkedin:', linkedinPosts.length, 'twitter:', twitterThreads.length, 'instagram:', instagramCaptions.length);

  return { linkedinPosts, twitterThreads, newsletter, instagramCaptions };
}
