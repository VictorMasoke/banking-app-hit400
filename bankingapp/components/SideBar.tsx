'use client'

import Link from "next/link"
import Image from "next/image"
import React from 'react'
import { sidebarLinks, sidebarLinksAdmin } from "@/constants"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import Footer from "./Footer"
import PlaidLink from "./PlaidLink"

const SideBar = ({user}: SiderbarProps) => {
  const pathname = usePathname();

  // Use sidebarLinksAdmin if the user's role is "admin"
  const links = user.role === "admin" ? sidebarLinksAdmin : sidebarLinks;

  return (
    <section className='sidebar'>
        <nav className='flex flex-col gap-4'>
            <Link href="/" className="mb-12 cursor-pointer items-center flex gap-2">
                <Image
                    src="/icons/money-mail-svgrepo-com.svg"
                    width={50}
                    height={50}
                    alt="Banking Application"
                    className="size-[24px] max-xl:size-14"
                />
                <h1 className="sidebar-logo">Bazell Banking</h1>
            </Link>

            

            {links.map((item) => {
                const isActive = 
                pathname === item.route || pathname.startsWith(`${item.route}/`)

                return (
                    <Link href={item.route} key={item.label} className={cn ('sidebar-link', {'bg-bank-gradient': isActive })}>
                        

                        <div className="relative size-6">
                            <Image
                                src={item.imgURL}
                                alt={item.label}
                                fill
                                className={cn({'brightness-[3] invert-0': isActive})}
                            />
                        </div>

                        <p className={cn ('sidebar-label', {'!text-white': isActive })}>
                            {item.label}
                        </p>
                    </Link>
                )
            })}
            
            {user.role !== "admin" && <PlaidLink user={user} />}
        </nav>

        <Footer user={user}/>
    </section>
  )
}

export default SideBar
