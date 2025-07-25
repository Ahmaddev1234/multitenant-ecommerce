import configPromise from '@payload-config'
import { getPayload } from 'payload'
import z from 'zod'
import { headers as getHeaders, cookies as getCookies } from 'next/headers';

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from '@trpc/server';



export const authRouter=createTRPCRouter({
    session:baseProcedure.query(async ({ctx})=>{


         const headers=await getHeaders()

         const session= await ctx.db.auth({headers});
         return session;
    }),
    register:baseProcedure
    .input(
        z.object({
            email:z.string().email(),
            password:z.string(),
            username: z
            .string()
            .min(3,"username must be atleast three characters")
            .max(63,"username must be less than 63 characters")
            .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/,"username can only contains lowercase letters,numbers and hyphens.It must start and end with a letter or number")
            .refine(
                (val)=>!val.includes("--"), "Username cannot contain consecutive hyphens"
            )
            .transform((val)=>val.toLowerCase())
            // [username].shop.com
        })
    )
    .mutation(async ({input,ctx})=>{
        await ctx.db.create({
            collection:"users",
            data:{
                email:input.email,
                username:input.username,
                password:input.password
            }
        })
    }),

    login:baseProcedure
    .input(
        z.object({
            email:z.string().email(),
            password:z.string(),
            // [username].shop.com
        })
    )
    .mutation(async ({input,ctx})=>{

        const data=await ctx.db.login({
            collection:"users",
            data:{
                email:input.email,
                password:input.password
            }
        })

        if(!data.token){
            throw new TRPCError({
                code:"UNAUTHORIZED",
                message:"Failed to login"
            })
        }

        const cookies=await getCookies();
        cookies.set({
            name:"AUTH_COOKIE",
            value:data.token,
            httpOnly:true,
            path:"/"
        });
        return data;
    })
})