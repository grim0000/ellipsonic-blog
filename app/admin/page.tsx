import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, FileText, Settings, ShieldCheck } from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    redirect("/");
  }

  const [usersCount, postsCount, recentPosts, users] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.post.findMany({
      take: 5,
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
      <div className="flex items-center gap-4 mb-16 animate-fade-in">
        <div className="p-3 bg-primary rounded-xl text-on-primary">
          <ShieldCheck size={32} />
        </div>
        <div>
          <h1 className="headline-md">Admin <span className="italic">Portal</span></h1>
          <p className="text-text-muted">High-level overview of the Editorial Lume community.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-fade-in">
        <div className="card p-8 bg-surface-low border border-outline">
          <div className="flex justify-between items-start mb-4">
            <Users className="text-primary" size={24} />
            <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Total Users</span>
          </div>
          <p className="display-lg text-4xl">{usersCount}</p>
        </div>
        <div className="card p-8 bg-surface-low border border-outline">
          <div className="flex justify-between items-start mb-4">
            <FileText className="text-primary" size={24} />
            <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Total Essays</span>
          </div>
          <p className="display-lg text-4xl">{postsCount}</p>
        </div>
        <div className="card p-8 bg-primary text-on-primary">
          <div className="flex justify-between items-start mb-4">
            <Settings size={24} />
            <span className="text-xs font-bold opacity-80 uppercase tracking-widest">System Status</span>
          </div>
          <p className="text-xl font-medium">Optimal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in">
        {/* Recent Users */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-serif">Recent Members</h2>
            <Link href="/admin/users" className="text-sm font-medium text-primary hover:underline">View All</Link>
          </div>
          <div className="card overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-low text-[10px] uppercase tracking-widest font-bold text-text-muted">
                  <th className="p-4 pl-8">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4 pr-8 text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-outline hover:bg-surface-low/50 transition-colors">
                    <td className="p-4 pl-8">
                      <p className="font-bold">{user.name || "Anonymous"}</p>
                      <p className="text-xs text-text-muted">{user.email}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${user.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-surface-low text-text-muted'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 pr-8 text-right text-text-muted">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Essays */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-serif">Global Feed</h2>
            <Link href="/admin/posts" className="text-sm font-medium text-primary hover:underline">Manage All</Link>
          </div>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="card p-6 flex justify-between items-center">
                <div>
                  <h4 className="font-serif text-lg">{post.title}</h4>
                  <p className="text-xs text-text-muted">By {post.author.name} • {new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
                <button className="text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-widest">Remove</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
