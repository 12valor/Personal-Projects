'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function submitOutbreakReport(formData: FormData) {
  // Convert the form strings into usable types
  const location = formData.get('location') as string
  const severity = formData.get('severity') as string
  const notes = formData.get('notes') as string
  const lat = parseFloat(formData.get('lat') as string)
  const lng = parseFloat(formData.get('lng') as string)

  // Insert into Supabase with the new coordinates
  const { error } = await supabase
    .from('rssi_reports')
    .insert([{ location, severity, notes, lat, lng }])

  if (error) {
    return { success: false, error: error.message }
  }

  // This tells Next.js to refresh the data on the dashboard page
  revalidatePath('/dashboard') 
  return { success: true }
}