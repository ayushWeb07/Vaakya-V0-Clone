import { z } from "zod";
import { createTRPCRouter } from "../init";
import { inngest } from "@/modules/inngest/client";
import { messagesRouter } from "@/modules/messages/procedures";
import { projectsRouter } from "@/modules/projects/procedures";
import { fragmentsRouter } from "@/modules/fragments/procedures";
import { usageRouter } from "@/modules/rate-limit/procedures";
export const appRouter = createTRPCRouter({
    messages: messagesRouter,
    projects: projectsRouter,
    fragments: fragmentsRouter,
    usage: usageRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
