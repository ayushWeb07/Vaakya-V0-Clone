import Image from "next/image";
import { getQueryClient, trpc } from "@/modules/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { DummyClient } from "./dummy-client";

export default function Home() {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loading...</p>}>
        <DummyClient />
      </Suspense>
    </HydrationBoundary>
  );
}
