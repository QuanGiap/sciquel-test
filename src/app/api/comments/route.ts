import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { commentGetSchema,commentPostSchema } from "./schema";

export async function GET(req: NextRequest){
    const prisma = new PrismaClient();
    const searchParams = req.nextUrl.searchParams;
    let query:{[key:string]:Number} = {};
    searchParams.forEach((value,key)=>{
        query[key]=Number(value);
    })
    const {page=0,limit=50} = commentGetSchema.parse(query);
    const comments = await prisma.comment.findMany({take:limit,skip:limit*page,orderBy:{
        createdAt:"desc"
    }});
    return NextResponse.json({ test: "success", comments}, { status: 200 })
}

export async function POST(req: NextRequest){
    const body = await req.json();
    const {comment,email,name} = commentPostSchema.parse(body);
    const prisma = new PrismaClient();
    //find user
    let user = await prisma.user.findFirst({
        where:{
            email,
        },
    })
    // if user not exist create one
    if(!user) user = await prisma.user.create({
        data:{
            email,
            name,
        }
    })
    const new_comment = await prisma.comment.create({
        data:{
            userId:user.id,
            content:comment,
        }
    })
    return NextResponse.json({ test: "success", }, { status: 200 })
}