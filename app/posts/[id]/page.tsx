import { prisma } from "@/lib/prisma";
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
    <div className="container-reading section animate-in">
      {/* Back Link */}
      <Link
        href="/"
        className="flex items-center gap-2 text-muted mb-8"
        style={{ fontSize: '0.85rem', fontWeight: 500, transition: 'color 0.2s' }}
      >
        <ArrowLeft size={16} />
        Back to Essays
      </Link>

      {/* Article Header */}
      <header className="mb-8">
        <span className="badge badge-category mb-4" style={{ display: 'inline-flex' }}>Culture</span>
        <h1 className="display-lg" style={{ marginBottom: '1.5rem' }}>{post.title}</h1>
        <div className="flex items-center gap-3">
          <div className="avatar">{post.author.name?.[0]?.toUpperCase() || "U"}</div>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{post.author.name || "Anonymous"}</p>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </header>

      {/* Divider */}
      <div style={{ height: '2px', background: 'var(--surface-high)', margin: '2rem 0', borderRadius: '1px' }} />

      {/* Article Body */}
      <article className="body-lg" style={{ color: 'var(--on-surface)', lineHeight: 1.85 }}>
        {post.content.split("\n").map((paragraph: string, i: number) => (
          <p key={i} style={{ marginBottom: '1.5rem' }}>{paragraph}</p>
        ))}
      </article>

      {/* Back Link Footer */}
      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(115,118,134,0.08)' }}>
        <Link
          href="/"
          className="flex items-center gap-2 text-muted"
          style={{ fontSize: '0.85rem', fontWeight: 500 }}
        >
          <ArrowLeft size={16} />
          Back to Essays
        </Link>
      </div>
    </div>
  );
}
