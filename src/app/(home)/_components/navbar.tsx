"use client";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { KayakIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { dark } from "@clerk/themes";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  // handle the scrolling behaviour
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pathname = usePathname();
  return (
    <div
      className={`w-full fixed top-0 left-0 flex justify-between items-center px-20 py-7 z-5 transition-all duration-300 border-b-2 ${
        scrolled
          ? "bg-card border-b-border!"
          : "bg-linear-to-b from-background/75 to-transparent border-b-transparent"
      }`}
    >
      {/* logo */}
      <Link href={"/"}>
        <KayakIcon size={35} className="text-white" />
      </Link>

      {/* menu items */}
      <SignedIn>
        <div className="flex items-center justify-center gap-8">
          <Link
            href={"/"}
            className={`text-neutral-500 text-base font-medium hover:text-white transition-all duration-200 ${
              pathname === "/" && "text-white!"
            }`}
          >
            Home
          </Link>

          <Link
            className={`text-neutral-500 text-base font-medium hover:text-white transition-all duration-200 ${
              pathname === "/projects" && "text-white!"
            }`}
            href={"/projects"}
          >
            Projects
          </Link>

          <Link
            className={`text-neutral-500 text-base font-medium hover:text-white transition-all duration-200 ${
              pathname === "/pricing" && "text-white!"
            }`}
            href={"/pricing"}
          >
            Pricing
          </Link>
        </div>
      </SignedIn>

      {/* sign in and sign up buttons */}
      <div className="">
        <SignedOut>
          <div className="flex justify-end items-center gap-5">
            <SignInButton>
              <Button className="cursor-pointer" variant={"outline"}>
                Sign in
              </Button>
            </SignInButton>

            <SignUpButton>
              <Button className="cursor-pointer">Sign up</Button>
            </SignUpButton>
          </div>
        </SignedOut>

        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "size-10!",
              },
              theme: dark,
            }}
          />
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;
