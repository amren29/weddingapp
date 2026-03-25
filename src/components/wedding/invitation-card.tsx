"use client";

import { ThemeConfig, Wedding } from "@/types";
import { format } from "date-fns";

interface InvitationCardProps {
  wedding: Wedding;
  theme: ThemeConfig;
}

export function InvitationCard({ wedding, theme }: InvitationCardProps) {
  const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(theme.fonts.heading)}:wght@400;700&family=${encodeURIComponent(theme.fonts.body)}:wght@300;400;500&display=swap`;

  const eventDate = new Date(wedding.eventDate);
  const day = format(eventDate, "d");
  const month = format(eventDate, "MMMM");
  const year = format(eventDate, "yyyy");
  const dayName = format(eventDate, "EEEE");
  const time = format(eventDate, "h:mm a");

  return (
    <>
      <link href={fontUrl} rel="stylesheet" />
      <div
        className="relative w-full px-6"
        style={{
          color: theme.colors.text,
          fontFamily: `'${theme.fonts.body}', sans-serif`,
        }}
      >
        {/* Bismillah */}
        <div className="text-center pt-10 pb-6">
          <p className="text-[10px] tracking-[0.25em] uppercase opacity-40" style={{ color: theme.colors.secondary }}>
            Bismillahirrahmanirrahim
          </p>
        </div>

        {/* Ornament */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-10" style={{ backgroundColor: theme.colors.accent + "30" }} />
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style={{ color: theme.colors.accent }}>
            <path d="M10 2L12 8L18 10L12 12L10 18L8 12L2 10L8 8L10 2Z" fill="currentColor" opacity="0.5" />
          </svg>
          <div className="h-px w-10" style={{ backgroundColor: theme.colors.accent + "30" }} />
        </div>

        {/* Families */}
        {(wedding.groomFamily || wedding.brideFamily) && (
          <div className="text-center mb-4 space-y-1">
            {wedding.groomFamily && (
              <p className="text-xs opacity-50 tracking-wide">{wedding.groomFamily}</p>
            )}
            {wedding.brideFamily && (
              <p className="text-xs opacity-50 tracking-wide">{wedding.brideFamily}</p>
            )}
          </div>
        )}

        <p className="text-center text-[10px] uppercase tracking-[0.3em] opacity-35 mb-6">
          Cordially invite you to the wedding of
        </p>

        {/* Couple names */}
        <div className="text-center mb-8">
          <h1
            className="text-5xl font-bold leading-tight"
            style={{ fontFamily: `'${theme.fonts.heading}', serif`, color: theme.colors.primary }}
          >
            {wedding.groomName}
          </h1>

          <div className="flex items-center justify-center gap-4 my-3">
            <div className="h-px w-12" style={{ backgroundColor: theme.colors.accent + "40" }} />
            <span className="text-xl" style={{ fontFamily: `'${theme.fonts.heading}', serif`, color: theme.colors.accent }}>
              &amp;
            </span>
            <div className="h-px w-12" style={{ backgroundColor: theme.colors.accent + "40" }} />
          </div>

          <h1
            className="text-5xl font-bold leading-tight"
            style={{ fontFamily: `'${theme.fonts.heading}', serif`, color: theme.colors.primary }}
          >
            {wedding.brideName}
          </h1>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-8" style={{ backgroundColor: theme.colors.accent + "20" }} />
          <svg width="10" height="10" viewBox="0 0 20 20" fill="none" style={{ color: theme.colors.accent }}>
            <path d="M10 2L12 8L18 10L12 12L10 18L8 12L2 10L8 8L10 2Z" fill="currentColor" opacity="0.3" />
          </svg>
          <div className="h-px w-8" style={{ backgroundColor: theme.colors.accent + "20" }} />
        </div>

        {/* Date */}
        <div className="text-center mb-8">
          <div
            className="inline-block border rounded-xl px-8 py-5"
            style={{ borderColor: theme.colors.accent + "25" }}
          >
            <p className="text-xs uppercase tracking-[0.2em] opacity-50 mb-1">{dayName}</p>
            <p className="text-xs uppercase tracking-[0.15em] opacity-50">{month}</p>
            <p
              className="text-6xl font-bold my-1"
              style={{ fontFamily: `'${theme.fonts.heading}', serif`, color: theme.colors.accent }}
            >
              {day}
            </p>
            <p className="text-xs uppercase tracking-[0.15em] opacity-50">{year}</p>
            <div className="h-px w-12 mx-auto my-3" style={{ backgroundColor: theme.colors.accent + "30" }} />
            <p className="text-sm font-medium opacity-70">{time}</p>
          </div>
        </div>

        {/* Venue */}
        <div className="text-center mb-8">
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-35 mb-3">Venue</p>
          <p
            className="text-lg font-semibold mb-1"
            style={{ fontFamily: `'${theme.fonts.heading}', serif` }}
          >
            {wedding.venue}
          </p>
          {wedding.venueAddress && (
            <p className="text-xs opacity-50 leading-relaxed max-w-[260px] mx-auto">
              {wedding.venueAddress}
            </p>
          )}
        </div>

        {/* Custom message */}
        {wedding.customMessage && (
          <div className="text-center mb-8 px-2">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8" style={{ backgroundColor: theme.colors.accent + "25" }} />
              <svg width="10" height="10" viewBox="0 0 20 20" fill="none" style={{ color: theme.colors.accent }}>
                <path d="M10 2L12 8L18 10L12 12L10 18L8 12L2 10L8 8L10 2Z" fill="currentColor" opacity="0.3" />
              </svg>
              <div className="h-px w-8" style={{ backgroundColor: theme.colors.accent + "25" }} />
            </div>
            <p className="text-xs italic opacity-60 leading-[1.8]">
              &ldquo;{wedding.customMessage}&rdquo;
            </p>
          </div>
        )}

        {/* Bottom ornament */}
        <div className="flex items-center justify-center gap-3 pb-6">
          <div className="h-px w-10" style={{ backgroundColor: theme.colors.accent + "30" }} />
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style={{ color: theme.colors.accent }}>
            <path d="M10 2L12 8L18 10L12 12L10 18L8 12L2 10L8 8L10 2Z" fill="currentColor" opacity="0.5" />
          </svg>
          <div className="h-px w-10" style={{ backgroundColor: theme.colors.accent + "30" }} />
        </div>
      </div>
    </>
  );
}
