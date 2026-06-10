"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createUserProfile, deleteAuthUser } from "@/services/auth";

import {
  type AuthActionState,
  parseLoginFormData,
  parseSignupFormData,
} from "./validators";

export async function signupAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = parseSignupFormData(formData);
  if (!parsed.success) {
    return parsed.state;
  }

  const { display_name, email, password, role } = parsed.data;
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return { error: authError.message };
  }

  const authUser = authData.user;
  if (!authUser) {
    return { error: "Sign up failed. Please try again." };
  }

  try {
    await createUserProfile({
      auth_user_id: authUser.id,
      display_name,
      email,
      role,
    });
  } catch (profileError) {
    try {
      await deleteAuthUser(authUser.id);
    } catch (cleanupError) {
      console.error("signup cleanup failed:", cleanupError);
    }

    const message =
      profileError instanceof Error
        ? profileError.message
        : "Could not create your profile.";

    return { error: message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = parseLoginFormData(formData);
  if (!parsed.success) {
    return parsed.state;
  }

  const { email, password } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
