import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, FileText, ShieldCheck, Trash2 } from "lucide-react";
import { deletePost, deleteUser } from "@/lib/actions";

export default async function AdminDashboard() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    redirect("/");
  }

  const [usersCount, postsCount, recentPosts, users] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.post.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
    }),
    prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { posts: true } } },
    }),
  ]);

  return (
    <div className="container section">
      {/* Header */}
      <div className="animate-in mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div style={{ padding: '0.5rem', background: 'linear-gradient(135deg, var(--primary), var(--primary-container))', borderRadius: 'var(--radius-sm)', color: 'white' }}>
            <ShieldCheck size={20} />
          </div>
          <p className="label-md text-muted">Admin Portal</p>
        </div>
        <h1 className="headline-lg">System Overview</h1>
        <p className="text-muted mt-1">Manage your community, essays, and platform health.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid-3 mb-8 animate-in delay-1">
        <div className="stat-card">
          <div className="flex justify-between items-start mb-4">
            <Users size={20} style={{ color: 'var(--primary-container)' }} />
            <span className="stat-label">Total Members</span>
          </div>
          <p className="stat-value">{usersCount}</p>
        </div>
        <div className="stat-card">
          <div className="flex justify-between items-start mb-4">
            <FileText size={20} style={{ color: 'var(--primary-container)' }} />
            <span className="stat-label">Total Essays</span>
          </div>
          <p className="stat-value">{postsCount}</p>
        </div>
        <div className="stat-card-accent" style={{ borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
          <div className="flex justify-between items-start mb-4">
            <ShieldCheck size={20} />
            <span className="stat-label" style={{ color: 'rgba(255,255,255,0.8)' }}>System Status</span>
          </div>
          <p className="stat-value">Optimal</p>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid-2 animate-in delay-2">
        {/* Members Table */}
        <div className="card-static" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem 1.5rem 0' }}>
            <h2 className="title-lg mb-4">Recent Members</h2>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Posts</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{u.name || "Anonymous"}</p>
                      <p className="text-muted" style={{ fontSize: '0.75rem' }}>{u.email}</p>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${u.role === 'ADMIN' ? 'badge-admin' : 'badge-user'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{u._count.posts}</td>
                  <td>
                    {u.role !== "ADMIN" && (
                      <form action={deleteUser}>
                        <input type="hidden" name="userId" value={u.id} />
                        <button type="submit" className="btn btn-danger btn-sm">
                          <Trash2 size={14} />
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Global Feed */}
        <div className="card-static" style={{ padding: '1.5rem' }}>
          <h2 className="title-lg mb-4">Global Feed</h2>
          <div className="flex flex-col gap-3">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex justify-between items-center" style={{ padding: '1rem', background: 'var(--surface-low)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ flex: 1 }}>
                  <Link href={`/posts/${post.id}`}>
                    <h4 className="font-serif" style={{ fontSize: '1rem' }}>{post.title}</h4>
                  </Link>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                    By {post.author.name} · {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <form action={deletePost}>
                  <input type="hidden" name="postId" value={post.id} />
                  <button type="submit" className="btn btn-danger btn-sm">Remove</button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
