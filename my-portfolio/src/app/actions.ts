"use server";
import { v2 as cloudinary } from "cloudinary";
import { cookies } from "next/headers";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- 1. CLOUDINARY UPLOAD ---
export async function uploadImage(formData: FormData) {
  const file = formData.get("file") as File;
  
  if (!file) {
    throw new Error("No file found");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "portfolio" }, 
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          reject(error);
        } else {
          resolve(result?.secure_url || "");
        }
      }
    ).end(buffer);
  });
}

// --- 2. PASSWORD VERIFICATION ---
export async function verifyAdminPassword(password: string) {
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies(); // Next.js 15+ needs await here
    cookieStore.set("admin_session", "true", { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    return true;
  }
  return false;
}

// --- 3. CHECK SESSION ---
export async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === "true";
}

// --- 4. LOGOUT (This was missing!) ---
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}