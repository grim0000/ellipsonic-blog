import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PenSquare, Trash2 } from "lucide-react";
import { deletePost, togglePublish } from "@/lib/actions";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const user = session.user as any;

  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container section">
      <div className="animate-in mb-8">
        <p className="label-md text-muted mb-2">Your Library</p>
        <h1 className="headline-lg">
          Welcome back, <span className="italic">{user.name || "Writer"}</span>
        </h1>
        <p className="text-muted mt-2">
          Role: <span className="badge badge-admin" style={{ marginLeft: '0.25rem' }}>{user.role}</span>
        </p>
      </div>

      <div className="flex justify-between items-center mb-6 animate-in delay-1">
        <h2 className="title-lg">Your Essays ({posts.length})</h2>
        <Link href="/posts/new" className="btn btn-primary btn-sm">
          <PenSquare size={16} />
          New Essay
        </Link>
      </div>

      {posts.length > 0 ? (
        <div className="flex flex-col gap-4 animate-in delay-2">
          {posts.map((post) => (
            <div key={post.id} className="card-static" style={{ padding: '1.5rem 2rem' }}>
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <Link href={`/posts/${post.id}`}>
                      <h3 className="title-md font-serif" style={{ transition: 'color 0.2s' }}>{post.title}</h3>
                    </Link>
                    {post.published ? (
                      <span className="badge badge-published">Published</span>
                    ) : (
                      <span className="badge badge-draft">Draft</span>
                    )}
                  </div>
                  <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                    {new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <form action={togglePublish}>
                    <input type="hidden" name="postId" value={post.id} />
                    <button type="submit" className="btn btn-ghost btn-sm">
                      {post.published ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  <form action={deletePost}>
                    <input type="hidden" name="postId" value={post.id} />
                    <button type="submit" className="btn btn-danger btn-sm">
                      <Trash2 size={14} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state animate-in delay-2">
          <div className="empty-state-icon">📝</div>
          <h3 className="headline-md mb-2">Your library is waiting</h3>
          <p className="text-muted mb-6">Start your first masterpiece and share it with the world.</p>
          <Link href="/posts/new" className="btn btn-primary">Write Your First Essay</Link>
        </div>
      )}
    </div>
  );
}
