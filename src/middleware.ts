import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig)

export default auth(async function middleware() {
    return NextResponse.next();
})

export const config = {
    matcher: ["/((?!api/|_next/static|_next/image|favicon.ico).*)"],
}