import { NextResponse, NextRequest } from "next/server";
import AuthService from "./services/AuthService";
import { UserTokenProperties, UserTokenPropertiesClaims } from "./types/Auth";
import { RoleClaimKey } from "./constants/Auth";

const protectedRoutes = [
    { path: "/admin", roles: ["Admin"] },
    { path: "/Competition/Archive", roles: ["Admin", "Teacher"] },
    { path: "/Competition", roles: ["Admin", "Teacher", "Student"] },
    { path: "/Profile", roles: ["Admin", "Teacher", "Student"] },
];

/**
 * Decodes and parses a JWT token to extract user properties.
 * @param token - The JWT token string.
 * @returns The parsed user token properties.
 */
const parseJwt = (token: string): UserTokenProperties => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const str = Buffer.from(base64, "base64").toString("utf-8");
    const parsedToken = JSON.parse(str) as UserTokenPropertiesClaims;

    return {
        unique_name: parsedToken.unique_name,
        id: parsedToken.id,
        role: parsedToken[RoleClaimKey],
        jti: parsedToken.jti,
        exp: parsedToken.exp,
        iss: parsedToken.iss,
        aud: parsedToken.aud,
    };
};

/**
 * Middleware to protect routes based on authentication and user roles.
 * Redirects users to login, logout, or profile pages depending on their authentication status and role.
 * @param request - The incoming Next.js request object.
 * @returns A NextResponse object for redirection or continuation.
 */
export const middleware = async (request: NextRequest) => {
    const { pathname } = request.nextUrl;
    const isAuthRoute = ["register", "login"].some((path) =>
        pathname.includes(path)
    );

    const token = request.cookies.get("CompetitionAuthToken")?.value;

    // If on auth route and has valid token, redirect to Profile
    if (isAuthRoute && token) {
        try {
            const jwtPayload = parseJwt(token);
            const isTokenValid = await AuthService.validateTokenSSR(token);

            if (isTokenValid) {
                return NextResponse.redirect(new URL("/Profile", request.url));
            }
        } catch {
            // Invalid token, allow access to login/register
            return NextResponse.next();
        }
    }

    // Allow access to auth routes without token
    if (isAuthRoute) {
        return NextResponse.next();
    }

    const route = protectedRoutes.find((r) => pathname.startsWith(r.path));

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        const jwtPayload = parseJwt(token);

        // Reuse validation from auth route check
        const isTokenValid = await AuthService.validateTokenSSR(token);

        console.log("Role: ", jwtPayload.role);
        console.log("Route: ", route);

        if (!route?.roles?.includes(jwtPayload.role) || !isTokenValid) {
            return NextResponse.redirect(new URL("/logout", request.url));
        }

        return NextResponse.next();
    } catch {
        console.error("JWT verification failed, trying to refresh token...");
        // TODO: Implement token refresh logic here

        return NextResponse.redirect(new URL("/logout", request.url));
    }
};

export const config = {
    matcher: [
        "/admin/:path*",
        "/Competition/:path*",
        "/profile/:path*",
        "/register",
        "/login",
    ],
};
