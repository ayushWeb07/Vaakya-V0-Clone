import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { inngest } from "@/modules/inngest/client";
export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      return {
        greeting: `Namaste ${opts.input.text} paaji`,
      };
    }),

  invokeBG: baseProcedure
    .input(
      z.object({
        prompt: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await inngest.send({
        name: "test/hello.world",
        data: {
          prompt: input?.prompt,
        },
      });
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
