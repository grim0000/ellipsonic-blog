import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: { select: { name: true } } },
  });

  if (!post) notFound();

  return (
    <div className="reading-container section">
      <div className="animate-in">
        <Link href="/" className="flex items-center gap-2 text-muted mb-8" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
          <ArrowLeft size={16} /> Back to Essays
        </Link>

        <article>
          <header className="article-header">
            {post.image && (
              <div style={{ marginBottom: '2.5rem', borderRadius: 'var(--r-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-ambient)' }}>
                <img 
                  src={post.image} 
                  alt={post.title} 
                  style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
                />
              </div>
            )}
            <span className="badge badge-category mb-4" style={{ display: 'inline-flex' }}>
              Culture
            </span>
            <h1 className="article-title">{post.title}</h1>
            <div className="article-meta">
              <div className="avatar-sm">
                {post.author.name?.[0]?.toUpperCase() || "A"}
              </div>
              <span style={{ fontWeight: 500 }}>{post.author.name || "Anonymous"}</span>
              <span>&middot;</span>
              <span>
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </header>

          <div className="article-body">
            {post.content.split("\n").map((paragraph: string, i: number) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
