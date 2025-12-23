"use client";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/modules/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import React from "react";

export const DummyClient = () => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.hello.queryOptions({ text: "Ayush" }));

  const invokeBGMutation = useMutation(trpc.invokeBG.mutationOptions({}));

  return (
    <div>
      <p>{data?.greeting}</p>

      <Button onClick={() => invokeBGMutation.mutate({prompt: "Create a simple red themed-hero section"})} disabled={invokeBGMutation.isPending} >{invokeBGMutation.isPending? "Invoking..." : "Invoke"}</Button>
    </div>
  );
};
