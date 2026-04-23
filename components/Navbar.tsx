"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogOut, PlusCircle, LayoutDashboard, Feather } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="glass sticky top-0 z-50 py-5">
      <div className="container flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white transition-transform group-hover:rotate-12">
            <Feather size={20} />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            Editorial<span className="text-accent">Lume</span>
          </span>
        </Link>

        <div className="flex items-center gap-10 font-display text-[13px] font-bold uppercase tracking-widest">
          <div className="hidden md:flex items-center gap-10">
            <Link href="/" className="hover:text-accent transition-colors">Dispatches</Link>
            <Link href="/archives" className="hover:text-accent transition-colors">Archives</Link>
          </div>
          
          <div className="h-4 w-px bg-outline mx-2 hidden md:block"></div>
          
          {session ? (
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="flex items-center gap-2 hover:text-accent transition-colors">
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <Link href="/posts/new" className="btn btn-primary py-2 px-6 text-[10px]">
                <PlusCircle size={14} className="mr-2" />
                New Entry
              </Link>
              <button 
                onClick={() => signOut()}
                className="p-2 hover:bg-surface-low rounded-full transition-colors text-text-muted hover:text-red-500"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link href="/auth/login" className="btn btn-primary py-2 px-8 text-[11px]">
              Journal Access
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
