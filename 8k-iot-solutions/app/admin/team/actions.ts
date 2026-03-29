"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { saveImageFile } from "@/lib/upload";

export async function createTeamMember(formData: FormData) {
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const bio = formData.get("bio") as string;
  const tagline = formData.get("tagline") as string;
  const motivation = formData.get("motivation") as string;
  const facebookUrl = formData.get("facebookUrl") as string;
  const linkedinUrl = formData.get("linkedinUrl") as string;
  const twitterUrl = formData.get("twitterUrl") as string;
  const instagramUrl = formData.get("instagramUrl") as string;
  const portfolioUrl = formData.get("portfolioUrl") as string;
  const order = parseInt(formData.get("order") as string) || 0;

  // Handle image upload
  let imageUrl = "";
  const imageFile = formData.get("imageFile") as File | null;
  if (imageFile && imageFile.size > 0 && imageFile.name) {
    imageUrl = await saveImageFile(imageFile, "team");
  }

  await (prisma as any).teamMember.create({
    data: {
      name,
      role,
      bio,
      tagline: tagline || "Guided by AI, Powered by you.",
      motivation: motivation || null,
      imageUrl: imageUrl || null,
      facebookUrl: facebookUrl || null,
      linkedinUrl: linkedinUrl || null,
      twitterUrl: twitterUrl || null,
      instagramUrl: instagramUrl || null,
      portfolioUrl: portfolioUrl || null,
      order,
      isActive: true,
    },
  });

  revalidatePath("/admin/team");
  revalidatePath("/");
}

export async function updateTeamMember(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const bio = formData.get("bio") as string;
  const tagline = formData.get("tagline") as string;
  const motivation = formData.get("motivation") as string;
  const facebookUrl = formData.get("facebookUrl") as string;
  const linkedinUrl = formData.get("linkedinUrl") as string;
  const twitterUrl = formData.get("twitterUrl") as string;
  const instagramUrl = formData.get("instagramUrl") as string;
  const portfolioUrl = formData.get("portfolioUrl") as string;
  const order = parseInt(formData.get("order") as string) || 0;

  // Handle image upload
  const removeImage = formData.get("removeImage") === "true";
  let imageUrl = formData.get("existingImageUrl") as string || "";
  
  if (removeImage) {
    imageUrl = "";
  }

  const imageFile = formData.get("imageFile") as File | null;
  if (imageFile && imageFile.size > 0 && imageFile.name) {
    imageUrl = await saveImageFile(imageFile, "team");
  }

  await (prisma as any).teamMember.update({
    where: { id },
    data: {
      name,
      role,
      bio,
      tagline: tagline || "Guided by AI, Powered by you.",
      motivation: motivation || null,
      imageUrl: imageUrl || null,
      facebookUrl: facebookUrl || null,
      linkedinUrl: linkedinUrl || null,
      twitterUrl: twitterUrl || null,
      instagramUrl: instagramUrl || null,
      portfolioUrl: portfolioUrl || null,
      order,
    },
  });

  revalidatePath("/admin/team");
  revalidatePath("/");
}

export async function deleteTeamMember(id: string) {
  await (prisma as any).teamMember.delete({
    where: { id },
  });

  revalidatePath("/admin/team");
  revalidatePath("/");
}

export async function toggleTeamMemberStatus(id: string, currentStatus: boolean) {
  await (prisma as any).teamMember.update({
    where: { id },
    data: {
      isActive: !currentStatus,
    },
  });

  revalidatePath("/admin/team");
  revalidatePath("/");
}
