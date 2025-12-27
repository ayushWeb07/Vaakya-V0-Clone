"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import {
  Sparkles,
  ScanText,
  Brain,
  Lightbulb,
  Wand2,
  CheckCircle2,
  Loader,
} from "lucide-react";

type Step = {
  text: string;
  icon: React.ElementType;
};

const STEPS: Step[] = [
  { text: "Understanding your request", icon: ScanText },
  { text: "Breaking down the problem", icon: Brain },
  { text: "Analyzing relevant context", icon: Sparkles },
  { text: "Reasoning through solutions", icon: Lightbulb },
  { text: "Crafting a thoughtful response", icon: Wand2 },
  { text: "Refining the output", icon: Loader },
  { text: "Double-checking for accuracy", icon: CheckCircle2 },
];

export default function AIProcessingLoader() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const CurrentIcon = STEPS[index].icon;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % STEPS.length);
        setVisible(true);
      }, 200);
    }, randomDelay());

    return () => clearTimeout(timeout);
  }, [index]);

  return (
    <div className="w-full rounded-lg border-2 border-border bg-linear-to-br from-background to-muted px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        {/* Icon */}
        <div className="flex h-5 w-5 items-center justify-center">
          <CurrentIcon
            className={clsx(
              "h-4 w-4 transition-all duration-200",
              visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
            )}
          />
        </div>

        {/* Text */}
        <span
          className={clsx(
            "transition-all duration-200 ease-out",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
          )}
        >
          {STEPS[index].text}
        </span>
      </div>
    </div>
  );
}

/* ---------------- utils ---------------- */

function randomDelay() {
  return 1200 + Math.random() * 700;
}
