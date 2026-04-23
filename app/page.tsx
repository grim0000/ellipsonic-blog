import { prisma } from "@/lib/prisma";
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
    <div className="pb-20">
      {/* Hero Section */}
      <section className="section-padding relative overflow-hidden bg-surface-low rounded-b-3xl">
        <div className="container relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-3/5 animate-fade-in">
              <div className="flex items-center gap-2 mb-6">
                <span className="badge badge-primary flex items-center gap-1">
                  <Sparkles size={12} />
                  Journal No. 12
                </span>
                <div className="h-px w-12 bg-primary opacity-20"></div>
                <span className="text-xs uppercase tracking-widest font-bold text-text-muted">
                  Editorial Excellence
                </span>
              </div>
              
              <h1 className="display-lg mb-8">
                Quiet Thoughts, <br />
                <span className="italic text-accent">Bold Narratives</span>.
              </h1>
              
              <p className="body-lg mb-12 max-w-xl leading-relaxed">
                Welcome to Ellipsonic. A refined space where words hold weight and ideas find their rhythm. We curate the perspectives that define our digital landscape.
              </p>
              
              <div className="flex flex-wrap gap-6">
                <Link href="/posts/featured" className="btn btn-primary px-8 py-4">
                  Explore Essays
                </Link>
                <Link href="/archives" className="btn btn-secondary px-8 py-4 group">
                  Full Archives
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="lg:w-2/5 animate-fade-in reveal-2 hidden lg:block">
              <div className="aspect-[4/5] bg-white rounded-2xl shadow-lg border border-outline p-2 rotate-2 opacity-90 transition-all hover:rotate-0">
                <div className="h-full bg-surface-low rounded-xl flex items-center justify-center p-12 text-center border border-dashed border-outline">
                  <div className="flex flex-col gap-6">
                    <div className="w-12 h-1 bg-accent mx-auto"></div>
                    <p className="font-serif text-2xl italic">"The simplest words often carry the heaviest truths."</p>
                    <p className="text-xs uppercase tracking-widest font-bold">— Editorial Staff</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Abstract background element */}
        <div className="absolute -bottom-24 -right-24 w-32 h-32 bg-accent opacity-10 rounded-full blur-3xl"></div>
      </section>

      {/* Posts Grid */}
      <section className="container section-padding">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div>
            <h2 className="headline-md">Latest Dispatches</h2>
            <p className="text-muted mt-2 truncate">Our community's most recent contributions to the global conversation.</p>
          </div>
          <Link href="/archives" className="btn btn-secondary py-2 px-6 text-xs self-end">
            View All Essays
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.length > 0 ? (
            posts.map((post: any, index: number) => (
              <div key={post.id} className={`animate-fade-in reveal-${(index % 2) + 1}`}>
                <PostCard post={post as any} />
              </div>
            ))
          ) : (
            // Empty state placeholder
            [1, 2, 3].map((i) => (
              <div key={i} className="card p-10 animate-fade-in bg-surface-variant flex flex-col gap-4 opacity-50">
                <div className="h-4 w-12 bg-primary opacity-10 rounded"></div>
                <div className="h-12 w-full bg-primary opacity-10 rounded mt-2"></div>
                <div className="h-24 w-full bg-primary opacity-10 rounded mt-2"></div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
