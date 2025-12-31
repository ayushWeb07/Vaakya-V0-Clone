import z from "zod";
import { protectedProcedure, createTRPCRouter } from "../trpc/init";
import { prisma } from "@/lib/db";
import { inngest } from "../inngest/client";
import { consumePoints } from "@/lib/rate-limit";
import { TRPCError } from "@trpc/server";

// trpc router for handling messages
const messagesRouter = createTRPCRouter({
  // get all the messages of a specfic project
  getMany: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: "Project ID is required" }),
      })
    )
    .query(async ({ input, ctx }) => {
      // get the messages
      const messages = await prisma.message.findMany({
        where: {
          projectId: input?.projectId,
          userId: ctx.auth.userId,
        },
        orderBy: {
          updatedAt: "asc",
        },
        include: {
          fragment: true,
        },
      });

      return messages;
    }),

  // create message
  create: protectedProcedure
    .input(
      z.object({
        text: z.string().min(1, { message: "Message is required" }).max(10000, {
          message:
            "Message is too long... Atmost, it should have 10000 characters",
        }),

        projectId: z.string().min(1, { message: "Project ID is required" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // 1: consume the credits
      try {
        await consumePoints();
      } catch (error) {
        if (error instanceof Error) {
          // something went wrong
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error?.message || "Something went wrong",
          });
        } else {
          // credits exhausted
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "You've ran out of free credits. Please upgrade!",
          });
        }
      }

      // 2: create message in db
      const createdMessage = await prisma.message.create({
        data: {
          content: input?.text,
          role: "USER",
          type: "RESULT",
          projectId: input?.projectId,
          userId: ctx.auth.userId,
        },
      });

      // 3: start the inngest event
      await inngest.send({
        name: "ai-agent/invoke",
        data: {
          prompt: input?.text,
          projectId: input?.projectId,
          userId: ctx.auth.userId,
        },
      });

      return createdMessage;
    }),
});

export { messagesRouter };
