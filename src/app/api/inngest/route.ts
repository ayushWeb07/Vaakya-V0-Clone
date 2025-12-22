import { serve } from "inngest/next";
import { inngest } from "@/modules/inngest/client";
import { helloWorld } from "@/modules/inngest/functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
    helloWorld
  ],
});