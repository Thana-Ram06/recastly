import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/firebase/admin';
import { createOrUpdateUser } from '@/lib/firestore';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(token);
    const body = await req.json();

    await createOrUpdateUser({
      uid: decoded.uid,
      email: decoded.email || body.email || '',
      displayName: body.displayName || decoded.name || '',
      photoURL: body.photoURL || decoded.picture || null,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set('auth_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    return response;
  } catch (err) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('auth_session');
  return response;
}
