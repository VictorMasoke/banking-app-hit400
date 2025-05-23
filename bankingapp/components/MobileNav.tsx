'use client'

import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarLinks, sidebarLinksAdmin } from "@/constants";
import { cn } from "@/lib/utils";
import Footer from "./Footer";

const MobileNav = ({ user }: MobileNavProps) => {
  const pathname = usePathname();
  // Use sidebarLinksAdmin if the user's role is "admin"
  const links = user.role === "admin" ? sidebarLinksAdmin : sidebarLinks;
  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <Image
            src="/icons/hamburger.svg"
            width={30}
            height={30}
            alt="menu"
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-non bg-white">
          <Link
            href="/"
            className="cursor-pointer items-center flex gap-1 px-4"
          >
            <Image
              src="/icons/money-mail-svgrepo-com.svg"
              width={50}
              height={50}
              alt="Banking Application"
            />
            <h1 className="text-26 font-bold text-black-1">Basel Banking</h1>
          </Link>

          <div className="mobilenav-sheet">
            <SheetClose asChild>
              <nav className="flex h-full flex-col gap-6 pt-16 text-white">
                {links.map((item) => {
                  const isActive =
                    pathname === item.route ||
                    pathname.startsWith(`${item.route}/`);

                  return (
                    <SheetClose asChild key={item.route}>
                      <Link
                        href={item.route}
                        key={item.label}
                        className={cn("mobilenav-sheet_close w-full", {
                          "bg-bank-gradient": isActive,
                        })}
                      >
                          <Image
                            src={item.imgURL}
                            alt={item.label}
                            width={20}
                            height={20}
                            className={cn({
                              "brightness-[3] invert-0": isActive,
                            })}
                          />

                        <p
                          className={cn("text-16 font-semibold text-black-2", {
                            "text-white": isActive,
                          })}
                        >
                          {item.label}
                        </p>
                      </Link>
                    </SheetClose>
                  );
                })}

                USER
              </nav>
            </SheetClose>

            <Footer user={user} type="mobile"/>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
