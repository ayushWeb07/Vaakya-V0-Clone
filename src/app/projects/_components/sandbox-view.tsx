"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Fragment } from "@/generated/prisma/client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import {
  Code,
  ExternalLink,
  Eye,
  PanelRightClose,
  PanelRightOpen,
  RefreshCcw,
} from "lucide-react";
import React, { useState, useRef } from "react";
import { ImperativePanelHandle } from "react-resizable-panels";

import ProjectCodeBlock from "./code-block/project-code-block";
import { toast } from "sonner";

// design the ts interface
interface Props {
  messagesPanelRef: React.RefObject<ImperativePanelHandle>;
  activeFragment: Fragment | null;
}

const SandBoxView = ({ messagesPanelRef, activeFragment }: Props) => {
  const [frameKey, setFrameKey] = useState<number>(0);
  const [currentTab, setCurrentTab] = useState<"preview" | "code">("preview");

  // copy sandbox url
  const copySandboxUrl = async () => {

    await navigator.clipboard.writeText(activeFragment?.sandboxUrl as string);

    toast.success("Copied the sandbox url")
  };

  // open sandbox url in new tab
  const openSandboxUrlInNewTab = () => {
    window.open(activeFragment?.sandboxUrl, "_blank", "noopener,noreferrer");
  };

  // refresh the iframe
  const refreshWebPreview = () => {
    setFrameKey(frameKey + 1);
  };

  // toggle the messages pannel
  const toggleMessagesPannel = () => {
    const panel = messagesPanelRef.current;
    if (!panel) return;

    panel.isCollapsed() ? panel.expand() : panel.collapse();
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* show other options for interaction with the web preview */}
      <div className="w-full h-[7vh] bg-popover py-3 px-9 border-b-2 border-border shrink-0 flex justify-between items-center gap-8">
        {/* icons -> sidebar */}
        <Button
          className={"text-neutral-800! hover:text-neutral-800!"}
          asChild
          variant={"outline"}
        >
          <Tooltip>
            <TooltipTrigger
              onClick={toggleMessagesPannel}
              className="cursor-pointer text-neutral-400 transition-all duration-300"
            >
              <PanelRightClose size={15} />
            </TooltipTrigger>

            <TooltipContent
              className="bg-foreground px-3 py-1 rounded-lg transition-all duration-300 animate-in fade-in-0 zoom-in-95
                            data-[state=closed]:animate-out
                            data-[state=closed]:fade-out-0
                            data-[state=closed]:zoom-out-95
                            data-[side=top]:slide-in-from-bottom-1 z-50"
            >
              <p className="text-neutral-800 hover:text-neutral-800! font-medium text-xs">
                Toggle sidebar
              </p>
            </TooltipContent>
          </Tooltip>
        </Button>

        {/* tabs -> code, preview */}
        <Button
          asChild
          variant="outline"
          className="border-border bg-card p-0! rounded-md"
        >
          <div className="flex items-center">
            {/* Code tab */}
            <Tooltip>
              <TooltipTrigger
                onClick={() => setCurrentTab("code")}
                className={`
                flex items-center justify-center px-3 py-2 rounded-md
                transition-all duration-300
                cursor-pointer
                ${
                  currentTab === "code"
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:bg-muted/60"
                }
              `}
              >
                <Code size={15} />
              </TooltipTrigger>

              <TooltipContent className="bg-foreground px-3 py-1 rounded-md">
                <p className="text-background text-xs font-medium">Code</p>
              </TooltipContent>
            </Tooltip>

            {/* Preview tab */}
            <Tooltip>
              <TooltipTrigger
                onClick={() => setCurrentTab("preview")}
                className={`
                flex items-center justify-center px-3 py-2 rounded-md
                transition-all duration-300
                cursor-pointer

                ${
                  currentTab === "preview"
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:bg-muted/60"
                }
              `}
              >
                <Eye size={15} />
              </TooltipTrigger>

              <TooltipContent className="bg-foreground px-3 py-1 rounded-md">
                <p className="text-background text-xs font-medium">Preview</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </Button>

        {/* url */}
        <div className="flex-1">
          <Tooltip>
            <TooltipTrigger
              onClick={copySandboxUrl}
              asChild
              className="cursor-pointer text-neutral-400 transition-all duration-300"
            >
              {/* <PanelRightOpen size={15} /> */}
              <Button
                variant={"outline"}
                className="w-full border-2 border-border rounded-lg p-3 text-neutral-300 text-sm font-medium outline-0"
              >
                {activeFragment?.sandboxUrl}
              </Button>
            </TooltipTrigger>

            <TooltipContent
              className="bg-foreground px-3 py-1 rounded-lg transition-all duration-300 animate-in fade-in-0 zoom-in-95
                            data-[state=closed]:animate-out
                            data-[state=closed]:fade-out-0
                            data-[state=closed]:zoom-out-95
                            data-[side=top]:slide-in-from-bottom-1 z-50"
            >
              <p className="text-neutral-800 hover:text-neutral-800! font-medium text-xs">
                Click to copy url
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* icons -> refresh, external open */}
        <Button
          className={"text-neutral-800! hover:text-neutral-800!"}
          asChild
          variant={"outline"}
        >
          <div className="flex justify-center items-center gap-5">
            {/* refresh */}
            <Tooltip>
              <TooltipTrigger
                onClick={refreshWebPreview}
                className="cursor-pointer text-neutral-400 transition-all duration-300"
              >
                <RefreshCcw size={15} />
              </TooltipTrigger>

              <TooltipContent
                className="bg-foreground px-3 py-1 rounded-lg transition-all duration-300 animate-in fade-in-0 zoom-in-95
                            data-[state=closed]:animate-out
                            data-[state=closed]:fade-out-0
                            data-[state=closed]:zoom-out-95
                            data-[side=top]:slide-in-from-bottom-1 z-50"
              >
                <p className="text-neutral-800 hover:text-neutral-800! font-medium text-xs">
                  Refresh
                </p>
              </TooltipContent>
            </Tooltip>

            {/* external open */}
            <Tooltip>
              <TooltipTrigger
                onClick={openSandboxUrlInNewTab}
                className="cursor-pointer text-neutral-400 transition-all duration-300"
              >
                <ExternalLink size={15} />
              </TooltipTrigger>

              <TooltipContent
                className="bg-foreground px-3 py-1 rounded-lg transition-all duration-300 animate-in fade-in-0 zoom-in-95
                            data-[state=closed]:animate-out
                            data-[state=closed]:fade-out-0
                            data-[state=closed]:zoom-out-95
                            data-[side=top]:slide-in-from-bottom-1 z-50"
              >
                <p className="text-neutral-800 hover:text-neutral-800! font-medium text-xs">
                  Open in new tab
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </Button>
      </div>

      {/* preview -> iframe to show the web preview */}
      {currentTab === "preview" && (
        <div className="w-full h-full flex flex-col bg-background">
          <iframe
            key={frameKey}
            src={activeFragment?.sandboxUrl}
            className="w-full h-full"
            loading={"lazy"}
            sandbox="allow-scripts allow-forms allow-same-origin"
            title="Fragment preview"
            aria-label="Fragment preview"
          />
        </div>
      )}

      {/* code -> show the code */}
      {currentTab === "code" && (
        <ProjectCodeBlock
          sandboxFiles={activeFragment?.sandboxFiles as Record<string, string>}
        />
      )}
    </div>
  );
};

export default SandBoxView;
