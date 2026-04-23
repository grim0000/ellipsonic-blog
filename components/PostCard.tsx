import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    image?: string | null;
    createdAt: Date;
    author: { name: string | null };
  };
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="card">
      <div className="post-card">
        {post.image && (
          <div style={{ margin: '-2rem -2rem 1.5rem -2rem', overflow: 'hidden', borderRadius: 'var(--r-lg) var(--r-lg) 0 0', height: '200px' }}>
            <img 
              src={post.image} 
              alt={post.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
              className="post-image-hover"
            />
          </div>
        )}
        <div className="post-card-meta">
          <span className="badge badge-category">Culture</span>
          <span className="text-muted" style={{ fontSize: '0.75rem' }}>
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <Link href={`/posts/${post.id}`}>
          <h3 className="post-card-title">{post.title}</h3>
        </Link>

        <p className="post-card-excerpt">{post.content}</p>

        <div className="post-card-footer">
          <div className="avatar-sm">
            {post.author.name?.[0]?.toUpperCase() || "A"}
          </div>
          <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
            {post.author.name || "Anonymous"}
          </span>
        </div>
      </div>
    </article>
  );
}
