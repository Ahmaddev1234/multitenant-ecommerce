'use client';
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Poppins } from "next/font/google"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { NavbarSidebar } from "./navbar-sidebar";
import { useState } from "react";
import { Menu } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
const poppins=Poppins({
    subsets:["latin"],
    weight:["700"]
})

interface NavbarItemProps{
    href:string,
    children:React.ReactNode,
    isActive?:boolean
}

const NavbarItem=({href,children,isActive}:NavbarItemProps)=>{
    return(
        <Button
        asChild
        variant="outline" className={cn("bg-transparent hover:bg-transparent rounded-full hover:bordor-primary bordor-transparent px-3.5 text-lg", isActive && "bg-black text-white hover:bg-black hover:text-white")}>
            <Link href={href}>
            {children}
            </Link>
        </Button>
    )
}

const navbarItems=[
    {href:"/",children:"Home"},
    {href:"/about",children:"About"},
    {href:"/features",children:"Features"},
    {href:"/pricing",children:"Pricing"},
    {href:"/contact",children:"Contact"},
]



export const Navbar=()=>{

    const trpc=useTRPC();
    const session=useQuery(trpc.auth.session.queryOptions());
    const pathname=usePathname();
    const [isSidebarOpen,setIsSidebarOpen]=useState(false)
    return(
        <nav className="h-20 flex border-b justify-between font-medium bg-white">
            <Link href="/" className="pl-6 flex items-center">
            <span className={cn("text-5xl font-semibold",poppins.className)}>
                funroad
            </span>
            </Link>
            <NavbarSidebar
            items={navbarItems}
            open={isSidebarOpen}
            onOpenChange={setIsSidebarOpen}
            />
            <div className="items-center gap-4 hidden lg:flex">
                {navbarItems.map((item)=>(
                    <NavbarItem key={item.href} href={item.href} isActive={pathname===item.href}>
                        {item.children}
                    </NavbarItem>
                ))}
            </div>
            {session.data?.user?(
                <div className="hidden lg:flex">
                    <Button
                asChild
                variant="secondary"
                className="border-l border-t-0 border-r-0 border-b-0 h-full rounded-none bg-black text-white hover:bg-pink-400 hover:text-black transition-colors text-lg">
                <Link href="/admin">
                    Dashboard
                </Link>
                </Button>
                </div>
            ):(
            <div className="hidden lg:flex">
                <Button
                asChild
                variant="secondary" className="border-l border-t-0 border-r-0 border-b-0 h-full rounded-none bg-white hover:bg-pink-400 transition-colors text-lg">
                    <Link prefetch href="/sign-in">
                    Log In
                    </Link>
                </Button>
                <Button
                asChild
                variant="secondary"
                className="border-l border-t-0 border-r-0 border-b-0 h-full rounded-none bg-black text-white hover:bg-pink-400 hover:text-black transition-colors text-lg">
                <Link prefetch href="/sign-up">
                    Start Selling
                </Link>
                </Button>
            </div>
            )}

            <div className="flex lg:hidden items-center justify-center">
                <Button variant="ghost" className="size-12 border-transparent bg-white" onClick={()=>(setIsSidebarOpen(true))}>
                    <Menu/>
                </Button>
            </div>
            
        </nav>
    )
}
