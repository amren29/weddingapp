"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
            <Heart className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">Nikah Invite</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-gray-600">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-5">
              Get Started
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
