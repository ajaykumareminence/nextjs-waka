import { NextResponse } from 'next/server'

export const config = {
    matcher: [
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
  }
export function middleware(request) {
    let token = request.cookies.get('token')?.value;
    
    if(!token && request.nextUrl.pathname.startsWith('/dashboard')){
        return NextResponse.redirect(new URL('/login', request.url))
    }
    if(token && request.nextUrl.pathname.startsWith('/login')){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if(token && request.nextUrl.pathname.startsWith('/signup')){
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
}