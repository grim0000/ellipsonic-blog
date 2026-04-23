import { prisma } from "@/lib/prisma";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function Home() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <div>
      {/* ── Hero Section ── */}
      <section className="hero">
        <div className="container">
          <div className="hero-content animate-in">
            <p className="label-md" style={{ color: 'var(--primary-container)', marginBottom: '1.5rem' }}>
              ✦ Editorial Journal
            </p>
            <h1 className="display-lg">
              Quiet Thoughts,{" "}
              <span className="italic" style={{ color: 'var(--primary-container)' }}>
                Bold Narratives
              </span>.
            </h1>
            <p className="hero-subtitle">
              Welcome to Ellipsonic — a refined space where words hold weight
              and ideas find their rhythm. We curate the perspectives that
              define our digital landscape.
            </p>
            <div className="hero-actions">
              <Link href="/archives" className="btn btn-primary btn-lg">
                Explore Essays
              </Link>
              <Link href="/archives" className="btn btn-ghost btn-lg">
                Full Archives
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Latest Essays Grid ── */}
      <section className="section">
        <div className="container">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="headline-lg">Latest Essays</h2>
              <p className="text-muted mt-2">
                Our community&apos;s most recent contributions.
              </p>
            </div>
            <Link href="/archives" className="btn btn-ghost btn-sm">
              View All
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
              [1, 2, 3].map((i) => (
                <div key={i} className="empty-state" style={{ padding: '3rem' }}>
                  <p className="text-muted">No essays yet. Be the first to publish!</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Ellipsonic. Crafted with editorial precision.</p>
        </div>
      </footer>
    </div>
  );
}
