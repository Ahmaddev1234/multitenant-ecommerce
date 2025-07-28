
import { cookies as getCookies } from "next/headers";


interface props{
    prefix:string,
    value:string
}
export const generateAuthCookie=async ({prefix,value}:props)=>{
const cookies=await getCookies();
cookies.set({
    name:`${prefix}-token`,
    value:value,
    httpOnly:true,
    path:"/"
});
}