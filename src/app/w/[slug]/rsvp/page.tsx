import { createClient } from "@supabase/supabase-js";
import { RsvpForm } from "@/components/wedding/rsvp-form";
import { builtInThemes } from "@/config/themes";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function RsvpPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: wedding } = await supabase
    .from("Wedding")
    .select("id, themeId, themeConfig")
    .eq("slug", slug)
    .single();

  if (!wedding) {
    return <div className="text-center py-12">Wedding not found</div>;
  }

  const theme = wedding.themeConfig || builtInThemes.find((t) => t.id === wedding.themeId) || builtInThemes[0];

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: theme.colors.background }}>
      <div className="max-w-md mx-auto">
        <Link href={`/w/${slug}`} className="inline-flex items-center gap-1 text-sm mb-6 opacity-70 hover:opacity-100">
          <ArrowLeft className="h-4 w-4" />
          Back to invitation
        </Link>
        <RsvpForm weddingId={wedding.id} accentColor={theme.colors.accent} />
      </div>
    </div>
  );
}
