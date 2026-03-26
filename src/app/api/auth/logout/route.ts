import { apiRequest } from "@/libs/apiClient";
import { LogoutUserResponse } from "@/types/Auth/Responses";
import { ServerSideResponse } from "@/types/Global";
import { AxiosResponse } from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles GET requests to log out the current authenticated user.
 *
 * This endpoint invalidates the user's session by calling the backend logout endpoint
 * and deleting the authentication cookie.
 *
 * @param req - The incoming Next.js request object.
 * @returns A JSON response confirming the logout operation.
 *
 * @remarks
 * **Request:** No request body required. Authentication is handled via cookies.
 *
 * **Success Response (200):**
 * ```json
 * {
 *   "status": 200,
 *   "message": "Usuário deslogado com sucesso.",
 *   "data": undefined
 * }
 * ```
 *
 * **Error Responses:**
 * - 403: User is not authenticated
 * - 500: Server error during logout
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
    const cookie = await cookies();
    const token = cookie.get("CompetitionAuthToken")?.value;

    if(token == null) {
        return NextResponse.json(
            {
                status: 403,
                message: "Você não está autenticado.",
            } satisfies ServerSideResponse<LogoutUserResponse>,
            {
                status: 403,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }

    let res: AxiosResponse<LogoutUserResponse> | null = null;

    try {
        res = await apiRequest<LogoutUserResponse>("/Auth/logout", {
            method: "GET",
            cookies: req.cookies.toString()
        });
    }
    catch(exc) {
        console.error(exc);
        console.error(res?.data);

        return NextResponse.json(
            {
                ...res?.data,
                message: "Erro ao deslogar usuário.",
                error: "Erro desconhecido.",
                status: 500
            } satisfies ServerSideResponse<LogoutUserResponse>,
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }

    cookie.delete({
        name: "CompetitionAuthToken",
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
    });

    return NextResponse.json(
        {
            message: "Usuário deslogado com sucesso.",
            data: undefined,
            status: 200,
        } satisfies ServerSideResponse<LogoutUserResponse>,
        {
            headers: {
                "Content-Type": "application/json",
            },
            status: 200,
        }
    );
    
}