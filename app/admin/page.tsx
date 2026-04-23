import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, FileText, Settings, ShieldCheck, Trash2, Eye, EyeOff } from "lucide-react";
import { deletePost, togglePublishStatus } from "@/lib/actions";

export default async function AdminDashboard() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    redirect("/");
  }

  const [usersCount, postsCount, recentPosts, users] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.post.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
    }),
    prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="container py-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16 animate-fade-in">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h1 className="headline-md">Admin <span className="italic text-accent">Control</span></h1>
            <p className="text-text-muted">Orchestrating the Editorial Lume ecosystem.</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button className="btn btn-secondary py-2 px-5 text-xs">System Logs</button>
          <Link href="/posts/new" className="btn btn-primary py-2 px-6 text-xs">New Announcement</Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 animate-fade-in reveal-1">
        <div className="card p-8 bg-surface-low shadow-none border-dashed">
          <div className="flex justify-between items-center mb-4">
            <Users className="text-accent" size={20} />
            <span className="badge badge-primary">Active</span>
          </div>
          <p className="text-xs uppercase tracking-widest font-bold text-text-muted mb-1">Total Members</p>
          <p className="display-lg text-4xl">{usersCount}</p>
        </div>
        
        <div className="card p-8 bg-surface-low shadow-none border-dashed">
          <div className="flex justify-between items-center mb-4">
            <FileText className="text-accent" size={20} />
            <span className="badge badge-primary">Published</span>
          </div>
          <p className="text-xs uppercase tracking-widest font-bold text-text-muted mb-1">Curation Count</p>
          <p className="display-lg text-4xl">{postsCount}</p>
        </div>

        <div className="card p-8 bg-primary text-white col-span-1 lg:col-span-2 overflow-hidden relative">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Settings size={18} className="animate-spin-slow" />
              <span className="text-xs font-bold uppercase tracking-widest opacity-70">Infrastructure Status</span>
            </div>
            <p className="text-2xl font-serif mb-2">High Performance</p>
            <p className="text-xs opacity-60">All systems operational. Latency: 42ms. Security: Reinforced.</p>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 animate-fade-in reveal-2">
        {/* Global Content Management */}
        <div className="xl:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-serif">Global Manuscript Feed</h2>
            <Link href="/admin/posts" className="text-xs font-bold text-accent hover:underline uppercase">View Full Library</Link>
          </div>
          
          <div className="card overflow-hidden">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Manuscript</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-surface-low/50 transition-colors">
                    <td>
                      <p className="font-bold text-sm truncate max-w-[200px]">{post.title}</p>
                      <p className="text-[10px] text-text-muted uppercase tracking-tighter">ID: {post.id.slice(0, 8)}...</p>
                    </td>
                    <td className="text-sm font-medium">{post.author.name || "Anonymous"}</td>
                    <td>
                      <span className={`badge ${post.published ? 'badge-success' : 'badge-danger'}`}>
                        {post.published ? 'Live' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <form action={async () => { "use server"; await togglePublishStatus(post.id); }}>
                          <button type="submit" className="p-2 hover:bg-surface-variant rounded-full transition-colors" title={post.published ? "Unpublish" : "Publish"}>
                            {post.published ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </form>
                        <form action={async () => { "use server"; await deletePost(post.id); }}>
                          <button type="submit" className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Management Quick View */}
        <div className="xl:col-span-1">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-serif">Members</h2>
            <Link href="/admin/users" className="text-xs font-bold text-accent hover:underline uppercase">Audit</Link>
          </div>
          
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="card p-5 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-low flex items-center justify-center font-bold text-primary border border-outline">
                    {user.name?.[0] || user.email[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold truncate max-w-[120px]">{user.name || "User"}</p>
                    <p className="text-[10px] text-text-muted uppercase">{user.role}</p>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-[10px] font-bold text-accent uppercase tracking-widest">Profile</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
