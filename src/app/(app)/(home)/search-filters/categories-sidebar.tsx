import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet,SheetHeader,SheetTitle,SheetContent } from "@/components/ui/sheet";
import { CategoriesGetManyOutput } from "@/modules/categories/types";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronsRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface props{
    open:boolean,
    onOpenChange:(open:boolean) =>void;
    
}




export const CategoriesSidebar=({open,onOpenChange}:props)=>{

    const trpc=useTRPC();
    const {data}=useQuery(trpc.categories.getMany.queryOptions())

    const router=useRouter();

    const [parentCategories,setParentCategories]=useState<CategoriesGetManyOutput | null>(null)
    const [selectedCategory,setSelectedCategory]=useState<CategoriesGetManyOutput[1] | null>(null)

    const currentCategories=parentCategories ?? data ?? [];

    const handleOpenChange=(open:boolean)=>{
            setSelectedCategory(null);
            setParentCategories(null);
            onOpenChange(open)
    }


    // if we have parent categories show those otherwise show root categories

    const handleCategoryClick=(category:CategoriesGetManyOutput[1])=>{
        if(category.subcategories && category.subcategories.length >0 ){
            setParentCategories(category.subcategories as CategoriesGetManyOutput)
            setSelectedCategory(category)
        
    }else{
            // If this is a leaf category not subcategory
            if(parentCategories && selectedCategory){
                router.push(`/${selectedCategory.slug}/${category.slug}`)
            }else{
                if(category.slug === "all"){
                    router.push('/')
                }else{
                    router.push(`/${category.slug}`)
                }

                handleOpenChange(false)
            }
    }
}


    const handleBackClick=()=>{
        if(parentCategories){
            setParentCategories(null);
            setSelectedCategory(null);
        }
    }

    const backgroundColor=selectedCategory?.color || "white"

    return(
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetContent side="left" className="p-0 transition-none" style={{backgroundColor}}>
                <SheetHeader className="p-4 border-b">
                    <SheetTitle>
                        Categories
                    </SheetTitle>

                </SheetHeader>
                <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
                    {parentCategories &&
                    <button  className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium" onClick={handleBackClick}>
                        <ChevronLeft className="s-4 mr-2"/>
                        Back
                        </button>}

                        {currentCategories.map((category)=>(


                            <button key={category.slug} className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center text-base font-medium" onClick={()=>{handleCategoryClick(category)}}>
                                {category.name}
                                {category.subcategories && category.subcategories.length > 0 &&(
                                    <ChevronsRightIcon className="size-4"/>
                                )}
                            </button>
                        ))}

                </ScrollArea>

            </SheetContent>

        </Sheet>
    )
}