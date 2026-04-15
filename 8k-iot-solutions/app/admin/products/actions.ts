"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { saveImageFile } from "@/lib/upload";
import { redirect } from "next/navigation";

export async function saveProduct(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  try {
    const id = formData.get("id") as string | null;
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string | null;
    const order = parseInt(formData.get("order") as string) || 0;
    const featuresString = formData.get("features") as string;

    // Handle image upload
    let imageUrl = formData.get("existingImageUrl") as string;
    const imageFile = formData.get("imageFile") as File | null;

    if (imageFile && imageFile.size > 0 && imageFile.name && imageFile.name !== 'undefined') {
      imageUrl = await saveImageFile(imageFile, "product");
    }

    // Parse features
    let features: string[] = [];
    if (featuresString) {
      features = featuresString
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const productData = {
      name,
      slug,
      description,
      price,
      imageUrl: imageUrl || "",
      features: JSON.stringify(features),
      order,
      isActive: true,
    };

    if (id) {
      await (prisma as any).product.update({
        where: { id },
        data: productData,
      });
    } else {
      // Check for slug uniqueness
      const existing = await (prisma as any).product.findUnique({
        where: { slug },
      });

      if (existing) {
        return { error: `The slug "${slug}" is already in use.` };
      }

      await (prisma as any).product.create({
        data: productData,
      });
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");
    
    return { success: true };
  } catch (error: any) {
    console.error("Save Product Error:", error);
    return { error: error.message || "An unexpected error occurred." };
  }
}

export async function deleteProduct(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await (prisma as any).product.delete({
    where: { id },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function toggleProductStatus(id: string, currentStatus: boolean) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await (prisma as any).product.update({
    where: { id },
    data: {
      isActive: !currentStatus,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
}
