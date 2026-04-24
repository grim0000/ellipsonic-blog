import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { createPost } from "@/lib/actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewPostPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  return (
    <div className="narrow-container section">
      <div className="animate-in">
        <Link href="/dashboard" className="flex items-center gap-2 text-muted mb-6" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
          <ArrowLeft size={16} /> Back to Library
        </Link>

        <h1 className="headline-lg mb-8">Compose New Essay</h1>

        <form action={createPost}>
          <div className="form-group">
            <input
              type="text"
              name="title"
              className="form-input form-input--title"
              placeholder="Your essay title..."
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Featured Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              name="image"
              className="form-input"
              style={{ fontSize: '0.875rem', padding: '0.5rem' }}
            />
            <p className="text-muted mt-2" style={{ fontSize: '0.7rem' }}>
              Tip: Upload a high-resolution image from your device for the best results.
            </p>
          </div>

          <div className="form-group">
            <textarea
              name="content"
              className="form-textarea"
              placeholder="Begin writing your narrative..."
              required
            />
          </div>

          <div className="flex items-center gap-3 mb-8">
            <input type="checkbox" name="published" id="published" defaultChecked style={{ width: '1.125rem', height: '1.125rem', accentColor: 'var(--primary-container)' }} />
            <label htmlFor="published" style={{ fontSize: '0.875rem', fontWeight: 500, textTransform: 'none', letterSpacing: 'normal', color: 'var(--text)', marginBottom: 0 }}>
              Publish immediately
            </label>
          </div>

          <div className="flex gap-4">
            <button type="submit" className="btn btn-primary" style={{ padding: '0.875rem 2rem' }}>
              Publish Essay
            </button>
            <Link href="/dashboard" className="btn btn-secondary" style={{ padding: '0.875rem 2rem' }}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
