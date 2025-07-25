"use client"

import { CategoryDropdown } from "./category-dropdown"
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ListFilterIcon } from "lucide-react";
import { CategoriesSidebar } from "./categories-sidebar";
import { CategoriesGetManyOutput } from "@/modules/categories/types";

interface CategoriesProps{
    data:CategoriesGetManyOutput;
}

export const Categories=({data}:CategoriesProps)=>{

    const containerRef=useRef<HTMLDivElement>(null)
    const measureRef=useRef<HTMLDivElement>(null)
    const viewAllRef=useRef<HTMLDivElement>(null)

    const [visibleCount,setVisiblecount]=useState(data.length)
    const [isAnyHovered,setisAnyHovered]=useState(false);
    const [isSidebarOpen,setIsSidebarOpen]=useState(false);

    const activeCategory="all";

    const activeCategoryIndex = data.findIndex((cat)=>cat.slug === activeCategory);
    const isActiveCategoryHidden = activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1

    

    useEffect(()=>{

        const calculateVisible=()=>{
            if(!containerRef.current || !measureRef.current || !viewAllRef.current) return ;
            const containerWidth = containerRef.current.offsetWidth;
            const viewAllWidth = viewAllRef.current.offsetWidth;
            const availableWidth = containerWidth-viewAllWidth;

            const items=Array.from(measureRef.current.children)

            let totalWidth=0;
            let visible=0;

            for(const item of items){
                const width=item.getBoundingClientRect().width;
                if(totalWidth + width > availableWidth) break;
                totalWidth += width;

                visible++
            }

            setVisiblecount(visible);
        }

        const resizeObserver=new ResizeObserver(calculateVisible)
        resizeObserver.observe(containerRef.current!)
        return () => resizeObserver.disconnect();

    },[data.length]);

    return(
        <div className="relative w-full">
            <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />

            {/* Hidden dev to measur All items */}

            <div ref={measureRef} className="absolute opacity-0 pointer-events-none flex" style={{position:"fixed", top:"-9999", left:"-9999"}}>
                {data.map((category)=>(
                    <div key={category.id}>
                        <CategoryDropdown category={category} isActive={activeCategory === category.slug} isNavigationHovered={true}/>
                        
                    </div>
                ))}
            </div>

                {/* Visible items */}
            <div className="flex flex-nowrap items-center" ref={containerRef} onMouseEnter={()=>{setisAnyHovered(true)}} onMouseLeave={()=>{setisAnyHovered(true)}}>
                {data.slice(0,visibleCount).map((category)=>(
                    <div key={category.id}>
                        <CategoryDropdown category={category} isActive={activeCategory === category.slug} isNavigationHovered={isAnyHovered}/>
                        
                    </div>
                ))}

                <div ref={viewAllRef} className="shrink-0">
                    <Button className={cn("h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",isActiveCategoryHidden && !isAnyHovered && "bg-white border-primary")} onClick={()=>{setIsSidebarOpen(true)}}>
                        view All 
                        <ListFilterIcon className="ml-2"/>
                    </Button>

                </div>
            </div>
        </div>
    )
}