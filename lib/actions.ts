"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Create a new post — requires authenticated user.
 */
export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const published = formData.get("published") === "on";

  await prisma.post.create({
    data: {
      title,
      content,
      published,
      authorId: (session.user as any).id,
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/archives");
  redirect("/dashboard");
}

/**
 * Delete a post — RBAC: users can only delete their own posts.
 */
export async function deletePost(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const postId = formData.get("postId") as string;
  const userId = (session.user as any).id;

  // Verify ownership
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.authorId !== userId) {
    throw new Error("Forbidden: You can only delete your own posts.");
  }

  await prisma.post.delete({ where: { id: postId } });

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/archives");
}

/**
 * Admin delete — RBAC: admins can delete any post.
 */
export async function adminDeletePost(formData: FormData) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (role !== "ADMIN") throw new Error("Forbidden: Admin access required.");

  const postId = formData.get("postId") as string;

  await prisma.post.delete({ where: { id: postId } });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/archives");
}
