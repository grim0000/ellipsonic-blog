import { createPost } from "@/lib/actions";
import { PenTool, Send, Save } from "lucide-react";

export default function NewPostPage() {
  return (
    <div className="container py-24 max-w-4xl">
      <div className="mb-16 animate-fade-in text-center">
        <div className="inline-flex items-center gap-2 mb-6 badge badge-primary py-2 px-4">
          <PenTool size={14} />
          <span className="text-[10px] tracking-widest font-bold uppercase">Creative Manifest</span>
        </div>
        <h1 className="display-lg mb-6">Compose New <span className="italic text-accent">Manuscript</span></h1>
        <p className="text-text-muted max-w-xl mx-auto body-lg">
          Transform your intellectual sparks into enduring narratives. Your perspective is the bridge to our community's evolution.
        </p>
      </div>

      <form action={createPost} className="card p-12 bg-white shadow-lg animate-fade-in reveal-1">
        <div className="space-y-10">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-4 block">
              Manuscript Title
            </label>
            <input
              name="title"
              type="text"
              className="w-full text-3xl font-serif border-none bg-transparent p-0 focus:ring-0 focus:outline-none placeholder:text-outline"
              placeholder="The Resonance of Silent Spaces..."
              required
            />
            <div className="h-px w-full bg-outline mt-4"></div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-4 block">
              Narrative Content
            </label>
            <textarea
              name="content"
              rows={15}
              className="w-full bg-surface-low border border-outline rounded-lg p-8 focus:bg-white focus:border-primary transition-all font-sans text-lg leading-relaxed placeholder:text-text-muted/40"
              placeholder="Begin weaving your story here..."
              required
            />
          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-outline">
            <div className="flex items-center gap-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Auto-saving enabled</span>
            </div>
            
            <div className="flex gap-4 w-full sm:w-auto">
              <button type="button" className="btn btn-secondary flex-1 sm:flex-initial py-3 px-8 text-[11px]">
                <Save size={14} className="mr-2" />
                Store Draft
              </button>
              <button type="submit" className="btn btn-primary flex-1 sm:flex-initial py-3 px-10 text-[11px]">
                <Send size={14} className="mr-2" />
                Publish to Feed
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
