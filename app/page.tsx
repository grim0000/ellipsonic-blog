import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default async function Home() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <>
      {/* ── Hero Section ── */}
      <section className="hero">
        <div className="container">
          <div className="hero-content animate-in">
            <div className="hero-eyebrow">
              <span className="badge badge-category" style={{ background: 'var(--primary-fixed)', color: 'var(--primary)' }}>
                <Sparkles size={10} /> Journal No. 12
              </span>
              <div className="hero-divider"></div>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                Editorial Excellence
              </span>
            </div>

            <h1 className="display-lg mb-6">
              Quiet Thoughts,<br />
              <em style={{ color: 'var(--primary-container)' }}>Bold Narratives</em>.
            </h1>

            <p className="body-lg mb-8" style={{ maxWidth: '520px' }}>
              Welcome to Inkwell. A refined space where words hold weight
              and ideas find their rhythm.
            </p>

            <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
              <Link href="/archives" className="btn btn-primary" style={{ padding: '0.875rem 2rem' }}>
                Explore Essays
              </Link>
              <Link href="/archives" className="btn btn-secondary" style={{ padding: '0.875rem 2rem' }}>
                Full Archives <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Latest Essays ── */}
      <section className="section container">
        <div className="flex justify-between items-center mb-8" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="headline-lg">Latest Essays</h2>
            <p className="text-muted mt-1" style={{ fontSize: '0.9375rem' }}>
              Our community&apos;s most recent contributions.
            </p>
          </div>
          <Link href="/archives" className="btn btn-secondary btn-sm">
            View All Essays
          </Link>
        </div>

        <div className="grid-3">
          {posts.length > 0 ? (
            posts.map((post: any, i: number) => (
              <div key={post.id} className={`animate-in delay-${(i % 3) + 1}`}>
                <PostCard post={post as any} />
              </div>
            ))
          ) : (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
              <p>No essays published yet. Be the first to share your narrative.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: '3rem 0', borderTop: '1px solid var(--outline)', textAlign: 'center' }}>
        <p className="text-muted" style={{ fontSize: '0.8125rem' }}>
          &copy; {new Date().getFullYear()} Inkwell. All rights reserved.
        </p>
      </footer>
    </>
  );
}
