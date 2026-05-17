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
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

async function callGemini(prompt: string): Promise<string> {
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export interface GeneratedContent {
  linkedinPosts: string[];
  twitterThreads: string[][];
  newsletter: { subject: string; content: string };
  instagramCaptions: string[];
}

export async function generateAllContent(transcript: string): Promise<GeneratedContent> {
  const [linkedinRaw, twitterRaw, newsletterRaw, instagramRaw] = await Promise.all([
    callGemini(buildLinkedInPrompt(transcript)),
    callGemini(buildTwitterPrompt(transcript)),
    callGemini(buildNewsletterPrompt(transcript)),
    callGemini(buildInstagramPrompt(transcript)),
  ]);

  const linkedinPosts = parseLinkedInPosts(linkedinRaw);
  const twitterThreads = parseTwitterThreads(twitterRaw);
  const newsletter = parseNewsletter(newsletterRaw);
  const instagramCaptions = parseInstagramCaptions(instagramRaw);

  return { linkedinPosts, twitterThreads, newsletter, instagramCaptions };
}
