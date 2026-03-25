import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-gray-50 py-8">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-1">
          Made with <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />{" "}
          by WeddingInvite
        </div>
        <p className="mt-2">&copy; {new Date().getFullYear()} WeddingInvite. All rights reserved.</p>
      </div>
    </footer>
  );
}
