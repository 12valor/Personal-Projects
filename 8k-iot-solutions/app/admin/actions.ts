'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { saveImageFile } from '@/lib/upload';

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_auth');
  redirect('/admin/login');
}

export async function saveProject(prevState: any, formData: FormData) {
  try {
    const id = formData.get('id') as string | null;
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const category = formData.get('category') as string;
    const shortDescription = formData.get('shortDescription') as string;
    const fullDescription = formData.get('fullDescription') as string;
    const client = formData.get('client') as string | null;
    const tagsString = formData.get('tags') as string;
    const featuresString = formData.get('features') as string;
    
    // Handle image upload
    let coverImage = formData.get('existingCoverImage') as string;
    const imageFile = formData.get('coverImage') as File | null;
    
    if (imageFile && imageFile.size > 0 && imageFile.name) {
      coverImage = await saveImageFile(imageFile, 'project');
    }

    // Handle gallery images upload
    const retainedGalleryImagesString = formData.get('retainedGalleryImages') as string;
    let galleryImages: string[] = [];
    if (retainedGalleryImagesString) {
      try {
        galleryImages = JSON.parse(retainedGalleryImagesString);
      } catch (e) {}
    }
    
    const newGalleryImageFiles = formData.getAll('galleryImages');
    const validFiles = newGalleryImageFiles.filter(
      (file): file is File => file instanceof File && file.size > 0 && file.name !== 'undefined'
    );
    
    if (validFiles.length > 0) {
      const uploadedUrls = await Promise.all(
        validFiles.map(file => saveImageFile(file, 'gallery'))
      );
      galleryImages.push(...uploadedUrls);
    }

    // Parse arrays
    let tags: string[] = [];
    if (tagsString) {
      tags = tagsString.split(',').map(s => s.trim()).filter(Boolean);
    }
    
    let features: string[] = [];
    if (featuresString) {
      features = featuresString.split('\n').map(s => s.trim()).filter(Boolean);
    }

    const projectData = {
      title,
      slug,
      category,
      shortDescription,
      fullDescription,
      coverImage: coverImage || '',
      galleryImages: JSON.stringify(galleryImages),
      tags: JSON.stringify(tags),
      features: JSON.stringify(features),
      client: client || null
    };

    if (id) {
      await prisma.project.update({
        where: { id },
        data: projectData,
      });
    } else {
      // Proactive check (optional but good for UX)
      const existing = await prisma.project.findUnique({
        where: { slug }
      });

      if (existing) {
        return { error: `The slug "${slug}" is already in use by another project.` };
      }

      await prisma.project.create({
        data: projectData,
      });
    }

    revalidatePath('/admin');
    revalidatePath('/projects/hardware');
    revalidatePath('/projects/software');
    revalidatePath(`/projects/${slug}`);
    
    return { success: true };
  } catch (error: any) {
    console.error("Save Project Error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const target = (error.meta?.target as string[]) || [];
        if (target.includes('slug')) {
          return { error: "This slug is already in use. Please choose a different one." };
        }
      }
    }

    return { error: error.message || "An unexpected error occurred while saving the project." };
  }
}

// --- TESTIMONIAL ACTIONS ---

export async function saveTestimonial(formData: FormData) {
  const id = formData.get('id') as string | null;
  const name = formData.get('name') as string;
  const position = formData.get('position') as string | null;
  const text = formData.get('text') as string;
  const rating = parseInt(formData.get('rating') as string || '5');
  
  // Handle avatar upload or URL
  const removeAvatar = formData.get('removeAvatar') === 'true';
  let avatar = formData.get('existingAvatar') as string || '';
  
  if (removeAvatar) {
    avatar = '';
  }

  const avatarFile = formData.get('avatarFile') as File | null;
  const avatarUrl = formData.get('avatarUrl') as string | null;

  if (avatarFile && avatarFile.size > 0 && avatarFile.name) {
    avatar = await saveImageFile(avatarFile, 'avatar');
  } else if (avatarUrl && !removeAvatar) {
    avatar = avatarUrl;
  }

  const testimonialData = {
    name,
    position: position || null,
    text,
    avatar: avatar || null,
    rating,
  };

  if (!(prisma as any).testimonial) {
    throw new Error("Testimonial model not found. Please run 'npx prisma db push' after stopping the dev server.");
  }

  if (id) {
    // @ts-ignore
    await (prisma as any).testimonial.update({
      where: { id },
      data: testimonialData,
    });
  } else {
    // @ts-ignore
    await (prisma as any).testimonial.create({
      data: testimonialData,
    });
  }

  revalidatePath('/admin/testimonials');
  revalidatePath('/'); // Revalidate home page where testimonials are shown
  
  redirect('/admin/testimonials');
}

export async function deleteTestimonial(id: string) {
  if (!(prisma as any).testimonial) return;
  
  // @ts-ignore
  await (prisma as any).testimonial.delete({
    where: { id },
  });
  
  revalidatePath('/admin/testimonials');
  revalidatePath('/');
}
