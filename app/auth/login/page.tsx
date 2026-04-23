"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="card-static animate-in" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
        <div className="text-center mb-8">
          <h1 className="headline-md" style={{ marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            Sign in to your editorial dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-error mb-6">{error}</div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-full btn-lg mt-4"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-6" style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" style={{ color: 'var(--primary-container)', fontWeight: 600 }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
