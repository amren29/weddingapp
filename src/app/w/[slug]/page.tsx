export const dynamic = "force-dynamic";

import { InvitationCard } from "@/components/wedding/invitation-card";
import { CountdownTimer } from "@/components/wedding/countdown-timer";
import { AutoScroll } from "@/components/wedding/auto-scroll";
import { builtInThemes } from "@/config/themes";
import Link from "next/link";
import { Heart, MessageSquare, ImageIcon, Gift, QrCode, Send } from "lucide-react";
import type { Metadata } from "next";
import type { ThemeConfig, Wedding } from "@/types";

async function getWedding(slug: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const res = await fetch(
    `${url}/rest/v1/Wedding?slug=eq.${encodeURIComponent(slug)}&select=*`,
    {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      cache: "no-store",
    }
  );

  const data = await res.json();
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const wedding = await getWedding(slug);
  if (!wedding) return { title: "Wedding Not Found" };

  return {
    title: `${wedding.groomName} & ${wedding.brideName} - Wedding Invitation`,
    description: wedding.customMessage || `You are invited to the wedding of ${wedding.groomName} and ${wedding.brideName}`,
  };
}

export default async function PublicWeddingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const wedding = await getWedding(slug);

  if (!wedding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Wedding Not Found</h1>
          <p className="text-muted-foreground">This invitation may have expired or doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  const theme: ThemeConfig = wedding.themeConfig || builtInThemes.find((t: ThemeConfig) => t.id === wedding.themeId) || builtInThemes[0];
  const weddingData = wedding as unknown as Wedding;

  const navItems = [
    { href: `/w/${slug}/rsvp`, label: "RSVP", icon: Send },
    { href: `/w/${slug}/messages`, label: "Wishes", icon: MessageSquare },
    { href: `/w/${slug}/gallery`, label: "Gallery", icon: ImageIcon },
    { href: `/w/${slug}/gifts`, label: "Gifts", icon: Gift },
    { href: `/w/${slug}/payment`, label: "Gift", icon: QrCode },
  ];

  return (
    <div className="min-h-screen flex justify-center bg-neutral-100">
      <div
        className="w-full max-w-[430px] relative"
        style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}
      >
        <AutoScroll>
        {/* Invitation Card */}
        <InvitationCard wedding={weddingData} theme={theme} />

        {/* Countdown */}
        {new Date(wedding.eventDate) > new Date() && (
          <div className="px-6 pb-8">
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: theme.colors.primary + "06" }}
            >
              <p className="text-center text-[10px] uppercase tracking-[0.3em] opacity-35 mb-4">
                Counting down
              </p>
              <CountdownTimer targetDate={new Date(wedding.eventDate)} accentColor={theme.colors.accent} />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="px-6 pb-8">
          <div className="grid grid-cols-5 gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all active:scale-95"
                  style={{ backgroundColor: theme.colors.accent + "08" }}
                >
                  <item.icon className="h-4 w-4" style={{ color: theme.colors.accent }} />
                  <span className="text-[9px] font-medium opacity-60">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="py-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-8" style={{ backgroundColor: theme.colors.accent + "20" }} />
            <svg width="10" height="10" viewBox="0 0 20 20" fill="none" style={{ color: theme.colors.accent }}>
              <path d="M10 2L12 8L18 10L12 12L10 18L8 12L2 10L8 8L10 2Z" fill="currentColor" opacity="0.3" />
            </svg>
            <div className="h-px w-8" style={{ backgroundColor: theme.colors.accent + "20" }} />
          </div>
          <p className="text-[10px] opacity-30">
            Powered by Nikah Invite
          </p>
        </footer>
        </AutoScroll>
      </div>
    </div>
  );
}
