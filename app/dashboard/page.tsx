import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PlusCircle, ShieldAlert, BookOpen, Trash2, Edit3 } from "lucide-react";
import { deletePost } from "@/lib/actions";

export default async function DashboardPage() {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  const role = (session?.user as any)?.role;

  const posts = await prisma.post.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container py-24 min-h-[80vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 animate-fade-in gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
              <BookOpen size={16} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Personal Library</span>
          </div>
          <h1 className="headline-md">Your <span className="italic text-accent">Manuscripts</span></h1>
          <p className="text-text-muted mt-2">Manage your published essays and creative drafts.</p>
        </div>
        
        <div className="flex gap-4">
          {role === "ADMIN" && (
            <Link href="/admin" className="btn btn-secondary px-6">
              <ShieldAlert size={16} className="mr-2" />
              Admin
            </Link>
          )}
          <Link href="/posts/new" className="btn btn-primary px-8">
            <PlusCircle size={16} className="mr-2" />
            New Essay
          </Link>
        </div>
      </div>

      <div className="grid gap-8 animate-fade-in reveal-1">
        {posts.length > 0 ? (
          posts.map((post: any, index: number) => (
            <div key={post.id} className={`card p-8 flex flex-col md:flex-row justify-between items-start md:items-center group animate-fade-in`} style={{animationDelay: `${index * 0.1}s`}}>
              <div className="mb-4 md:mb-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`badge ${post.published ? 'badge-success' : 'badge-primary'}`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                  <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold">
                    {new Date(post.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                  </span>
                </div>
                <h3 className="text-2xl font-serif">{post.title}</h3>
              </div>
              
              <div className="flex items-center gap-2 self-end md:self-center">
                <Link href={`/posts/edit/${post.id}`} className="p-3 hover:bg-surface-low rounded-full transition-colors" title="Edit">
                  <Edit3 size={18} className="text-text-muted hover:text-primary" />
                </Link>
                <form action={async () => { "use server"; await deletePost(post.id); }}>
                  <button type="submit" className="p-3 hover:bg-red-50 rounded-full transition-colors group/del" title="Delete">
                    <Trash2 size={18} className="text-text-muted group-hover/del:text-red-500" />
                  </button>
                </form>
              </div>
            </div>
          ))
        ) : (
          <div className="card p-24 text-center border-dashed border-2 border-outline bg-transparent shadow-none">
            <p className="text-text-muted mb-8 text-lg font-serif">Your library is currently empty. The world is waiting for your words.</p>
            <Link href="/posts/new" className="btn btn-primary px-10">Write Your First Essay</Link>
          </div>
        )}
      </div>
    </div>
  );
}
