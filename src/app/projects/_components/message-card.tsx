"use client";
import { Button } from "@/components/ui/button";
import { Fragment, Project } from "@/generated/prisma/client";
import {
  IS_MESSAGE_HELPFUL,
  MessageRole,
  MessageType,
} from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Code,
  Ellipsis,
  Lightbulb,
  MoveUpRight,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { prisma } from "@/lib/db";
import { useTRPC } from "@/modules/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CopyMessageIcon } from "./copy-message-icon";

interface Props {
  id: string;
  content: string;
  role: MessageRole;
  type: MessageType;

  fragment: Fragment | null;

  projectId: String;

  createdAt: Date;
  updatedAt: Date;
}

const MessageCard = ({
  message,
  isActiveFragment,
  setActiveFragment,
}: {
  message: Props;
  isActiveFragment: boolean;
  setActiveFragment: React.Dispatch<React.SetStateAction<Fragment | null>>;
}) => {
  // get the trpc stuff
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // mark fragment as helpful
  const updateMessageHelpfulStateMutation = useMutation(
    trpc.fragments.updateState.mutationOptions({
      onSuccess: () => {
        // 1: invalidate the messages
        queryClient.invalidateQueries(
          trpc.messages.getMany.queryOptions({
            projectId: message?.projectId as string,
          })
        );

        // 2: show toast
        toast.success("Thanks for your feedback");
      },

      onError: () => {
        toast.error("Something went wrong while updating the message status!");
      },
    })
  );

  const handleHelpfulStateToggle = async (state: IS_MESSAGE_HELPFUL) => {
    await updateMessageHelpfulStateMutation.mutateAsync({
      newIsHelpfulState: state,
      fragmentId: message?.fragment?.id as string,
    });
  };

  return (
    <>
      {message?.role === "USER" ? (
        // user message
        <div className="pl-20 flex flex-col justify-center items-end gap-5">
          <div className="bg-card border-2 border-border rounded-lg p-3 text-neutral-300 text-md font-medium">
            {message?.content}
          </div>

          <CopyMessageIcon message={message?.content} />
        </div>
      ) : (
        // ai message
        <div className="flex flex-col justify-center items-start gap-5">
          {/* show these only if message type is result, else show error message */}
          {message?.type === "RESULT" ? (
            <>
              {/* show how much time worked for */}
              {message?.fragment && (
                /* show how much time it took */
                <div className="flex items-center justify-start gap-2">
                  <Lightbulb size={20} className="text-neutral-500" />
                  <p className="text-neutral-500 text-sm">
                    Thought for {message?.fragment?.workedFor}
                  </p>
                </div>
              )}

              {/* message content */}
              <div className="text-neutral-300 text-md font-medium tracking-wide leading-6">
                {message?.content}
              </div>

              {/* show the fragment */}
              {message?.fragment && (
                <>
                  <div className="pr-25">
                    <button
                      onClick={() =>
                        setActiveFragment(message?.fragment as Fragment)
                      }
                      className={cn(
                        "border-2 border-border rounded-lg bg-popover p-3 text-neutral-300 text-md font-medium flex justify-start items-start gap-3 hover:bg-secondary transition-all duration-300 cursor-pointer",
                        isActiveFragment &&
                          "bg-neutral-300 text-destructive-foreground hover:bg-neutral-300"
                      )}
                    >
                      <Code size={15} strokeWidth={2} />

                      <div className="flex flex-col justify-start items-start gap-2">
                        <p
                          className={cn(
                            "text-neutral-300 text-sm font-bold flex justify-between items-center gap-3",
                            isActiveFragment && "text-neutral-800"
                          )}
                        >
                          {message?.fragment?.title}

                          <ChevronRight size={15} strokeWidth={2} />
                        </p>
                        <span
                          className={cn(
                            "text-neutral-400 text-sm font-medium",
                            isActiveFragment && "text-neutral-800"
                          )}
                        >
                          {isActiveFragment ? "Previewing" : "Preview"} this
                          version
                        </span>
                      </div>
                    </button>
                  </div>
                </>
              )}

              {/* show the icons */}
              <div className="flex justify-start items-center gap-5">
                {message?.fragment && (
                  <>
                    {/* helpful icon */}
                    <Tooltip>
                      <TooltipTrigger
                        onClick={() => handleHelpfulStateToggle("HELPFUL")}
                        className="cursor-pointer text-neutral-400 hover:text-primary transition-all duration-300"
                      >
                        <ThumbsUp
                          size={15}
                          fill={`${
                            message?.fragment?.isHelpful === "HELPFUL" &&
                            "white"
                          }`}
                        />
                      </TooltipTrigger>

                      <TooltipContent
                        className="bg-foreground px-3 py-1 rounded-lg transition-all duration-300 animate-in fade-in-0 zoom-in-95
                data-[state=closed]:animate-out
                data-[state=closed]:fade-out-0
                data-[state=closed]:zoom-out-95
                data-[side=top]:slide-in-from-bottom-1 z-50"
                      >
                        <p className="text-neutral-800 font-medium text-xs">
                          Helpful
                        </p>
                      </TooltipContent>
                    </Tooltip>

                    {/* not helpful icon */}
                    <Tooltip>
                      <TooltipTrigger
                        onClick={() => handleHelpfulStateToggle("NOT_HELPFUL")}
                        className="cursor-pointer text-neutral-400 hover:text-primary transition-all duration-300"
                      >
                        <ThumbsDown
                          size={15}
                          fill={`${
                            message?.fragment?.isHelpful === "NOT_HELPFUL" &&
                            "white"
                          }`}
                        />
                      </TooltipTrigger>

                      <TooltipContent
                        className="bg-foreground px-3 py-1 rounded-lg transition-all duration-300 animate-in fade-in-0 zoom-in-95
                data-[state=closed]:animate-out
                data-[state=closed]:fade-out-0
                data-[state=closed]:zoom-out-95
                data-[side=top]:slide-in-from-bottom-1 z-50"
                      >
                        <p className="text-neutral-800 font-medium text-xs">
                          Not helpful
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </>
                )}

                <CopyMessageIcon message={message?.content} />

                {message?.fragment && (
                  // fragment related more info
                  <Popover>
                    <PopoverTrigger className=" cursor-pointer text-neutral-400 hover:text-primary transition-all duration-300">
                      <Ellipsis size={20} />
                    </PopoverTrigger>

                    <PopoverContent className="bg-card border-2 border-border rounded-lg p-3 text-neutral-300 text-sm font-medium outline-0 flex flex-col gap-3">
                      <div className="border-2 border-border rounded-lg bg-popover py-1 px-3 flex justify-between items-center gap-3 hover:bg-secondary transition-all duration-300 cursor-pointer text-neutral-300">
                        <p className="text-neutral-300 text-md font-medium">
                          Preview
                        </p>
                        <MoveUpRight size={20} strokeWidth={2.5} />
                      </div>

                      <div className="flex justify-between items-center text-neutral-300 text-md font-medium">
                        <p>Worked for</p>
                        <span>{message?.fragment?.workedFor}</span>
                      </div>

                      <div className="flex justify-between items-center text-neutral-300 text-md font-medium">
                        <p>Credits used</p>
                        <span>{message?.fragment?.creditsSpent}</span>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="text-red-400 text-md font-medium tracking-wide">
                {message?.content}
              </div>

              <CopyMessageIcon message={message?.content} />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default MessageCard;
