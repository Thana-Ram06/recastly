import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0]!;

  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  // During build time env vars may be absent — initialize without credentials
  // so the module can be imported without throwing. Real credentials are used at runtime.
  if (!privateKey || !process.env.FIREBASE_CLIENT_EMAIL) {
    return initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'placeholder',
    });
  }

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
  });
}

const adminApp = getAdminApp();
export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);
