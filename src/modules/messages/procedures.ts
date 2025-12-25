import z from "zod";
import { baseProcedure, createTRPCRouter } from "../trpc/init";
import { prisma } from "@/lib/db";
import { inngest } from "../inngest/client";

// trpc router for handling messages
const messagesRouter = createTRPCRouter({

  // get all the messages of a specfic project
  getMany: baseProcedure
  .input(
    z.object({
        projectId: z.string().min(1, { message: "Project ID is required" }),

    })
  )
  .query(async ({input}) => {

    // get the messages
    const messages = await prisma.message.findMany({
      where: {
        projectId: input?.projectId
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
  create: baseProcedure
    .input(
      z.object({
        text: z.string().min(1, { message: "Message is required" }).max(10000, {
          message:
            "Message is too long... Atmost, it should have 10000 characters",
        }),

        projectId: z.string().min(1, { message: "Project ID is required" }),
      })
    )
    .mutation(async ({ input }) => {
      // 1: create message in db
      const createdMessage = await prisma.message.create({
        data: {
          content: input?.text,
          role: "USER",
          type: "RESULT",
          projectId: input?.projectId,
        },
      });

      // 2: start the inngest event
      await inngest.send({
        name: "ai-agent/invoke",
        data: {
          prompt: input?.text,
          projectId: input?.projectId,
        },
      });

      return createdMessage;
    }),
});

export { messagesRouter };
