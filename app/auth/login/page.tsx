"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
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
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
        router.refresh();
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
            <Lock size={20} className="text-accent" />
          </div>
          <h1 className="headline-md mb-3">Journal Access</h1>
          <p className="text-text-muted text-sm max-w-[240px] mx-auto leading-relaxed">
            Please authenticate to enter your personal editorial suite.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="badge badge-danger w-full py-3 px-4 flex items-center justify-center animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
              <Mail size={12} /> Communication Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              placeholder="e.g. author@ellipsonic.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
              <Lock size={12} /> Secure Key
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
            className="btn btn-primary w-full py-4 text-[11px] group"
          >
            {loading ? "Authenticating..." : "Enter Workspace"}
            {!loading && <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-12 text-center text-xs font-medium text-text-muted">
          New to the collective?{" "}
          <Link href="/auth/register" className="text-accent font-bold hover:underline transition-all">
            Request Registration
          </Link>
        </div>
      </div>
    </div>
  );
}
