"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: Date;
  accentColor?: string;
}

export function CountdownTimer({ targetDate, accentColor = "#D4AF37" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      mins: Math.floor((diff / (1000 * 60)) % 60),
      secs: Math.floor((diff / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  });

  return (
    <div className="flex justify-center gap-3">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center flex-1 max-w-[70px]">
          <p
            className="text-2xl font-bold tabular-nums"
            style={{ color: accentColor }}
          >
            {String(value).padStart(2, "0")}
          </p>
          <p className="text-[9px] uppercase tracking-[0.15em] opacity-50 mt-0.5">
            {unit}
          </p>
        </div>
      ))}
    </div>
  );
}
