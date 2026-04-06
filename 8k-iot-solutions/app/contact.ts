'use server'

import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { headers } from 'next/headers';

type RateLimitData = {
  count: number;
  resetTime: number;
};

// In-memory store for rate limiting IP addresses.
// limits to 2 requests per minute per IP.
const rateLimitMap = new Map<string, RateLimitData>();

export async function submitContactForm(formData: FormData) {
  // Rate Limiting Logic (DDoS Protection)
  const headerStore = await headers();
  const ip = headerStore.get('x-forwarded-for') ?? 'unknown_ip';
  
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 2; // 2 requests per minute

  const rateLimitData = rateLimitMap.get(ip);
  if (rateLimitData) {
    if (now > rateLimitData.resetTime) {
      // Time window expired, reset count
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    } else {
      if (rateLimitData.count >= maxRequests) {
        return { success: false, error: 'Too many inquiries submitted. Please wait a minute before trying again.' };
      }
      // Increment count
      rateLimitData.count += 1;
      rateLimitMap.set(ip, rateLimitData);
    }
  } else {
    // First request from this IP
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
  }

  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const inquiryType = formData.get('inquiryType') as string;
  const message = formData.get('message') as string;

  //validation (pls check for err)
  if (!fullName || !email || !inquiryType || !message) {
    return { success: false, error: 'Please fill out all required fields.' };
  }

  try {
    // 1. Save to Database
    await prisma.inquiry.create({
      data: {
        fullName,
        email,
        inquiryType,
        message,
      },
    });

    // 2. Send Email Notification to Admin
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD, // Your Google App Password
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: 'evangelista.agdiaz@gmail.com', // Admin receive email address
      replyTo: email, // Set the reply-to address to the sender's email
      subject: `New Inquiry via 8K IoT Solutions: ${inquiryType.toUpperCase()}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Contact Form Submission ✨</h2>
          <p>You have received a new message from the 8K IoT Solutions contact form.</p>
          <hr style="border: 1px solid #ccc; margin-bottom: 20px;" />
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
          <p><strong>Message:</strong></p>
          <p style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; font-style: italic;">
            ${message}
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return { success: true, message: 'Thanks for reaching out! We will be in touch soon.' };
  } catch (error) {
    console.error('Database Insert or Email Error:', error);
    return { success: false, error: 'Failed to send your message. Please try again.' };
  }
}