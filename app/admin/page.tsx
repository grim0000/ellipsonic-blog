import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  Users, FileText, ShieldCheck, Trash2,
  Eye, EyeOff, ArrowUpDown, Lock, Database
} from "lucide-react";
import {
  adminDeletePost, adminTogglePublish,
  adminToggleRole, adminDeleteUser,
  adminSeedDatabase
} from "@/lib/actions";

export default async function AdminPage() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") redirect("/");

  const [
    usersCount,
    postsCount,
    publishedCount,
    draftCount,
    recentUsers,
    allPosts,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.post.count({ where: { published: false } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { posts: true } } },
    }),
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true, email: true } } },
    }),
  ]);

  const currentUserId = (session?.user as any)?.id;

  return (
    <div className="container section">
      <div className="animate-in">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div style={{
            padding: '0.75rem',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
            borderRadius: 'var(--r-lg)',
            color: 'white'
          }}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="headline-lg">Admin Portal</h1>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>
              System overview and community management.
            </p>
          </div>
          <span className="badge badge-admin" style={{ marginLeft: 'auto' }}>
            <Lock size={10} /> Hidden Route
          </span>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }} className="mb-8">
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
              <span className="stat-label">Total Posts</span>
            </div>
            <p className="stat-number">{postsCount}</p>
          </div>
          <div className="stat-card">
            <div className="flex justify-between items-center mb-4">
              <Eye size={20} style={{ color: '#16a34a' }} />
              <span className="stat-label">Published</span>
            </div>
            <p className="stat-number">{publishedCount}</p>
          </div>
          <div className="stat-card stat-card--accent">
            <div className="flex justify-between items-center mb-4">
              <EyeOff size={20} />
              <span className="stat-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Drafts</span>
            </div>
            <p className="stat-number">{draftCount}</p>
          </div>
        </div>

        {/* ── User Management ── */}
        <h2 className="headline-md mb-4">
          <Users size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }} />
          User Management
        </h2>
        <div className="card-static mb-8" style={{ overflow: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Posts</th>
                <th>Role</th>
                <th>Joined</th>
                <th className="text-right">Actions</th>
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
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{u._count.posts}</span>
                  </td>
                  <td>
                    <span className={u.role === "ADMIN" ? "badge badge-admin" : "badge badge-user"}>
                      {u.role}
                    </span>
                  </td>
                  <td className="text-muted" style={{ fontSize: '0.8125rem' }}>
                    {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="text-right">
                    {u.id !== currentUserId ? (
                      <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
                        <form action={adminToggleRole}>
                          <input type="hidden" name="userId" value={u.id} />
                          <button type="submit" className="btn btn-secondary btn-sm" title={u.role === "ADMIN" ? "Demote to User" : "Promote to Admin"}>
                            <ArrowUpDown size={13} />
                            {u.role === "ADMIN" ? "Demote" : "Promote"}
                          </button>
                        </form>
                        <form action={adminDeleteUser}>
                          <input type="hidden" name="userId" value={u.id} />
                          <button type="submit" className="btn btn-danger btn-sm" title="Delete user and all their posts">
                            <Trash2 size={13} /> Delete
                          </button>
                        </form>
                      </div>
                    ) : (
                      <span className="text-muted" style={{ fontSize: '0.75rem', fontStyle: 'italic' }}>You</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Content Management ── */}
        <h2 className="headline-md mb-4">
          <FileText size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }} />
          Content Management
        </h2>
        <div className="card-static" style={{ overflow: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Created</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allPosts.map((post: any) => (
                <tr key={post.id}>
                  <td>
                    <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '0.9375rem' }}>
                      {post.title}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.875rem' }}>{post.author.name || "—"}</div>
                    <div className="text-muted" style={{ fontSize: '0.7rem' }}>{post.author.email}</div>
                  </td>
                  <td>
                    <span className={post.published ? "badge badge-published" : "badge badge-draft"}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="text-muted" style={{ fontSize: '0.8125rem' }}>
                    {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </td>
                  <td className="text-right">
                    <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
                      <form action={adminTogglePublish}>
                        <input type="hidden" name="postId" value={post.id} />
                        <button type="submit" className="btn btn-secondary btn-sm" title={post.published ? "Unpublish" : "Publish"}>
                          {post.published ? <><EyeOff size={13} /> Hide</> : <><Eye size={13} /> Publish</>}
                        </button>
                      </form>
                      <form action={adminDeletePost}>
                        <input type="hidden" name="postId" value={post.id} />
                        <button type="submit" className="btn btn-danger btn-sm">
                          <Trash2 size={13} /> Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {allPosts.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted" style={{ padding: '3rem' }}>
                    No posts in the system yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── System Health ── */}
        <div className="flex justify-between items-center p-6 mt-12 mb-8" style={{ background: 'var(--primary-fixed)', borderRadius: 'var(--r-lg)', border: '1px solid var(--primary-container)' }}>
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>System Health</h3>
            <p className="text-muted" style={{ fontSize: '0.8125rem' }}>If production images are missing, use this to restore the premium editorial data.</p>
          </div>
          <form action={adminSeedDatabase}>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
              <Database size={16} /> Repair Production Data
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
