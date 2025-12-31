import { Button } from "@/components/ui/button";
import { formatDuration, intervalToDuration } from "date-fns";
import {  Sparkles } from "lucide-react";
import Link from "next/link";

// design the ts inferface for props
interface Props {
  points: number;
  msBeforeNext: number;
  hasProPlusPlan: boolean;
}

const TrackUsage = ({ points, msBeforeNext, hasProPlusPlan }: Props) => {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background/60 px-4 py-3 backdrop-blur mb-2">
      {/* Left content */}
      <div className="flex items-center gap-3">
        <div className="relative flex h-9 w-9 items-center justify-center">
          {/* Glow */}
          <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md" />

          {/* Icon container */}
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-sm">
            ⚡
          </div>
        </div>

        <div className="flex flex-col">
          <p className="text-sm font-medium text-foreground">
            {points} credits remaining
          </p>
          <p className="text-xs text-muted-foreground">
            Resets in{" "}
            {formatDuration(
              intervalToDuration({
                start: new Date(),
                end: new Date(Date.now() + msBeforeNext),
              }),
              { format: ["days", "hours", "minutes"] }
            )}
          </p>
        </div>
      </div>

      {/* CTA */}
      {!hasProPlusPlan && (
        <Button size={"sm"} className="cursor-pointer" asChild>
          <Link href={"/pricing"} className="gap-1!">
            <Sparkles size={20} /> Upgrade
          </Link>
        </Button>
      )}
    </div>
  );
};

export default TrackUsage;
