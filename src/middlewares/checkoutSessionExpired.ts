import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function checkoutSessionExpired(req:NextRequest){
    const url = req.nextUrl
    if(url.searchParams.size < 1 || !url.searchParams.get("session_id")){
        return NextResponse.redirect(new URL("/", req.url))
    }
}