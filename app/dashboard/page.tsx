import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PlusCircle, ShieldAlert } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  const role = (session?.user as any)?.role;

  const posts = await prisma.post.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container py-24">
      <div className="flex justify-between items-end mb-16 animate-fade-in">
        <div>
          <h1 className="headline-md">Your <span className="italic text-primary">Library</span></h1>
          <p className="text-text-muted mt-2">Manage your published essays and drafts.</p>
        </div>
        
        <div className="flex gap-4">
          {role === "ADMIN" && (
            <Link href="/admin" className="btn btn-secondary px-6 flex items-center gap-2">
              <ShieldAlert size={18} />
              Admin Portal
            </Link>
          )}
          <Link href="/posts/new" className="btn btn-primary px-8 flex items-center gap-2">
            <PlusCircle size={18} />
            Create New
          </Link>
        </div>
      </div>

      <div className="grid gap-6 animate-fade-in">
        {posts.length > 0 ? (
          posts.map((post: any) => (
            <div key={post.id} className="card p-8 flex justify-between items-center hover:scale-[1.01]">
              <div>
                <h3 className="text-xl font-serif mb-1">{post.title}</h3>
                <p className="text-xs text-text-muted">
                  Last updated {new Date(post.updatedAt).toLocaleDateString()} • {post.published ? "Published" : "Draft"}
                </p>
              </div>
              <div className="flex gap-4">
                <Link href={`/posts/edit/${post.id}`} className="text-sm font-medium hover:text-primary">Edit</Link>
                <button className="text-sm font-medium text-red-500 hover:text-red-700">Delete</button>
              </div>
            </div>
          ))
        ) : (
          <div className="card p-20 text-center border-dashed border-2 border-outline bg-transparent shadow-none">
            <p className="text-text-muted mb-6">Your library is currently empty.</p>
            <Link href="/posts/new" className="btn btn-primary px-8">Write Your First Essay</Link>
          </div>
        )}
      </div>
    </div>
  );
}
