import { createPost } from "@/lib/actions";

export default function NewPostPage() {
  return (
    <div className="container py-24 max-w-3xl">
      <div className="mb-12 animate-fade-in">
        <h1 className="display-lg mb-4">Compose <span className="italic text-primary">New Essay</span></h1>
        <p className="text-text-muted">Share your thoughts with the world in our curated space.</p>
      </div>

      <form action={createPost} className="card p-10 animate-fade-in">
        <div className="space-y-8">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-3">
              Essay Title
            </label>
            <input
              name="title"
              type="text"
              className="w-full p-4 bg-surface-low rounded-md border border-outline focus:border-primary outline-none transition-all font-serif text-2xl"
              placeholder="The Architecture of Silence..."
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-3">
              Narrative Content
            </label>
            <textarea
              name="content"
              rows={12}
              className="w-full p-6 bg-surface-low rounded-md border border-outline focus:border-primary outline-none transition-all font-sans text-lg leading-relaxed"
              placeholder="Begin your story here..."
              required
            />
          </div>

          <div className="pt-6 flex justify-end gap-4">
            <button type="button" className="btn btn-secondary px-8">Save Draft</button>
            <button type="submit" className="btn btn-primary px-10">Publish Essay</button>
          </div>
        </div>
      </form>
    </div>
  );
}
