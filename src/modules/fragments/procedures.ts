import z from "zod";
import { baseProcedure, createTRPCRouter } from "../trpc/init";
import { prisma } from "@/lib/db";
import { inngest } from "../inngest/client";
import { IS_MESSAGE_HELPFUL } from "@/generated/prisma/enums";

// trpc router for handling fragments
const fragmentsRouter = createTRPCRouter({
  // update the helpful state of the fragment
  updateState: baseProcedure
    .input(
      z.object({
        newIsHelpfulState: z.nativeEnum(IS_MESSAGE_HELPFUL),
        fragmentId: z.string().min(1, { message: "Fragment ID is required" }),
      })
    )
    .mutation(async ({ input }) => {
      // update the db
      await prisma.fragment.update({
        where: {
          id: input?.fragmentId,
        },
        data: {
          isHelpful: input?.newIsHelpfulState,
        },
      });
    }),
});

export { fragmentsRouter };
