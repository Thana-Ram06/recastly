import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

function parsePrivateKey(raw: string): string {
  // Strip surrounding quotes if the user pasted them: "-----BEGIN..." → -----BEGIN...
  let key = raw.trim();
  if (key.startsWith('"') && key.endsWith('"')) {
    key = key.slice(1, -1);
  }
  // Convert literal \n sequences to real newlines (common Vercel copy-paste issue)
  key = key.replace(/\\n/g, '\n');
  return key;
}

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0]!;

  const rawKey     = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId   = process.env.FIREBASE_PROJECT_ID;

  console.log(
    `[firebase/admin] init — projectId=${projectId ?? 'MISSING'} ` +
    `clientEmail=${clientEmail ? 'set' : 'MISSING'} ` +
    `privateKey=${rawKey ? `set(len=${rawKey.length})` : 'MISSING'}`
  );

  // During build time env vars may be absent — initialize without credentials
  // so the module can be imported without throwing. Real credentials are used at runtime.
  if (!rawKey || !clientEmail) {
    console.warn('[firebase/admin] WARNING: credentials missing — Firestore calls will fail at runtime');
    return initializeApp({
      projectId: projectId || 'placeholder',
    });
  }

  const privateKey = parsePrivateKey(rawKey);

  return initializeApp({
    credential: cert({
      projectId:   projectId!,
      clientEmail,
      privateKey,
    }),
  });
}

const adminApp = getAdminApp();
export const adminDb   = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);
