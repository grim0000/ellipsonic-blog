"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ── Create Post ──
export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const published = formData.get("published") === "on";

  if (!title || !content) return;

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

// ── Delete Post (Owner or Admin only) ──
export async function deletePost(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const postId = formData.get("postId") as string;
  const user = session.user as any;

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return;

  // RBAC: Only the author or an ADMIN can delete
  if (post.authorId !== user.id && user.role !== "ADMIN") {
    return;
  }

  await prisma.post.delete({ where: { id: postId } });

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/archives");
  revalidatePath("/admin");
}

// ── Toggle Publish (Owner or Admin only) ──
export async function togglePublish(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const postId = formData.get("postId") as string;
  const user = session.user as any;

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return;

  // RBAC: Only the author or an ADMIN can toggle
  if (post.authorId !== user.id && user.role !== "ADMIN") {
    return;
  }

  await prisma.post.update({
    where: { id: postId },
    data: { published: !post.published },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/archives");
  revalidatePath("/admin");
}

// ── Admin: Delete User (Admin only) ──
export async function deleteUser(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const user = session.user as any;
  if (user.role !== "ADMIN") return;

  const userId = formData.get("userId") as string;

  // Don't allow admin to delete themselves
  if (userId === user.id) return;

  // Delete user's posts first, then the user
  await prisma.post.deleteMany({ where: { authorId: userId } });
  await prisma.user.delete({ where: { id: userId } });

  revalidatePath("/admin");
}
