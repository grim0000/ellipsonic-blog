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
    <article className="card animate-fade-in group">
      <div className="p-8 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <span className="text-[10px] uppercase tracking-widest font-bold text-tertiary">
            Culture
          </span>
          <span className="text-[10px] text-text-muted">
            {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>
        
        <h3 className="text-2xl mb-4 group-hover:text-primary transition-colors">
          <Link href={`/posts/${post.id}`} className="flex items-center gap-2">
            {post.title}
            <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
          </Link>
        </h3>
        
        <p className="text-text-muted line-clamp-3 mb-8 text-sm leading-relaxed">
          {post.content}
        </p>
        
        <div className="mt-auto pt-6 border-t border-outline flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-surface-low border border-outline flex items-center justify-center text-[10px] font-bold">
              {post.author.name?.[0] || "U"}
            </div>
            <span className="text-xs font-medium">{post.author.name || "Anonymous"}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
