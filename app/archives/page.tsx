import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ArchivesPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div className="container section">
      <div className="animate-in">
        <header className="mb-8">
          <h1 className="display-lg mb-4">
            The <em>Archives</em>
          </h1>
          <p className="body-lg" style={{ maxWidth: '540px' }}>
            A chronological odyssey through our thoughts, essays, and
            editorial narratives. Every word, preserved.
          </p>
        </header>

        {posts.length > 0 ? (
          <div className="space-y" style={{ maxWidth: '720px' }}>
            {posts.map((post: any) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '2rem',
                  padding: '1.25rem 0',
                  borderBottom: '1px solid var(--outline)',
                  transition: 'all 0.2s ease',
                }}
              >
                <span className="text-muted" style={{ fontSize: '0.8125rem', fontWeight: 600, minWidth: '5rem' }}>
                  {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.125rem' }}>
                    {post.title}
                  </h3>
                  <span className="text-muted" style={{ fontSize: '0.8125rem' }}>
                    by {post.author.name || "Anonymous"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ maxWidth: '480px' }}>
            <p>The archives are currently empty. Check back soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
