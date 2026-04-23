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
    <article className="card">
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Category + Date */}
        <div className="flex justify-between items-center mb-6">
          <span className="badge badge-category">Culture</span>
          <span className="label-md" style={{ color: 'var(--on-surface-variant)', fontSize: '0.65rem' }}>
            {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', lineHeight: 1.3 }}>
          <Link
            href={`/posts/${post.id}`}
            style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', transition: 'color 0.2s' }}
          >
            {post.title}
            <ArrowUpRight size={16} style={{ flexShrink: 0, marginTop: '0.25rem', opacity: 0.3 }} />
          </Link>
        </h3>

        {/* Preview */}
        <p
          className="text-muted"
          style={{
            fontSize: '0.9rem',
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            marginBottom: '1.5rem',
          }}
        >
          {post.content}
        </p>

        {/* Author */}
        <div className="flex items-center gap-3" style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(115,118,134,0.08)' }}>
          <div className="avatar avatar-sm">
            {post.author.name?.[0]?.toUpperCase() || "U"}
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{post.author.name || "Anonymous"}</span>
        </div>
      </div>
    </article>
  );
}
