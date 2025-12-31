import { usageStatus } from "@/lib/rate-limit";
import { protectedProcedure, createTRPCRouter } from "../trpc/init";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

// trpc router for handling the rate limiting
const usageRouter = createTRPCRouter({
  // get the usage status
  getStatus: protectedProcedure.query(async () => {
    try {
      const result = await usageStatus();

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error?.message);
      } else {
        throw new Error("Something went wrong while getting the usage status");
      }
    }
  }),

  // check if the user has pro-plus plan
  hasProPlusPlan: protectedProcedure.query(async () => {
    const { has } = await auth();

    const hasProPlusPlan = has({ plan: "pro_plus_user" });

    return hasProPlusPlan;
  }),
});

export { usageRouter };
