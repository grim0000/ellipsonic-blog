import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title || !content) {
    throw new Error("Title and content are required");
  }

  try {
    await prisma.post.create({
      data: {
        title,
        content,
        published: true,
        authorId: (session.user as any).id,
      },
    });
  } catch (error) {
    console.error("Failed to create post:", error);
    throw new Error("Failed to create post");
  }

  revalidatePath("/");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deletePost(id: string) {
  "use server";

  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const post = await prisma.post.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (!post) throw new Error("Post not found");

  // Only author or admin can delete
  if (post.authorId !== (session.user as any).id && (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.post.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Failed to delete post:", error);
    throw new Error("Failed to delete post");
  }

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/admin");
}

export async function togglePublishStatus(id: string) {
  "use server";

  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized");

  const post = await prisma.post.findUnique({
    where: { id },
    select: { published: true },
  });

  if (!post) throw new Error("Post not found");

  await prisma.post.update({
    where: { id },
    data: { published: !post.published },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/admin");
}
