import { apiRequest } from "@/libs/apiClient";
import { LoginUserRequest } from "@/types/Auth/Requests";
import { LoginUserResponse } from "@/types/Auth/Responses";
import { ServerSideResponse } from "@/types/Global";
import { AxiosResponse } from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles POST requests to authenticate a user and establish a session.
 *
 * This endpoint authenticates users with their credentials (RA and password),
 * generates an authentication token, and sets it as an httpOnly cookie.
 *
 * @param req - The incoming Next.js request object.
 * @returns A JSON response containing the authentication result and user data.
 *
 * @remarks
 * **Request Body (LoginUserRequest):**
 * ```json
 * {
 *   "ra": "string",      // User's academic registration number
 *   "password": "string" // User's password
 * }
 * ```
 *
 * **Success Response (200):**
 * ```json
 * {
 *   "status": 200,
 *   "message": "Usuário autenticado com sucesso.",
 *   "data": {
 *     "token": "string",
 *     "user": { ...user details... }
 *   }
 * }
 * ```
 *
 * **Error Responses:**
 * - 403: User is already authenticated
 * - 401: Invalid credentials
 * - 500: Server error during authentication
 */
export async function POST(req: NextRequest) {
    const cookie = await cookies();
    const token = cookie.get("CompetitionAuthToken")?.value || null;

    if(token != null) {
        return NextResponse.json(
            {
                status: 403,
                message: "Você já está autenticado.",
            } satisfies ServerSideResponse<LoginUserResponse>,
            {
                status: 403,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }

    const body = await req.json() as LoginUserRequest;

    let res: AxiosResponse<LoginUserResponse> | null = null;

    try {
        res = await apiRequest<LoginUserResponse, LoginUserRequest>("/Auth/Login", {
            method: "POST",
            data: body,
        });

        const data = res.data;

        cookie.set({
            name: "CompetitionAuthToken",
            value: data.token,
            httpOnly: true,
            expires: new Date(new Date().getTime() + (24 * 60 * 60 * 1000)),
            secure: true,
            sameSite: "lax",
        });

        return NextResponse.json(
            {
                message: "Usuário autenticado com sucesso.",
                data,
                status: res.status
            } satisfies ServerSideResponse<LoginUserResponse>,
            {
                headers: {
                    "Content-Type": "application/json"
                },
                status: res.status
            }
        );
    }
    catch(exc) {
        console.error("Login error:", exc);

        const statusCode = res?.status || 500;

        return NextResponse.json(
            {
                ...res?.data,
                message: res?.data ? "Erro de autenticação" : "Erro ao autenticar usuário.",
                error: "Erro no login.",
                status: statusCode
            } satisfies ServerSideResponse<LoginUserResponse>,
            {
                status: statusCode,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
    
}