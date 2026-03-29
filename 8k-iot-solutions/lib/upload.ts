import fs from 'fs/promises';
import path from 'path';
import { put } from '@vercel/blob';

/**
 * Shared utility to handle local file uploads consistently across the admin panels.
 * Ensures the uploads directory exists and persists the file safely.
 */
export async function saveImageFile(file: File, prefix: string = 'img'): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Format consistent timestamped filename
  const uniqueName = prefix 
    ? `${prefix}-${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    : `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

  // If Vercel Blob is configured
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(uniqueName, file, { 
        access: 'public',
        addRandomSuffix: false // We already made it unique
      });
      return blob.url;
    } catch (error: any) {
      console.error("Vercel Blob Upload Error:", error.message || error);
      console.error("Falling back to local disk upload due to Blob error.");
      // Do not throw here so we fall back to local disk for development
    }
  }
    
  // Fallback to local disk for development
  const uploadDir = path.join(process.cwd(), 'public/uploads');
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
  
  const filePath = path.join(uploadDir, uniqueName);
  
  // Persist to disk
  await fs.writeFile(filePath, buffer);
  
  return `/uploads/${uniqueName}`;
}
