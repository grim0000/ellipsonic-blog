"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Mail, Lock, User, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        router.push("/auth/login?registered=true");
      } else {
        const data = await response.json();
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] py-12 px-6">
      <div className="card w-full max-w-md p-12 animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-accent"></div>
        
        <div className="text-center mb-12">
          <div className="w-12 h-12 bg-surface-low rounded-full flex items-center justify-center mx-auto mb-6">
            <UserPlus size={20} className="text-accent" />
          </div>
          <h1 className="headline-md mb-3">Join the Collective</h1>
          <p className="text-text-muted text-sm max-w-[280px] mx-auto leading-relaxed">
            Begin your journey with Ellipsonic. Shape the future of editorial discourse.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="badge badge-danger w-full py-3 px-4 flex items-center justify-center animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
              <User size={12} /> Pen Name / Identity
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
              placeholder="e.g. Julian Barnes"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
              <Mail size={12} /> Communication Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
              <Lock size={12} /> Access Passphrase
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-4 text-[11px] group mt-4"
          >
            {loading ? "Initializing..." : "Establish Credentials"}
            {!loading && <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-12 text-center text-xs font-medium text-text-muted">
          Already a member?{" "}
          <Link href="/auth/login" className="text-accent font-bold hover:underline transition-all">
            Access Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
