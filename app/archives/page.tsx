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
    <div className="container section">
      <header className="animate-in mb-8">
        <p className="label-md text-muted mb-2">Collection</p>
        <h1 className="display-lg" style={{ marginBottom: '0.75rem' }}>
          The <span className="italic">Archives</span>
        </h1>
        <p className="text-muted" style={{ maxWidth: '600px', fontSize: '1.05rem', lineHeight: 1.7 }}>
          A chronological odyssey through our thoughts, essays, and editorial narratives.
        </p>
      </header>

      {posts.length > 0 ? (
        <div className="animate-in delay-1 flex flex-col gap-1">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="flex items-center gap-6"
              style={{
                padding: '1.25rem 1.5rem',
                borderRadius: 'var(--radius-sm)',
                transition: 'all 0.2s ease',
              }}
            >
              <span className="label-md text-muted" style={{ minWidth: '80px', fontSize: '0.7rem' }}>
                {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
              <div style={{ flex: 1 }}>
                <h3 className="font-serif" style={{ fontSize: '1.1rem', fontWeight: 500 }}>{post.title}</h3>
              </div>
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                {post.author.name || "Anonymous"}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state animate-in delay-1">
          <div className="empty-state-icon">📚</div>
          <h3 className="headline-md mb-2">The archives are waiting</h3>
          <p className="text-muted">No published essays yet. Check back soon.</p>
        </div>
      )}
    </div>
  );
}
