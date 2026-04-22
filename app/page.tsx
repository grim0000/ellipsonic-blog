import { prisma } from "@/lib/prisma";
import PostCard from "@/components/PostCard";
import Link from "next/link";

export default async function Home() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden bg-surface-low">
        <div className="container relative z-10">
          <div className="max-width-[800px] animate-fade-in">
            <span className="text-sm uppercase tracking-widest font-bold text-primary mb-4 block">
              The Featured Narrative
            </span>
            <h1 className="display-lg mb-8 max-w-2xl leading-[1.1]">
              The Art of Minimalist Living in a <span className="italic text-primary">Digital Age</span>.
            </h1>
            <p className="body-lg text-text-muted mb-10 max-w-xl">
              Exploring the intersection of technology, human connection, and the pursuit of essentialism. A curated collection of essays for the modern mind.
            </p>
            <div className="flex gap-4">
              <Link href="/posts/featured" className="btn btn-primary px-8">Read Essay</Link>
              <Link href="/archives" className="btn btn-secondary px-8">Browse Archives</Link>
            </div>
          </div>
        </div>
        
        {/* Abstract background element */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary opacity-[0.03] skew-x-12 translate-x-24"></div>
      </section>

      {/* Posts Grid */}
      <section className="container py-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="headline-md">Recent Essays</h2>
            <p className="text-text-muted mt-2">Latest insights from our community of thinkers.</p>
          </div>
          <Link href="/archives" className="text-primary font-medium hover:underline">View all</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length > 0 ? (
            posts.map((post: any) => (
              <PostCard key={post.id} post={post as any} />
            ))
          ) : (
            // Mock posts for first-time preview
            [1, 2, 3].map((i) => (
              <div key={i} className="card p-8 animate-fade-in opacity-50">
                <div className="h-4 w-1/4 bg-surface-low rounded mb-4"></div>
                <div className="h-8 w-3/4 bg-surface-low rounded mb-4"></div>
                <div className="h-20 w-full bg-surface-low rounded mb-6"></div>
                <div className="h-4 w-1/2 bg-surface-low rounded"></div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
