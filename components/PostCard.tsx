import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    author: { name: string | null };
  };
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="card animate-fade-in group" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="p-8 flex flex-col h-full" style={{ height: '100%' }}>
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs uppercase tracking-widest font-bold" style={{ color: 'var(--tertiary)' }}>
            Culture
          </span>
          <span className="text-xs text-muted">
            {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>
        
        <h3 className="headline-md mb-4" style={{ fontSize: '1.5rem' }}>
          <Link href={`/posts/${post.id}`} className="flex items-center gap-2" style={{ transition: 'color 0.2s' }}>
            {post.title}
            <ArrowUpRight size={18} className="arrow-icon" style={{ opacity: 0, transition: 'all 0.2s' }} />
          </Link>
        </h3>
        
        <p className="text-muted mb-8 text-sm" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {post.content}
        </p>
        
        <div className="mt-auto pt-6 flex items-center justify-between" style={{ borderTop: '1px solid var(--outline)', marginTop: 'auto' }}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold" style={{ background: 'var(--surface-low)', border: '1px solid var(--outline)', fontSize: '10px' }}>
              {post.author.name?.[0] || "U"}
            </div>
            <span className="text-sm font-medium">{post.author.name || "Anonymous"}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
