"use client";

import { cn } from "@/lib/utils";
import { useRef, useEffect, useState } from "react";

interface MarqueeProps {
  className?: string;
  children?: React.ReactNode;
  vertical?: boolean;
}

export default function Marquee({
  className,
  children,
  vertical = false,
}: MarqueeProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (scrollerRef.current) {
      observer.observe(scrollerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={scrollerRef}
      className={cn(
        "relative overflow-hidden",
        vertical ? "h-full" : "w-full",
        className
      )}
    >
      <div
        className={cn(
          "flex",
          vertical ? "flex-col" : "flex-row",
          "gap-4",
          "animate-scroll"
        )}
        style={{
          animationDuration: "60s",
          animationPlayState: isVisible ? "running" : "paused",
        }}
      >
        {children}
        {children} {/* Duplicate for seamless loop */}
      </div>
    </div>
  );
} 