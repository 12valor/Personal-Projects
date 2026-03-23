import fs from 'fs/promises';
import path from 'path';

/**
 * Shared utility to handle local file uploads consistently across the admin panels.
 * Ensures the uploads directory exists and persists the file safely.
 */
export async function saveImageFile(file: File, prefix: string = 'img'): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Ensure the upload directory exists
  const uploadDir = path.join(process.cwd(), 'public/uploads');
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
  
  // Format consistent timestamped filename
  const uniqueName = prefix 
    ? `${prefix}-${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    : `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
  const filePath = path.join(uploadDir, uniqueName);
  
  // Persist to disk
  await fs.writeFile(filePath, buffer);
  
  return `/uploads/${uniqueName}`;
}
