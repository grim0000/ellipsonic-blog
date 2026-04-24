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

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
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
    <div className="container section flex justify-center">
      <div className="card-static animate-in" style={{ width: '100%', maxWidth: '420px', padding: '3rem 2.5rem' }}>
        <div className="text-center mb-8">
          <h1 className="headline-md mb-2">Welcome Back</h1>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>
            Sign in to your BloggerStop dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="alert-error" style={{ marginBottom: '1.5rem', fontSize: '0.8125rem' }}>{error}</div>}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
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
            className="btn btn-primary w-full"
            style={{ padding: '0.875rem', marginTop: '1rem' }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>
            New to the platform?{" "}
            <Link href="/auth/register" className="link" style={{ fontWeight: 600 }}>
              Join the community
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
