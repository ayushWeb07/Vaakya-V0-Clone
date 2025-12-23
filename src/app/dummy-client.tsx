"use client";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/modules/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import React, { useState } from "react";

export const DummyClient = () => {

  const [message, setMessage] = useState<string>("")

  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.messages.getMany.queryOptions());

  const invokeBGMutation = useMutation(trpc.projects.create.mutationOptions({}));

  return (
    <div>
      <p>{JSON.stringify(data)}</p>

      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter message" />

      <Button onClick={() => invokeBGMutation.mutate({text: message})} disabled={invokeBGMutation.isPending} >{invokeBGMutation.isPending? "Invoking..." : "Invoke"}</Button>
    </div>
  );
};
