import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export default async function signedMiddleware(req: NextRequest) {
    const userToken = req.cookies.get("authTokenUser")?.value
    if (!userToken) {
        return NextResponse.redirect(new URL("/login", req.url))
    }
    try {

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROD_URL}/auth/verify`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${userToken}`
            }
        })
        if(!response.ok){
            return NextResponse.redirect(new URL("/login", req.url))
        }
        return NextResponse.next()
    } catch (error) {
        console.log(error)
    }
}