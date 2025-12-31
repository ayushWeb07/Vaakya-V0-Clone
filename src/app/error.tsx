"use client";

import { ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Spotlight } from "@/components/ui/spotlight-new";

export default function ErrorPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-6 py-40 overflow-hidden">
      <Spotlight />

      <div className="w-md rounded-2xl border border-border bg-card/70 p-8 shadow-2xl backdrop-blur">
        {/* icon / accent */}
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ArrowRight className="h-6 w-6" />
        </div>

        {/* heading */}
        <h1 className="mb-2 text-2xl font-semibold tracking-tight">
          This page isn’t available
        </h1>

        <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
          The page you’re trying to access doesn’t exist or is temporarily
          unavailable.
        </p>

        {/* CTAs */}
        <div className="flex gap-3">
          <Button
            asChild
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition hover:bg-primary/90"
          >
            <Link href={"/projects"}>
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <Button
            variant={"outline"}
            asChild
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            <Link href={"/"}>
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
        </div>

        {/* subtle footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          You’re safe — nothing’s broken.
        </p>
      </div>
    </div>
  );
}
