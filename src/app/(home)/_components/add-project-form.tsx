"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import TextareaAutosize from "react-textarea-autosize";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/modules/trpc/client";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import styles from "@/app/projects/_components/styles.module.css";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PROJECT_TEMPLATES } from "./constants";
import { useState } from "react";
import {
  DialogContent,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

const formSchema = z.object({
  text: z.string().min(1, { message: "Prompt is required" }).max(10000, {
    message: "Prompt is too long... Atmost, it should have 10000 characters",
  }),
});

// ts props interface
interface Props {
  isAuthenticated: boolean;
}

const AddProjectForm = ({ isAuthenticated }: Props) => {
  const [openAuthForm, setOpenAuthForm] = useState<boolean>(false);

  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  // 2. trpc and tanstack stuff
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createProjectMutation = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        // 1: reset the form
        form.reset();

        // 2: invalidate the messages
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions());

        // 3: navigate to that project
        router.push(`/projects/${data?.id}`);

        // 4: toast the success message
        toast.success("Successfully created the project");
      },

      onError: (data) => {
        toast.error(
          data?.message || "Something went wrong while creating the project!"
        );
      },
    })
  );

  const isPending = createProjectMutation.isPending;
  const isBtnDisabled = isPending || !form.formState.isValid;

  // 3. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // create the project only its authenticated user
    if (isAuthenticated) {
      await createProjectMutation.mutateAsync({ text: values.text });
    }

    // make the user authenticate
    else {
      setOpenAuthForm(true);
    }
  };

  // select the message prompt on a template click
  const selectMessagePromptOnTemplateClick = (text: string) => {
    form.setValue("text", text, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <>
      {/* show the form for the prompt input */}
      <Form {...form}>
        <form
          className="relative z-10 bg-card border-2 border-border rounded-lg p-3 flex flex-col gap-5 justify-center items-end w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <TextareaAutosize
                    {...field}
                    minRows={3}
                    maxRows={8}
                    className={`border-none outline-none text-neutral-300 text-md font-medium resize-none ${styles.custom_scrollbar}`}
                    placeholder="Ask Vaakya to build anything..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (!e.shiftKey && !isBtnDisabled) {
                          e.preventDefault();
                          form.handleSubmit(onSubmit)(e);
                        }
                      }
                    }}
                    disabled={isPending}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type={"submit"}
            size={"icon"}
            className={cn(
              "rounded-lg cursor-pointer"
              // "cursor-not-allowed"
            )}
            disabled={isBtnDisabled}
          >
            {isPending ? <Spinner /> : <ArrowUp size={25} />}
          </Button>
        </form>
      </Form>

      {/* show the tabs for the templates thing */}
      <div className="flex flex-wrap justify-center items-start gap-3 relative z-10 w-full">
        {PROJECT_TEMPLATES?.map((temp, idx) => (
          <Button
            key={idx}
            className="cursor-pointer"
            variant={"outline"}
            onClick={() => selectMessagePromptOnTemplateClick(temp?.prompt)}
          >
            {temp?.emoji} {temp?.title}
          </Button>
        ))}
      </div>

      {/* authentication dialog */}
      <Dialog open={openAuthForm} onOpenChange={setOpenAuthForm}>
        <form>
          <DialogContent
            className={`bg-popover p-9 border-2 border-border block! overflow-y-auto `}
          >
            {/* dialog header */}
            <DialogHeader>
              <DialogTitle className="text-neutral-300 text-lg font-medium text-center">
                Continue with Vaakya
              </DialogTitle>
              <DialogDescription className="text-neutral-500 text-md font-medium text-center">
                To use Vaakya, sign in to an existing account or create a new
                one.
              </DialogDescription>
            </DialogHeader>

            {/* dialog footer -> sign up, sign in */}
            <div className="flex flex-col gap-3 mt-5">
              <SignUpButton>
                <Button className="cursor-pointer w-full">Sign up</Button>
              </SignUpButton>

              <SignInButton>
                <Button className="cursor-pointer w-full" variant={"outline"}>
                  Sign in
                </Button>
              </SignInButton>
            </div>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
};

export { AddProjectForm };
