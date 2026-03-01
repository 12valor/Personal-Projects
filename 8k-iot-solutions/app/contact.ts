'use server'

import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client using your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function submitContactForm(formData: FormData) {
  // 1. Extract the values from the frontend form
  const email = formData.get('email') as string;
  const contact_number = formData.get('contactNumber') as string;
  const service_requested = formData.get('serviceRequested') as string;
  const message = formData.get('message') as string;

  // Basic validation to ensure required fields aren't empty
  if (!email || !service_requested || !message) {
    return { success: false, error: 'Please fill out all required fields.' };
  }

  // 2. Insert the data into your Supabase table
  const { error } = await supabase
    .from('contact_inquiries')
    .insert([
      { 
        email, 
        contact_number, 
        service_requested, 
        message 
      }
    ]);

  // 3. Handle the response
  if (error) {
    console.error('Supabase Insert Error:', error.message);
    return { success: false, error: 'Failed to send your message. Please try again.' };
  }

  return { success: true, message: 'Thanks for reaching out! We will be in touch soon.' };
}