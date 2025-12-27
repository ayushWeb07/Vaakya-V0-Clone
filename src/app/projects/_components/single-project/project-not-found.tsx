"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle, House } from "lucide-react";

const ProjectNotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-background px-6 text-center gap-8">

      {/* Heading */}
      <h1 className="text-5xl font-extrabold text-white tracking-tight">
        Project Not Found
      </h1>

      {/* Description */}
      <p className="text-gray-400 max-w-lg text-lg">
        Oops! We couldn’t find the project you’re looking for. It may have been
        removed or the link is broken.
      </p>

      {/* CTA */}
        <Button className="cursor-pointer" asChild>
          <Link href={"/projects"} className="gap-2!">
            <House size={25} /> Back to Dashboard
          </Link>
        </Button>

    </div>
  );
};

export { ProjectNotFound };
