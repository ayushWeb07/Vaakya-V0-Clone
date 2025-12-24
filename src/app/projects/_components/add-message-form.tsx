"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import TextareaAutosize from "react-textarea-autosize";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useTRPC } from "@/modules/trpc/client";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import styles from "./styles.module.css";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

interface Props {
  projectId: string;
}

const formSchema = z.object({
  text: z.string().min(1, { message: "Message is required" }).max(10000, {
    message: "Message is too long... Atmost, it should have 10000 characters",
  }),
});

const AddMessageForm = ({ projectId }: Props) => {
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

  const addMessageMutation = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: (data) => {
        // 1: reset the form
        form.reset();

        // 2: invalidate the messages
        queryClient.invalidateQueries(
          trpc.messages.getMany.queryOptions({ projectId })
        );
      },

      onError: (data) => {
        toast.error(data?.message || "Something went wrong!");
      },
    })
  );

  const isPending = addMessageMutation.isPending;
  const isBtnDisabled = isPending || !form.formState.isValid;

  // 3. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await addMessageMutation.mutateAsync({ text: values.text, projectId });
  };

  return (
    <Form {...form}>
      <form
        className="bg-card border-2 border-border rounded-lg p-3 flex flex-col gap-5 justify-center items-end"
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
                  placeholder="Ask Vaakya..."
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
  );
};

export default AddMessageForm;
