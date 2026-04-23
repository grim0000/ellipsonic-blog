"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogOut, PenLine, LayoutDashboard, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Link href="/" className="nav-brand">
          Ellip<span>sonic</span>
        </Link>

        <div className="nav-links">
          <Link href="/" className="nav-link">Essays</Link>
          <Link href="/archives" className="nav-link">Archives</Link>

          {session && role === "ADMIN" && (
            <Link href="/admin" className="nav-link nav-link--admin">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <ShieldCheck size={14} /> Admin
              </span>
            </Link>
          )}

          {session ? (
            <>
              <Link href="/dashboard" className="nav-link">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <LayoutDashboard size={14} /> Dashboard
                </span>
              </Link>
              <Link href="/posts/new" className="btn btn-primary btn-sm">
                <PenLine size={14} /> New Essay
              </Link>
              <button
                onClick={() => signOut()}
                className="btn-icon"
                title="Sign out"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link href="/auth/login" className="btn btn-primary btn-sm">
              Journal Access
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
