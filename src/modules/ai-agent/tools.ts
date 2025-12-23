// define the tools here
import Sandbox from "@e2b/code-interpreter";
import { createTool } from "@inngest/agent-kit";
import z from "zod";

// 1: terminal
const terminalTool = (sandboxId: string) => {
  return createTool({
    name: "terminal",
    description: "Use terminal to run commands",
    parameters: z.object({
      command: z.string(),
    }),

    handler: async ({ command }, { step }) => {
      return await step?.run("terminal", async () => {
        // stores the command's output and error
        let buffers = {
          stdout: "", // command outputs
          stderr: "", // command errors
        };

        try {
          // connect to the sandbox
          const sbx = await Sandbox.connect(sandboxId);

          // run the commands
          const result = await sbx.commands.run(command, {
            onStdout(data: string) {
              buffers.stdout += data;
            },

            onStderr(data: string) {
              buffers.stderr += data;
            },
          });

          // return the output
          return result?.stdout;
        } catch (error) {
          return `Error while running the commands: ${error} \nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`;
        }
      });
    },
  });
};

// 2: create or update files
const createOrUpdateFiles = (sandboxId: string) => {
  return createTool({
    name: "createOrUpdateFiles",
    description: "Create or update files in the sandbox",
    parameters: z.object({
      files: z.array(
        z.object({
          path: z.string(),
          content: z.string(),
        })
      ),
    }),

    handler: async ({ files }, { step, network }) => {
      // run the step and store its output
      const modifiedFiles = await step?.run(
        "createOrUpdateFiles",
        async () => {
          const networkFiles = network?.state?.data?.files || {};

          try {
            // connect to the sandbox
            const sbx = await Sandbox.connect(sandboxId);

            for (const file of files) {
              await sbx.files.write(file.path, file.content); // create the file in the e2b sandbox
              networkFiles[file.path] = file.content; // create the file in the network's state
            }

            return networkFiles;
          } catch (error) {
            return `Error while creating or updating files: ${error}`;
          }
        }
      );

      // update the network state if the above step ran successfully and created the files
      if (typeof modifiedFiles === "object") {
        network.state.data.files = modifiedFiles;
      }
    },
  });
};

// 3: read files from the sandbox
const readFilesFromSandbox = (sandboxId: string) => {
  return createTool({
    name: "readFiles",
    description: "Read files from the sandbox",
    parameters: z.object({
      files: z.array(z.string()),
    }),

    handler: async ({ files }, { step }) => {
      return await step?.run("readFiles", async () => {
        try {
          // connect to the sandbox
          const sbx = await Sandbox.connect(sandboxId);

          let filesOutput = [];

          for (const filePath of files) {
            const fileContent = await sbx.files.read(filePath); // read the file content from the e2b sandbox

            filesOutput.push({
              path: filePath,
              content: fileContent,
            }); // create the file in the network's state
          }

          return JSON.stringify(filesOutput);
        } catch (error) {
          return `Error while reading the files: ${error}`;
        }
      });
    },
  });
};

export { terminalTool, createOrUpdateFiles, readFilesFromSandbox };
