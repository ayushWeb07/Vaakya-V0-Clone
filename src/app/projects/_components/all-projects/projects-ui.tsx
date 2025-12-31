"use client";
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown, Ellipsis, Plus, SortAsc } from "lucide-react";
import Image from "next/image";
import ProjectsWrapper from "./projects-wrapper";
import { useTRPC } from "@/modules/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import Link from "next/link";

// for handling filters sort by
enum SortByFilters {
  LAST_EDITED,
  DATE_CREATED,
  ALPHABETICAL,
}

enum OrderByFilters {
  DESC,
  ASC,
}

const ProjectsUi = () => {
  // filters
  const [sortBy, setSortBy] = useState<SortByFilters>(
    SortByFilters.LAST_EDITED
  );

  const [order, setOrder] = useState<OrderByFilters>(OrderByFilters.DESC);

  // searching
  const [searchQuery, setSearchQuery] = useState<string>("");


  // get the projects data
  const trpc = useTRPC();

  const { data: projects } = useSuspenseQuery(
    trpc.projects.getMany.queryOptions()
  );

  // filter the projects based on the search query
  const filteredProjects = useMemo(() => {
    if (!projects) return projects;

    let resultOutput = [...projects];

    // search by query
    if (searchQuery.length !== 0) {
      resultOutput = resultOutput?.filter((proj) =>
        proj?.name?.toLowerCase()?.includes(searchQuery.toLowerCase())
      );
    }

    // ↕️ sort
    resultOutput.sort((a, b) => {
      let value = 0;

      if (sortBy === SortByFilters.LAST_EDITED) {
        value =
          new Date(a?.updatedAt).getTime() - new Date(b?.updatedAt).getTime();
      }

      if (sortBy === SortByFilters.DATE_CREATED) {
        value =
          new Date(a?.createdAt).getTime() - new Date(b?.createdAt).getTime();
      }

      if (sortBy === SortByFilters.ALPHABETICAL) {
        value = a?.name.localeCompare(b?.name);
      }

      return order === OrderByFilters.ASC ? value : -value;
    });

    return resultOutput;
  }, [projects, searchQuery, sortBy, order]);

  return (
    <>
      <div className="py-35 px-20 bg-background min-h-screen">
        {/* search + filters */}
        <div className="mb-10">
          <h1 className="text-neutral-300 text-xl font-medium mb-5">
            Projects
          </h1>

          <div className="flex justify-between items-center">
            {/* search */}
            <div className="">
              <Input
                className={`bg-popover border-2 border-border rounded-lg p-3 outline-none text-neutral-300 text-md font-medium focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0`}
                placeholder="Search for a project"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* filter and create new*/}
            <div className="flex justify-end items-center gap-5">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"}>
                    <span className="text-neutral-300 text-sm font-medium inline-flex gap-2 cursor-pointer justify-start items-center">
                      {sortBy === SortByFilters.LAST_EDITED
                        ? `Last edited`
                        : `${
                            sortBy === SortByFilters.DATE_CREATED
                              ? "Date created"
                              : "Alphabetical"
                          }`}
                      <ChevronDown />
                    </span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="min-w-52! bg-card border-2 border-border rounded-lg p-3 text-neutral-300 text-sm font-medium outline-0 flex flex-col gap-1"
                  align="start"
                >
                  {/* sort by text */}
                  <DropdownMenuGroup>
                    {/* sort by */}
                    <DropdownMenuItem disabled>
                      <p>Sort by </p>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  {/* sort by options */}
                  <DropdownMenuGroup>
                    {/* last edited  */}
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        setSortBy(SortByFilters.LAST_EDITED);
                      }}
                      className="cursor-pointer flex justify-between items-center"
                    >
                      <p>Last edited</p>
                      {sortBy === SortByFilters.LAST_EDITED && <Check />}
                    </DropdownMenuItem>

                    {/* date created */}
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        setSortBy(SortByFilters.DATE_CREATED);
                      }}
                      className="cursor-pointer flex justify-between items-center"
                    >
                      <p>Date created</p>
                      {sortBy === SortByFilters.DATE_CREATED && <Check />}
                    </DropdownMenuItem>

                    {/* alphabetical */}
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        setSortBy(SortByFilters.ALPHABETICAL);
                      }}
                      className="cursor-pointer flex justify-between items-center"
                    >
                      <p>Alphabetical</p>
                      {sortBy === SortByFilters.ALPHABETICAL && <Check />}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  {/* order text */}
                  <DropdownMenuGroup>
                    {/* order */}
                    <DropdownMenuItem disabled>
                      <p>Order</p>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  {/* order options -> last edited */}
                  <DropdownMenuGroup>
                    {/* newest first  */}
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        setOrder(OrderByFilters.DESC);
                      }}
                      className="cursor-pointer flex justify-between items-center"
                    >
                      <p>
                        {sortBy === SortByFilters.ALPHABETICAL
                          ? "Z - A"
                          : "Newest"}
                      </p>

                      {order === OrderByFilters.DESC && <Check />}
                    </DropdownMenuItem>

                    {/* oldest first */}
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        setOrder(OrderByFilters.ASC);
                      }}
                      className="cursor-pointer flex justify-between items-center"
                    >
                      {sortBy === SortByFilters.ALPHABETICAL
                        ? "A - Z"
                        : "Oldest"}
                      {order === OrderByFilters.ASC && <Check />}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button className="cursor-pointer" asChild>
                <Link href={"/"} className="gap-1!">
                  <Plus size={25} /> Create New
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {filteredProjects && filteredProjects?.length > 0 ? (
          // show the projects
          <ProjectsWrapper projects={filteredProjects} />
        ) : (
          <p className="text-neutral-500 text-base font-medium">
            No projects found!
          </p>
        )}
      </div>
    </>
  );
};

export default ProjectsUi;
