import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/firebase/admin';

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    const batch = adminDb.batch();

    // Delete user document
    batch.delete(adminDb.collection('users').doc(uid));
    batch.delete(adminDb.collection('subscriptions').doc(uid));

    // Delete usage records (current month)
    const usageSnap = await adminDb.collection('usage').where('uid', '==', uid).get();
    usageSnap.docs.forEach((doc) => batch.delete(doc.ref));

    await batch.commit();

    // Delete from Firebase Auth
    await adminAuth.deleteUser(uid);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[user/delete]', err);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
