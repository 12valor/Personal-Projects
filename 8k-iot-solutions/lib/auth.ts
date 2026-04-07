import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const AUTH_SECRET = process.env.AUTH_SECRET || 'fallback-secret-for-development-change-me';
const key = new TextEncoder().encode(AUTH_SECRET);

export const SESSION_COOKIE_NAME = 'admin_session';

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1w')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function login(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (adminPassword && password === adminPassword) {
    // Session token stays valid for 1 week on server
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); 
    const session = await encrypt({ role: 'admin', expires });

    // NO "expires" or "maxAge" here makes it a Session Cookie
    // Browsers will delete it when the tab/browser is closed
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    return true;
  }
  return false;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', { expires: new Date(0), path: '/' });
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!session) return null;
  try {
    return await decrypt(session);
  } catch (err) {
    return null;
  }
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!session) return;

  // Refresh the session token data but keep the cookie as "session" (no expires)
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: await encrypt(parsed),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  return res;
}
