import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext } from "@/modules/trpc/init";
import { appRouter } from '@/modules/trpc/routers/_app';
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });
export { handler as GET, handler as POST };