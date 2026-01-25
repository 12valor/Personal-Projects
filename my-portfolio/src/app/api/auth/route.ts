import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  // Check against env variables
  if (
    username === process.env.ADMIN_USER && 
    password === process.env.ADMIN_PASSWORD
  ) {
    // Create the response
    const response = NextResponse.json({ success: true });

    // Set a secure cookie (The "Key")
    response.cookies.set('admin_token', 'authenticated', {
      httpOnly: true, // JavaScript can't read this (Security)
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // Login lasts 24 hours
      path: '/',
    });

    return response;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}