"use client";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Project } from "@/generated/prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/modules/trpc/client";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";

// design the ts props interface
interface Props {
  changeProjectNameDialogOpen: boolean;
  setChangeProjectNameDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  project: Project | null;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// schema for the name changing
const formSchema = z.object({
  name: z
    .string()
    .min(5, { message: "Project name must have atleast 5 characters" })
    .max(100, { message: "Project name must have atmost 100 characters" }),
});

const ChangeProjectNameForAllProjectsPage = ({
  changeProjectNameDialogOpen,
  setChangeProjectNameDialogOpen,
  project,
  setOpen,
}: Props) => {
  // define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  // trpc stuff
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // handle project name change
  const changeProjectNameMutation = useMutation(
    trpc.projects.changeProjectName.mutationOptions({
      onSuccess: () => {
        // 1: invalidate queries
        queryClient.invalidateQueries(
          trpc.projects.getMany.queryOptions()
        );

        // 2: show toast
        toast.success("Successfully renamed the project");

        // 3: close all the dialogs
        setOpen(false);
        setChangeProjectNameDialogOpen(false);
      },

      onError: () => {
        toast.error("Something went wrong while renaming the project!");
      },
    })
  );

  const isPending = changeProjectNameMutation.isPending;
  const isBtnDisabled = isPending || !form.formState.isValid;

  // define a submit handler.
  const handleProjectNameChange = async (
    values: z.infer<typeof formSchema>
  ) => {
    await changeProjectNameMutation.mutateAsync({
      name: values?.name,
      id: project?.id as string,
    });
  };

  return (
    <Dialog
      open={changeProjectNameDialogOpen}
      onOpenChange={setChangeProjectNameDialogOpen}
    >
      <Form {...form}>
        <DialogContent
          className={`max-w-2/5! bg-popover py-7 px-9 border-2 border-border flex! justify-center items-center`}
        >
          <form className="w-full" onSubmit={form.handleSubmit(handleProjectNameChange)}>
            {/* dialog header */}
            <DialogHeader className="gap-1!">
              <DialogTitle className="text-neutral-300 text-lg font-medium">
                Rename project
              </DialogTitle>
              <DialogDescription className="text-neutral-500 text-md font-medium">
                Update how this project appears in your workspace.
              </DialogDescription>
            </DialogHeader>

            {/* dialog overview */}
            <div className="mt-7 flex flex-col gap-5 justify-start items-start">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        className="border-none outline-none text-neutral-300 text-md font-medium resize-none"
                        placeholder="Change project name"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            if (!e.shiftKey && !isBtnDisabled) {
                              e.preventDefault();
                              form.handleSubmit(handleProjectNameChange)(e);
                            }
                          }
                        }}
                        disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <p className="text-neutral-300 text-sm font-medium">
                Supports spaces and special characters, up to 100 characters.
              </p>

              <DialogFooter className="flex justify-end items-center w-full!">
                <DialogClose asChild>
                  <Button
                    className="text-neutral-200! cursor-pointer"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </DialogClose>

                <Button
                  type={"submit"}
                  className="cursor-pointer"
                  disabled={isBtnDisabled}
                >
                  {isPending ? `Saving...` : "Save"}
                </Button>
              </DialogFooter>
            </div>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  );
};

export default ChangeProjectNameForAllProjectsPage;
