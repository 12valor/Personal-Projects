'use server';

import { login, verifyOTP } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function handleLoginAction(password: string) {
  try {
    const result = await login(password);
    return result;
  } catch (err: any) {
    if (err.message === 'NEXT_REDIRECT') throw err;
    return { type: 'error', message: err.message };
  }
}

export async function handleVerifyOTPAction(code: string) {
  try {
    const isAuthorized = await verifyOTP(code);
    if (isAuthorized) {
      redirect('/admin');
    } else {
      return { type: 'error', message: 'invalid_code' };
    }
  } catch (err: any) {
    if (err.message === 'NEXT_REDIRECT') throw err;
    return { type: 'error', message: err.message };
  }
}
