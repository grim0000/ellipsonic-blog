"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, PlusCircle, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="glass sticky top-0 z-50 py-4">
      <div className="container flex justify-between items-center">
        <Link href="/" className="headline-md font-serif tracking-tight">
          Editorial<span className="text-primary">Lume</span>
        </Link>

        <div className="flex items-center gap-8 font-sans text-sm font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Essays</Link>
          <Link href="/archives" className="hover:text-primary transition-colors">Archives</Link>
          
          {session ? (
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="flex items-center gap-2 hover:text-primary transition-colors">
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <Link href="/posts/new" className="btn btn-primary px-5 py-2">
                <PlusCircle size={18} className="mr-2" />
                New Post
              </Link>
              <button 
                onClick={() => signOut()}
                className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link href="/auth/login" className="btn btn-primary px-6">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
