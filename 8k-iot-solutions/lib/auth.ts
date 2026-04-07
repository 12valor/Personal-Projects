import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { sendAdminLoginNotification, sendTwoFactorCode } from './email';
import { encrypt, decrypt, SESSION_COOKIE_NAME } from './auth-core';
import { prisma } from './prisma';

export async function checkRateLimit() {
  const headerStore = await headers();
  const ip = headerStore.get('x-forwarded-for') ?? '127.0.0.1';
  
  const attempt = await prisma.loginAttempt.findUnique({
    where: { ip }
  });

  if (attempt && attempt.count >= 5) {
    const timePassed = Date.now() - attempt.lastAttempt.getTime();
    const waitTime = 15 * 60 * 1000; // 15 minutes
    if (timePassed < waitTime) {
      const remainingMinutes = Math.ceil((waitTime - timePassed) / 1000 / 60);
      throw new Error(`Too many attempts. Please try again in ${remainingMinutes} minutes.`);
    } else {
      // Reset if timeout passed
      await prisma.loginAttempt.update({
        where: { ip },
        data: { count: 0, lastAttempt: new Date() }
      });
    }
  }
  return ip;
}

export async function incrementLoginAttempt(ip: string) {
  await prisma.loginAttempt.upsert({
    where: { ip },
    update: { 
      count: { increment: 1 },
      lastAttempt: new Date()
    },
    create: { ip, count: 1 }
  });
}

export async function resetLoginAttempt(ip: string) {
  await prisma.loginAttempt.deleteMany({
    where: { ip }
  });
}

export async function login(password: string) {
  const ip = await checkRateLimit();
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (adminPassword && password === adminPassword) {
    // Correct password - Reset attempts and generate OTP
    await resetLoginAttempt(ip);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to DB
    await prisma.securityCode.create({
      data: { code: otp, expiresAt }
    });

    // Send OTP via email
    await sendTwoFactorCode(otp);

    return { type: 'otp_required' };
  }
  
  // Wrong password - Increment attempts
  await incrementLoginAttempt(ip);
  return { type: 'invalid_password' };
}

export async function verifyOTP(code: string) {
  const ip = await checkRateLimit();
  
  const securityCode = await prisma.securityCode.findFirst({
    where: { 
      code,
      expiresAt: { gt: new Date() }
    },
    orderBy: { createdAt: 'desc' }
  });

  if (!securityCode) {
    await incrementLoginAttempt(ip);
    return false;
  }

  // Valid OTP - Issue Session
  await resetLoginAttempt(ip);
  
  // Cleanup OTP
  await prisma.securityCode.delete({
    where: { id: securityCode.id }
  });

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); 
  const session = await encrypt({ role: 'admin', expires });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  // Final successful login notification
  const headerStore = await headers();
  const userAgent = headerStore.get('user-agent') ?? 'unknown_agent';
  
  sendAdminLoginNotification(ip, userAgent).catch(err => {
    console.error('Failed to send admin login notification:', err);
  });

  return true;
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
