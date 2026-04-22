import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search } from "lucide-react";

export default async function ArchivesPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div className="container py-24">
      <header className="mb-16 animate-fade-in">
        <h1 className="display-lg mb-4">The <span className="italic">Archives</span></h1>
        <p className="text-muted max-w-2xl">A chronological odyssey through our thoughts, essays, and editorial narratives. Every word, preserved in slate.</p>
      </header>

      <div className="mb-12 relative animate-fade-in">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
        <input 
          type="text" 
          placeholder="Search the collection..." 
          className="pl-12 py-4 rounded-full"
        />
      </div>

      <div className="space-y-12 animate-fade-in">
        {posts.length > 0 ? (
          // Group by year (simplified for now)
          <div className="space-y-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-tertiary border-b border-outline pb-4">
              Collection of 2026
            </h2>
            <div className="grid gap-12">
              {posts.map((post) => (
                <Link key={post.id} href={`/posts/${post.id}`} className="group flex flex-col md:flex-row gap-4 md:gap-12 items-start md:items-center">
                  <span className="text-sm font-bold text-muted w-24">
                    {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-2xl font-serif group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-sm text-muted mt-1">by {post.author.name || "Anonymous"}</p>
                  </div>
                  <span className="text-xs uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-all text-primary">Read Essay</span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="card p-20 text-center bg-surface-low shadow-none border-dashed border-2">
            <p className="text-muted">The archives are currently empty. Check back soon as our library grows.</p>
          </div>
        )}
      </div>
    </div>
  );
}
