"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ─── Helper: verify admin role ───
async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (role !== "ADMIN") throw new Error("Forbidden: Admin access required.");
  return session!;
}

// ─── User Actions ───

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

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.authorId !== userId) {
    throw new Error("Forbidden: You can only delete your own posts.");
  }

  await prisma.post.delete({ where: { id: postId } });

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/archives");
}

// ─── Admin-Only Actions ───

/**
 * Admin: Delete any post in the system.
 */
export async function adminDeletePost(formData: FormData) {
  await requireAdmin();
  const postId = formData.get("postId") as string;

  await prisma.post.delete({ where: { id: postId } });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/archives");
}

/**
 * Admin: Toggle a post's published status.
 */
export async function adminTogglePublish(formData: FormData) {
  await requireAdmin();
  const postId = formData.get("postId") as string;

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new Error("Post not found.");

  await prisma.post.update({
    where: { id: postId },
    data: { published: !post.published },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/archives");
}

/**
 * Admin: Toggle a user's role between ADMIN and USER.
 */
export async function adminToggleRole(formData: FormData) {
  const session = await requireAdmin();
  const userId = formData.get("userId") as string;

  // Prevent self-demotion
  if (userId === (session.user as any).id) {
    throw new Error("Cannot change your own role.");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found.");

  await prisma.user.update({
    where: { id: userId },
    data: { role: user.role === "ADMIN" ? "USER" : "ADMIN" },
  });

  revalidatePath("/admin");
}

/**
 * Admin: Delete a user and all their posts.
 */
export async function adminDeleteUser(formData: FormData) {
  const session = await requireAdmin();
  const userId = formData.get("userId") as string;

  // Prevent self-deletion
  if (userId === (session.user as any).id) {
    throw new Error("Cannot delete your own account.");
  }

  // Delete user's posts first, then the user
  await prisma.post.deleteMany({ where: { authorId: userId } });
  await prisma.user.delete({ where: { id: userId } });

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/archives");
}
