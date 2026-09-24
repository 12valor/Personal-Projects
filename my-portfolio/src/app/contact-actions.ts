"use server";

import { z } from "zod";
import { getSupabaseServerClient } from "../lib/supabase";

const ContactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Please provide a valid email address"),
  message: z.string().trim().min(5, "Message must be at least 5 characters"),
});

export interface ContactActionState {
  success: boolean;
  message?: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
    _form?: string[];
  };
  values?: {
    name?: string;
    email?: string;
    message?: string;
  };
}

export const initialContactState: ContactActionState = {
  success: false,
};

export async function submitContactAction(
  _prevState: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  const rawData = {
    name: (formData.get("name") as string) || "",
    email: (formData.get("email") as string) || "",
    message: (formData.get("message") as string) || "",
  };

  const validation = ContactSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      values: rawData,
    };
  }

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("inquiries").insert({
      name: validation.data.name,
      email: validation.data.email,
      message: validation.data.message,
    });

    if (error) {
      console.error("Failed to insert inquiry into Supabase:", error);
      return {
        success: false,
        errors: {
          _form: ["Could not submit inquiry right now. Please try again or email directly."],
        },
        values: rawData,
      };
    }

    return {
      success: true,
      message: "Message received. I will review your project and get back to you promptly.",
    };
  } catch (error) {
    console.error("Unexpected error submitting inquiry:", error);
    return {
      success: false,
      errors: {
        _form: ["An unexpected error occurred. Please try again."],
      },
      values: rawData,
    };
  }
}
