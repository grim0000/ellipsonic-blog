"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogOut, PenSquare, LayoutDashboard, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  return (
    <nav className="navbar">
      <div className="container">
        <Link href="/" className="navbar-brand">
          Ellip<span>sonic</span>
        </Link>

        <div className="navbar-links">
          <Link href="/">Essays</Link>
          <Link href="/archives">Archives</Link>
          {role === "ADMIN" && (
            <Link href="/admin" style={{ color: 'var(--tertiary)', fontWeight: 600 }}>
              <span className="flex items-center gap-2">
                <ShieldCheck size={14} />
                Admin
              </span>
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          {session ? (
            <>
              <Link href="/dashboard" className="btn btn-ghost btn-sm">
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <Link href="/posts/new" className="btn btn-primary btn-sm">
                <PenSquare size={16} />
                New Essay
              </Link>
              <button
                onClick={() => signOut()}
                className="btn btn-ghost btn-sm"
                style={{ padding: '0.5rem' }}
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link href="/auth/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
