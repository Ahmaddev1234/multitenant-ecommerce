import { Sheet,SheetContent,SheetHeader,SheetTitle } from "@/components/ui/sheet" 

import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"

interface navbarItem{
    href:string,
    children:React.ReactNode
}


interface Props{
    items:navbarItem[],
    open:boolean,
    onOpenChange:(open:boolean)=>void
}

export const NavbarSidebar=({items,open,onOpenChange}:Props)=>(
    <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="p-0 transition-none">
            <SheetHeader className="p-4 border-b">
                
                    <SheetTitle className="">
                        Menu
                    </SheetTitle>
                
            </SheetHeader>
            <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
                {items.map((item)=>(
                    <Link key={item.href} href={item.href} className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium" onClick={()=>{onOpenChange(false)}}>
                        {item.children}
                    </Link>
                ))}
                <div className="border-t">
                    <Link href="/sign-in" className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium">
                        Log in
                    </Link>
                    <Link href="/sign-up" className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium">
                        Start Selling
                    </Link>
                </div>
            </ScrollArea>
        </SheetContent>
    </Sheet>
)