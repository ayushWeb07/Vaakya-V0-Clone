"use client";

import { Spotlight } from "@/components/ui/spotlight-new";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t-2 border-t-border bg-background overflow-hidden px-20 py-7 relative">
      <Spotlight />

      <div className="flex items-center justify-between">
        {/* Brand */}
        <Link href={"/"}>
          <Image
            src={"logo.svg"}
            width={50}
            height={50}
            alt="Logo"
            className="hover:transform hover:rotate-45 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.08)]"
          />
        </Link>

        {/* Credit */}
        <p className="text-base text-muted-foreground">
          Coded by{" "}
          <a
            href="https://x.com/AyushBommana"
            target="_blank"
            className="font-medium text-foreground"
          >
            Ayush
          </a>
        </p>
      </div>
    </footer>
  );
}
