import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

function parsePrivateKey(raw: string): string {
  let key = raw.trim();

  // Strip surrounding quotes if pasted from .env file format
  if ((key.startsWith('"') && key.endsWith('"')) ||
      (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }

  // Convert all variants of escaped newlines to real newlines
  // Handles: \n (literal), \\n (double-escaped), %0A (URL-encoded)
  key = key
    .replace(/\\n/g, '\n')
    .replace(/%0A/gi, '\n');

  // Ensure the PEM has proper structure:
  // -----BEGIN ... -----\n<base64>\n-----END ... -----
  // Sometimes the header/footer lines lose their newlines
  key = key
    .replace(/(-----BEGIN [^-]+-----)([^\n])/g, '$1\n$2')
    .replace(/([^\n])(-----END [^-]+-----)/g, '$1\n$2');

  return key;
}

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0]!;

  const rawKey      = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId   = process.env.FIREBASE_PROJECT_ID;

  console.log(
    `[firebase/admin] init — projectId=${projectId ?? 'MISSING'} ` +
    `clientEmail=${clientEmail ? 'set' : 'MISSING'} ` +
    `privateKey=${rawKey ? `set(len=${rawKey.length})` : 'MISSING'}`
  );

  if (!rawKey || !clientEmail || !projectId) {
    console.warn('[firebase/admin] WARNING: missing credentials — Firestore calls will fail at runtime');
    return initializeApp({ projectId: projectId || 'placeholder' });
  }

  const privateKey = parsePrivateKey(rawKey);

  // Log just enough to debug format issues without exposing the key
  console.log(
    `[firebase/admin] key after parse — len=${privateKey.length} ` +
    `hasBegin=${privateKey.includes('BEGIN PRIVATE KEY')} ` +
    `hasEnd=${privateKey.includes('END PRIVATE KEY')} ` +
    `realNewlines=${(privateKey.match(/\n/g) || []).length}`
  );

  try {
    return initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
  } catch (err) {
    // Don't crash the build — report at runtime instead
    console.error('[firebase/admin] cert() failed:', err instanceof Error ? err.message : err);
    return initializeApp({ projectId });
  }
}

const adminApp = getAdminApp();
export const adminDb   = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);
