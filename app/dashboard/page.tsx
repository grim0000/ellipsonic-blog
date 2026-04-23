import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PenLine, Trash2 } from "lucide-react";
import { deletePost } from "@/lib/actions";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const user = session.user as any;

  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container section">
      <div className="animate-in">
        <div className="flex justify-between items-center mb-8" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="headline-lg">Your Library</h1>
            <p className="text-muted mt-1" style={{ fontSize: '0.9375rem' }}>
              Welcome back, {user.name || "Writer"}.
              <span className="badge badge-user" style={{ marginLeft: '0.5rem' }}>{user.role}</span>
            </p>
          </div>
          <Link href="/posts/new" className="btn btn-primary">
            <PenLine size={16} /> Compose New Essay
          </Link>
        </div>

        <h2 className="headline-md mb-4">Your Essays</h2>

        {posts.length > 0 ? (
          <div className="space-y">
            {posts.map((post: any) => (
              <div key={post.id} className="card-static" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link href={`/posts/${post.id}`}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                      {post.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-3">
                    <span className="text-muted" style={{ fontSize: '0.8125rem' }}>
                      {new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                    <span className={post.published ? "badge badge-published" : "badge badge-draft"}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
                <form action={deletePost}>
                  <input type="hidden" name="postId" value={post.id} />
                  <button type="submit" className="btn btn-danger btn-sm">
                    <Trash2 size={14} /> Delete
                  </button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>Your library is waiting for its first masterpiece.</p>
            <Link href="/posts/new" className="btn btn-primary mt-4" style={{ display: 'inline-flex' }}>
              <PenLine size={16} /> Start Writing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
