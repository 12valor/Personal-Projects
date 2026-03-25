'use server'

import { prisma } from '@/lib/prisma';

export async function submitContactForm(formData: FormData) {
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const inquiryType = formData.get('inquiryType') as string;
  const message = formData.get('message') as string;

  //validation (pls check for err)
  if (!fullName || !email || !inquiryType || !message) {
    return { success: false, error: 'Please fill out all required fields.' };
  }

  try {
    await prisma.inquiry.create({
      data: {
        fullName,
        email,
        inquiryType,
        message,
      },
    });

    return { success: true, message: 'Thanks for reaching out! We will be in touch soon.' };
  } catch (error) {
    console.error('Database Insert Error:', error);
    return { success: false, error: 'Failed to send your message. Please try again.' };
  }
}