import { Heart } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Heart className="h-8 w-8 text-rose-500 fill-rose-500" />
            <span className="font-bold text-2xl">WeddingInvite</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
