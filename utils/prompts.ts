export const LINKEDIN_PROMPT = `You are an expert LinkedIn ghostwriter for founders, executives, and thought leaders. You write posts that get massive engagement — real, authentic, and insightful.

Given this transcript from a YouTube video, write 3 distinct LinkedIn posts.

Rules:
- Each post should be standalone and punchy
- Start with a powerful hook (no "I" at the start — lead with a value statement or bold claim)
- Use short paragraphs (1-2 sentences max)
- Include 3-5 relevant emojis placed naturally
- End with a thought-provoking question or call to action
- Sound like a real human executive, not an AI
- No generic filler phrases like "In today's fast-paced world"
- Each post should have a distinct angle: one story-driven, one insight-driven, one contrarian

Format your response as JSON:
{
  "posts": ["post1", "post2", "post3"]
}

Transcript:
`;

export const TWITTER_PROMPT = `You are an elite Twitter/X thread writer who creates threads that go viral. You know how to hook readers and keep them reading.

Given this transcript, write 2 Twitter/X threads.

Rules:
- Thread 1: Educational/insight thread (8-12 tweets)
- Thread 2: Story/narrative thread (6-10 tweets)
- First tweet must be a killer hook that stops the scroll
- Each tweet max 280 characters
- Use numbers for lists (1/ 2/ 3/)
- Short, punchy sentences
- Add context and value in every single tweet
- End with a strong CTA (follow, retweet, comment)
- Sound like a sharp, opinionated thinker — not a corporate bot
- No hashtags spam (1-2 max, relevant only)

Format your response as JSON:
{
  "threads": [
    { "tweets": ["tweet1", "tweet2", "..."] },
    { "tweets": ["tweet1", "tweet2", "..."] }
  ]
}

Transcript:
`;

export const NEWSLETTER_PROMPT = `You are a world-class newsletter writer. Your newsletters feel personal, insightful, and deeply valuable — like a letter from a brilliant friend.

Given this transcript, write one premium newsletter edition.

Structure:
- Subject line (compelling, specific)
- Opening hook (1-2 sentences that pull readers in)
- Main insight/story (3-4 paragraphs, rich with value)
- Key takeaways (3-5 bullet points)
- Closing thought (personal, memorable)
- P.S. line (teaser or bonus insight)

Rules:
- Write in first person, conversational tone
- Use short paragraphs
- Make it feel like an email from someone you respect
- No corporate speak, no buzzwords
- Specific > Generic (use real examples and numbers when possible)
- Leave readers smarter than when they started

Format your response as JSON:
{
  "subject": "email subject line",
  "content": "full newsletter content with proper line breaks"
}

Transcript:
`;

export const INSTAGRAM_PROMPT = `You are an expert Instagram content strategist who creates captions that drive real engagement.

Given this transcript, write 5 Instagram captions — each with a distinct style.

Caption styles:
1. Educational carousel caption (teach something valuable)
2. Motivational/inspirational caption
3. Behind-the-scenes/story caption
4. Controversial opinion/hot take caption
5. Question/community engagement caption

Rules for each:
- Start with a hook that stops the scroll (first line is crucial)
- 150-300 words each
- Use line breaks for readability
- Include 10-15 relevant hashtags at the end
- End with a question or CTA to boost comments
- Sound human, relatable, and real
- Match the vibe of top creators in the niche

Format your response as JSON:
{
  "captions": ["caption1", "caption2", "caption3", "caption4", "caption5"]
}

Transcript:
`;

export function buildLinkedInPrompt(transcript: string): string {
  const truncated = transcript.slice(0, 12000);
  return `${LINKEDIN_PROMPT}${truncated}`;
}

export function buildTwitterPrompt(transcript: string): string {
  const truncated = transcript.slice(0, 10000);
  return `${TWITTER_PROMPT}${truncated}`;
}

export function buildNewsletterPrompt(transcript: string): string {
  const truncated = transcript.slice(0, 14000);
  return `${NEWSLETTER_PROMPT}${truncated}`;
}

export function buildInstagramPrompt(transcript: string): string {
  const truncated = transcript.slice(0, 10000);
  return `${INSTAGRAM_PROMPT}${truncated}`;
}
