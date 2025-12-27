"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useTRPC } from "@/modules/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React, { RefObject, Suspense, useRef, useState } from "react";
import { maxSize } from "zod";
import MessagesContainer from "./messages-container";
import { Skeleton } from "@/components/ui/skeleton";
import { Fragment } from "@/generated/prisma/client";
import ProjectHeader from "./project-header";
import SandBoxView from "./sandbox-view";
import SandBoxLoading from "./sandbox-loading";
import { ImperativePanelHandle } from "react-resizable-panels";

interface Props {
  projectId: string;
}

const ProjectView = ({ projectId }: Props) => {
  // const trpc = useTRPC();

  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);

  const messagesPanelRef = useRef<ImperativePanelHandle>(null)

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        {/* messages here */}
        <ResizablePanel
          defaultSize={30}
          minSize={0}
          collapsedSize={0}
          className="flex flex-col justify-start items-start border-r-2 border-border"
          collapsible
          ref={messagesPanelRef}
        >
          {/* project header */}
          <Suspense
            fallback={
              <div className="p-5 flex items-center justify-center">
                <Skeleton className="h-8 w-50 rounded-lg" />
              </div>
            }
          >
            <ProjectHeader projectId={projectId} activeFragment={activeFragment} />
          </Suspense>

          {/* messages list */}
          <Suspense
            fallback={
              <div className="flex items-center pt-15 px-5 pl-25">
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            }
          >
            <MessagesContainer
              projectId={projectId}
              activeFragment={activeFragment}
              setActiveFragment={setActiveFragment}
            />
          </Suspense>
        </ResizablePanel>

        {/* <ResizableHandle withHandle /> */}

        {/* sandbox view here */}
        <ResizablePanel defaultSize={70} maxSize={100} >
          {activeFragment ? (
            <SandBoxView messagesPanelRef={messagesPanelRef as RefObject<ImperativePanelHandle>} activeFragment={activeFragment} />
          ) : (
            <SandBoxLoading />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ProjectView;
