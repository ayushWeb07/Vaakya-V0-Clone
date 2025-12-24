"use client";

import { useTRPC } from "@/modules/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import MessageCard from "./message-card";
import AddMessageForm from "./add-message-form";
import styles from "./styles.module.css";

interface Props {
  projectId: string;
}

const MessagesContainer = ({ projectId }: Props) => {
  const trpc = useTRPC();

  // fetch the messages of this project
  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions({ projectId })
  );

  // create a simple ref for scrolling to the bottom of the messages
  const bottomMessagesScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomMessagesScrollRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <div className="w-full h-full pt-5 pb-10 px-5">
      {messages?.length === 0 ? (
        <div>
          <p>No messages to show</p>
        </div>
      ) : (
        <>
          <div className="text-center font-medium text-sm text-neutral-400 mb-5">
            Dec 21 at at 01:00 am
          </div>

          <div className="flex flex-col h-full">
            {/* Scrollable messages */}
            <div
              className={`flex-1 overflow-y-auto flex flex-col gap-12 p-4 ${styles.custom_scrollbar}`}
            >
              {messages?.map((message) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  isActiveFragment={false}
                  onFragmentClick={() => {}}
                />
              ))}

              <div ref={bottomMessagesScrollRef} ></div>
            </div>

            {/* Sticky input at bottom */}
            <div className="pb-4 relative">
              <div className="absolute h-10 -top-10 left-0 right-0 w-full bg-linear-to-b from-transparent to-black"></div>
              <AddMessageForm projectId={projectId} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MessagesContainer;
