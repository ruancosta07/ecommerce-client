import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function categoriesMiddleware(req:NextRequest){
    const url = req.nextUrl
    if(url.searchParams.size < 1 || !url.searchParams.get("categoria")){
        return NextResponse.redirect(new URL("/", req.url),)
    }
}