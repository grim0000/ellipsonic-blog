import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Share2, MessageCircle } from "lucide-react";

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { author: { select: { name: true } } },
  });

  if (!post) notFound();

  return (
    <div className="container py-12 md:py-24 max-w-4xl">
      <Link href="/" className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-12 animate-fade-in text-sm font-medium">
        <ChevronLeft size={16} />
        Back to Essays
      </Link>

      <article className="animate-fade-in">
        <header className="mb-16">
          <div className="flex gap-4 mb-6">
            <span className="text-xs uppercase tracking-widest font-bold text-tertiary">Culture</span>
            <span className="text-xs text-text-muted">{new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          </div>
          
          <h1 className="display-lg mb-8 leading-tight">{post.title}</h1>
          
          <div className="flex justify-between items-center py-8 border-y border-outline">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-surface-low border border-outline flex items-center justify-center font-serif text-lg">
                {post.author.name?.[0] || "U"}
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-widest">Narrated by</p>
                <p className="text-primary font-medium">{post.author.name || "Anonymous"}</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button className="p-2 rounded-full border border-outline hover:bg-surface-low transition-colors"><Share2 size={18} /></button>
              <button className="p-2 rounded-full border border-outline hover:bg-surface-low transition-colors"><MessageCircle size={18} /></button>
            </div>
          </div>
        </header>

        <div className="body-lg leading-[1.8] text-text-main font-sans space-y-8">
          {post.content.split('\n').map((para, i) => (
            para.trim() ? <p key={i}>{para}</p> : <br key={i} />
          ))}
        </div>

        <footer className="mt-24 pt-12 border-t border-outline">
          <div className="card p-12 bg-surface-low text-center">
            <h3 className="headline-md mb-4">Join the Conversation</h3>
            <p className="text-text-muted mb-8 max-w-lg mx-auto">Subscribe to our newsletter to receive weekly insights and editorial narratives directly in your inbox.</p>
            <div className="flex max-w-md mx-auto gap-2">
              <input type="email" placeholder="email@example.com" className="flex-1 p-4 rounded-full border border-outline outline-none focus:border-primary" />
              <button className="btn btn-primary px-8">Subscribe</button>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
