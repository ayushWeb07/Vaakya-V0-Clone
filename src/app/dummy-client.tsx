"use client";
import { useTRPC } from "@/modules/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";

export const DummyClient = () => {
  const trpc = useTRPC();

  const {data} = useSuspenseQuery(trpc.hello.queryOptions({ text: "Ayush" }));

  return <div>{data?.greeting}</div>;
};
