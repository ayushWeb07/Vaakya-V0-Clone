"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const CopyMessageIcon = ({ message }: { message: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500); // icon stays for 1.5s
  };

  return (
    <Tooltip>
      <TooltipTrigger
        className="cursor-pointer text-neutral-400 hover:text-primary transition-all duration-300"
        onClick={() => handleCopyToClipboard(message)}
      >
        {copied ? (
          <Check
            size={15}
            className="transition-all duration-200 animate-in zoom-in-75 fade-in-0"
          />
        ) : (
          <Copy size={15} />
        )}
      </TooltipTrigger>

      <TooltipContent className="bg-foreground px-3 py-1 rounded-lg text-xs font-medium">
        {copied ? "Copied!" : "Copy message"}
      </TooltipContent>
    </Tooltip>
  );
};
