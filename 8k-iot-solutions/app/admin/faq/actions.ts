"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

export async function createFAQ(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const question = formData.get("question") as string;
  const answer = formData.get("answer") as string;
  const order = parseInt(formData.get("order") as string) || 0;

  await (prisma as any).faqItem.create({
    data: {
      question,
      answer,
      order,
      isActive: true,
    },
  });

  revalidatePath("/admin/faq");
  revalidatePath("/");
}

export async function updateFAQ(id: string, formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const question = formData.get("question") as string;
  const answer = formData.get("answer") as string;
  const order = parseInt(formData.get("order") as string) || 0;

  await (prisma as any).faqItem.update({
    where: { id },
    data: {
      question,
      answer,
      order,
    },
  });

  revalidatePath("/admin/faq");
  revalidatePath("/");
}

export async function deleteFAQ(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await (prisma as any).faqItem.delete({
    where: { id },
  });

  revalidatePath("/admin/faq");
  revalidatePath("/");
}

export async function toggleFAQStatus(id: string, currentStatus: boolean) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await (prisma as any).faqItem.update({
    where: { id },
    data: {
      isActive: !currentStatus,
    },
  });

  revalidatePath("/admin/faq");
  revalidatePath("/");
}
