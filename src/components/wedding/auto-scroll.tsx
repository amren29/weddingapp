"use client";

import { useEffect, useRef, useState } from "react";

export function AutoScroll({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const animationRef = useRef<number | null>(null);

  const startAutoScroll = () => {
    setShowOverlay(false);
    setIsAutoScrolling(true);

    const container = containerRef.current;
    if (!container) return;

    const scrollHeight = container.scrollHeight - container.clientHeight;
    const duration = scrollHeight * 25; // 25ms per pixel = very slow scroll
    const startTime = performance.now();
    const startScroll = container.scrollTop;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease in-out for smooth feel
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      container.scrollTop = startScroll + scrollHeight * eased;

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAutoScrolling(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  // Stop auto-scroll on user interaction
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const stopScroll = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
        setIsAutoScrolling(false);
      }
    };

    container.addEventListener("touchstart", stopScroll, { passive: true });
    container.addEventListener("wheel", stopScroll, { passive: true });

    return () => {
      container.removeEventListener("touchstart", stopScroll);
      container.removeEventListener("wheel", stopScroll);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="relative h-screen">
      <div
        ref={containerRef}
        className="h-full overflow-y-auto scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {children}
      </div>

      {/* Open invitation overlay */}
      {showOverlay && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="text-center animate-fade-in">
            <p className="text-white/60 text-xs uppercase tracking-[0.3em] mb-6">
              You are invited
            </p>
            <button
              onClick={startAutoScroll}
              className="group relative inline-flex items-center justify-center"
            >
              <span className="absolute inset-0 rounded-full border border-white/20 animate-ping" />
              <span className="relative rounded-full border border-white/40 px-8 py-3 text-white text-sm font-medium tracking-wide hover:bg-white/10 transition-colors">
                Open Invitation
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
