"use client";

import { useTRPC } from "@/modules/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import MessageCard from "./message-card";
import AddMessageForm from "./add-message-form";
import styles from "@/app/projects/_components/styles.module.css";
import { Fragment } from "@/generated/prisma/client";
import AIProcessingLoader from "./ai-processing-loader";

interface Props {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment: React.Dispatch<React.SetStateAction<Fragment | null>>;
}

const MessagesContainer = ({
  projectId,
  activeFragment,
  setActiveFragment,
}: Props) => {
  const trpc = useTRPC();

  // fetch the messages of this project
  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions({ projectId }, { refetchInterval: 3000 })
  );

  // create a simple ref for scrolling to the bottom of the messages
  const bottomMessagesScrollRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   // get the latest ai message and set its fragment (if present) as the active fragment
  //   const lastAiMessage = messages.findLast(
  //     (message) => message?.role === "ASSISTANT" && message?.fragment
  //   );

  //   setActiveFragment(lastAiMessage?.fragment as Fragment);
  // }, [messages]);

  // run when there's a change in the messages list
  useEffect(() => {
    // last message is by user means -> ai is generating the response currently
    if (messages[messages?.length - 1]?.role === "USER") {
      setActiveFragment(null);
    } else {
      // get the latest ai message and set its fragment (if present) as the active fragment
      const lastAiMessage = messages.findLast(
        (message) => message?.role === "ASSISTANT" && message?.fragment
      );
      
      setActiveFragment(lastAiMessage?.fragment as Fragment);
    }
    
    // scroll to the bottom of the messages
    bottomMessagesScrollRef.current?.scrollIntoView();
  }, [messages?.length]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden px-5">
      {messages?.length === 0 ? (
        <div>
          <p>No messages to show</p>
        </div>
      ) : (
        <>
          {/* show an bg overlay */}
          <div className="relative">
            {/* Dec 21 at at 01:00 am */}
            <div className="absolute h-10 top-0 left-0 right-0 w-full bg-linear-to-b from-black to-transparent pointer-events-none"></div>
          </div>

          <div className="flex flex-col h-full">
            {/* Scrollable messages */}
            <div
              className={`flex-1 overflow-y-auto flex flex-col gap-12 p-4 ${styles.custom_scrollbar}`}
            >
              {/* show the messages */}
              {messages?.map((message) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  isActiveFragment={
                    message?.fragment?.id === activeFragment?.id
                  }
                  setActiveFragment={setActiveFragment}
                />
              ))}

              {/* show loader when user sent a message but ai has not yet sent any message */}
              {messages[messages?.length - 1]?.role === "USER" && (
                <AIProcessingLoader />
              )}

              {/* simple div for controlling the scroll-behaviour */}
              <div ref={bottomMessagesScrollRef}></div>
            </div>

            {/* message input at bottom */}
            <div className="pb-4 relative">
              <div className="absolute h-10 -top-10 left-0 right-0 w-full bg-linear-to-b from-transparent to-black pointer-events-none"></div>
              <AddMessageForm
                projectId={projectId}
                setActiveFragment={setActiveFragment}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MessagesContainer;
