import { NextResponse } from "next/server";
import type { NextRequest, MiddlewareConfig} from "next/server";
import signedMiddleware from "./middlewares/signed";
import checkoutSessionExpired from "./middlewares/checkoutSessionExpired";
import categoriesMiddleware from "./middlewares/categories";

export function middleware(request:NextRequest){
    if(request.nextUrl.pathname.startsWith("/usuario")){
        return signedMiddleware(request)
    }
    if(request.nextUrl.pathname.startsWith("/complete")){
        return checkoutSessionExpired(request)
    }
    if(request.nextUrl.pathname.startsWith("/categorias")){
        return categoriesMiddleware(request)
    }
    return NextResponse.next()
}

export const config:MiddlewareConfig =  {
    matcher: ["/usuario/carrinho", "/complete", "/categorias"],
}