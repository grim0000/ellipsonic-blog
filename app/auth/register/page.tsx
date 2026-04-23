"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.push("/auth/login?registered=true");
      } else {
        const data = await res.json();
        setError(data.error || "Registration failed.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="card-static animate-in" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
        <div className="text-center mb-8">
          <h1 className="headline-md" style={{ marginBottom: '0.5rem' }}>Create Account</h1>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            Join the Ellipsonic editorial community.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-error mb-6">{error}</div>}

          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Full Name</label>
            <input id="reg-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-input" placeholder="Jane Austen" required />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address</label>
            <input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" placeholder="jane@example.com" required />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <input id="reg-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" placeholder="••••••••" required />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-full btn-lg mt-4" style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-6" style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: 'var(--primary-container)', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
