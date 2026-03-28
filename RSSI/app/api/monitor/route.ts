import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase'; // Adjust path if needed

export async function GET() {
  // Calculate the timestamp for 24 hours ago
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // Query the database view for severe reports in the last day
  const { data, error } = await supabase
    .from('rssi_dashboard_data')
    .select('*')
    .gte('severity_level', 4) // Only look at Level 4 and 5 severity
    .gte('created_at', yesterday);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // THE TRIGGER LOGIC: If 3 or more severe reports arrive in 24 hours
  if (data && data.length >= 3) {
    return NextResponse.json({ 
      alert: true, 
      message: `CRITICAL: ${data.length} high-severity RSSI reports detected in the last 24 hours.`,
      reports: data 
    });
  }

  // Otherwise, everything is fine
  return NextResponse.json({ 
    alert: false, 
    message: "Status normal. No significant clusters detected." 
  });
}