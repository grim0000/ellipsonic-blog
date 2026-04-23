import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, FileText, ShieldCheck, Trash2 } from "lucide-react";
import { adminDeletePost } from "@/lib/actions";

export default async function AdminPage() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") redirect("/");

  const [usersCount, postsCount, recentUsers, recentPosts] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.user.findMany({ take: 8, orderBy: { createdAt: "desc" } }),
    prisma.post.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
    }),
  ]);

  return (
    <div className="container section">
      <div className="animate-in">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div style={{ padding: '0.75rem', background: 'linear-gradient(135deg, var(--primary), var(--primary-container))', borderRadius: 'var(--r-lg)', color: 'white' }}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="headline-lg">Admin Portal</h1>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>System overview and community management.</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid-3 mb-8">
          <div className="stat-card">
            <div className="flex justify-between items-center mb-4">
              <Users size={20} style={{ color: 'var(--primary-container)' }} />
              <span className="stat-label">Total Users</span>
            </div>
            <p className="stat-number">{usersCount}</p>
          </div>
          <div className="stat-card">
            <div className="flex justify-between items-center mb-4">
              <FileText size={20} style={{ color: 'var(--primary-container)' }} />
              <span className="stat-label">Total Essays</span>
            </div>
            <p className="stat-number">{postsCount}</p>
          </div>
          <div className="stat-card stat-card--accent">
            <div className="flex justify-between items-center mb-4">
              <ShieldCheck size={20} />
              <span className="stat-label" style={{ color: 'rgba(255,255,255,0.7)' }}>System</span>
            </div>
            <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>Optimal</p>
          </div>
        </div>

        {/* Data Grid */}
        <div className="grid-2">
          {/* Recent Members */}
          <div>
            <h2 className="headline-md mb-4">Recent Members</h2>
            <div className="card-static" style={{ overflow: 'hidden' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th className="text-right">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((u: any) => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{u.name || "—"}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{u.email}</div>
                      </td>
                      <td>
                        <span className={u.role === "ADMIN" ? "badge badge-admin" : "badge badge-user"}>
                          {u.role}
                        </span>
                      </td>
                      <td className="text-right text-muted">
                        {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Global Feed */}
          <div>
            <h2 className="headline-md mb-4">Global Feed</h2>
            <div className="space-y">
              {recentPosts.map((post: any) => (
                <div key={post.id} className="card-static" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 600 }}>
                      {post.title}
                    </h4>
                    <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                      By {post.author.name || "Anonymous"} &middot; {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <form action={adminDeletePost}>
                    <input type="hidden" name="postId" value={post.id} />
                    <button type="submit" className="btn btn-danger btn-sm">
                      <Trash2 size={13} /> Remove
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
