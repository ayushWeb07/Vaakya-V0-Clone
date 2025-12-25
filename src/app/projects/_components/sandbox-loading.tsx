import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Loader2 } from "lucide-react";
import React from "react";

const SandBoxLoading = () => {
  return (
   <div className="w-full h-full flex items-center justify-center bg-background">
      <div className="w-full max-w-3xl px-6">
        <div className="rounded-xl border bg-card shadow-sm p-6 space-y-6">

          {/* Header */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>

          {/* Fake iframe preview */}
          <div className="relative overflow-hidden rounded-lg border bg-muted">
            <Skeleton className="h-80 w-full" />
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          </div>

          {/* Status */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Starting sandbox environment…</span>
          </div>

          {/* Subtle reassurance */}
          <p className="text-xs text-muted-foreground/70">
            This may take a moment depending on network & sandbox availability.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SandBoxLoading;
