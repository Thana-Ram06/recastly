import { NextResponse } from 'next/server';

export async function GET() {
  const projectId    = process.env.FIREBASE_PROJECT_ID;
  const clientEmail  = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey   = process.env.FIREBASE_PRIVATE_KEY;
  const geminiKey    = process.env.GOOGLE_AI_API_KEY;
  const geminiModel  = process.env.GEMINI_MODEL;

  const keyInfo = privateKey
    ? {
        length:         privateKey.length,
        startsWithQuote: privateKey.startsWith('"'),
        endsWithQuote:   privateKey.endsWith('"'),
        hasBeginMarker:  privateKey.includes('BEGIN PRIVATE KEY'),
        hasEndMarker:    privateKey.includes('END PRIVATE KEY'),
        hasLiteralSlashN: privateKey.includes('\\n'),
        hasRealNewlines:  privateKey.includes('\n'),
        first20:          privateKey.slice(0, 20),
        last20:           privateKey.slice(-20),
      }
    : null;

  return NextResponse.json({
    firebase: {
      projectId:   projectId  ? `set (${projectId})` : 'MISSING',
      clientEmail: clientEmail ? `set (${clientEmail})` : 'MISSING',
      privateKey:  keyInfo ?? 'MISSING',
    },
    gemini: {
      apiKey: geminiKey ? `set (len=${geminiKey.length})` : 'MISSING',
      model:  geminiModel ?? 'not set (will use default)',
    },
  });
}
