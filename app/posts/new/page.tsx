import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { createPost } from "@/lib/actions";

export default async function NewPostPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  return (
    <div className="container-narrow section">
      <div className="animate-in">
        <p className="label-md text-muted mb-2">Compose</p>
        <h1 className="headline-lg mb-8">New Essay</h1>
      </div>

      <form action={createPost} className="animate-in delay-1">
        <div className="form-group">
          <input
            name="title"
            type="text"
            className="form-input form-input-lg"
            placeholder="Your essay title..."
            required
          />
        </div>

        <div className="form-group">
          <textarea
            name="content"
            className="form-textarea"
            placeholder="Begin writing your narrative..."
            required
          />
        </div>

        <div className="flex items-center gap-3 mb-8" style={{ padding: '1rem', background: 'var(--surface-low)', borderRadius: 'var(--radius-sm)' }}>
          <input
            type="checkbox"
            id="published"
            name="published"
            style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--primary-container)' }}
          />
          <label htmlFor="published" style={{ fontSize: '0.9rem', fontWeight: 500, textTransform: 'none', letterSpacing: 'normal', color: 'var(--on-surface)', marginBottom: 0 }}>
            Publish immediately
          </label>
        </div>

        <div className="flex gap-4">
          <button type="submit" className="btn btn-primary btn-lg">
            Publish Essay
          </button>
          <button type="submit" className="btn btn-ghost btn-lg">
            Save as Draft
          </button>
        </div>
      </form>
    </div>
  );
}
