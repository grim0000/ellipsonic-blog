import Link from "next/link";
import { ArrowUpRight, User } from "lucide-react";

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
    <article className="card flex flex-col h-full group">
      <div className="p-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div className="w-8 h-px bg-accent"></div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-muted">
            {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
        
        <h3 className="headline-md mb-6 leading-tight group-hover:text-accent transition-colors">
          <Link href={`/posts/${post.id}`} className="flex items-start gap-2">
            {post.title}
          </Link>
        </h3>
        
        <p className="text-text-muted mb-10 text-sm leading-relaxed line-clamp-3 font-sans">
          {post.content}
        </p>
        
        <div className="mt-auto pt-8 flex items-center justify-between border-t border-outline">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-surface-low border border-outline flex items-center justify-center">
              <User size={14} className="text-primary" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-text-muted leading-none mb-1">Author</p>
              <p className="text-xs font-bold leading-none">{post.author.name || "Anonymous"}</p>
            </div>
          </div>
          
          <Link href={`/posts/${post.id}`} className="w-10 h-10 rounded-full border border-outline flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </article>
  );
}
