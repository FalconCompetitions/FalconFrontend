import { apiRequest } from "@/libs/apiClient";
import { ServerSideResponse } from "@/types/Global";
import { GetCurrentTokenResponse, UpdateCurrentTokenResponse } from "@/types/Token/Responses";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles GET requests to retrieve the current authentication token information.
 *
 * This endpoint returns details about the currently active authentication token.
 *
 * @param req - The incoming Next.js request object.
 * @returns A JSON response containing the current token data.
 *
 * @remarks
 * **Request:** No parameters required. Authentication via cookies.
 *
 * **Success Response (200):**
 * ```json
 * {
 *   "status": 200,
 *   "data": {
 *     "token": "string",
 *     "expiresAt": "ISO date string",
 *     "issuedAt": "ISO date string",
 *     ...token details...
 *   }
 * }
 * ```
 *
 * **Error Response (500):**
 * - Server error when fetching token
 */
export async function GET(req: NextRequest) {
    let res;
    try {
        res = await apiRequest<GetCurrentTokenResponse>("/Token", {
            method: "GET",
            cookies: req.cookies.toString()
        });
    } catch (exc) {
        return NextResponse.json(
            { message: "Erro ao buscar grupos.", status: 500 },
            { status: 500 }
        );
    }

    return NextResponse.json({
        data: res.data,
        status: res.status,
    } satisfies ServerSideResponse<GetCurrentTokenResponse>, { status: res.status });
}

/**
 * Handles PUT requests to refresh/update the current authentication token.
 *
 * This endpoint generates a new authentication token while invalidating the old one,
 * useful for extending the session duration or rotating tokens for security.
 *
 * @param req - The incoming Next.js request object.
 * @returns A JSON response containing the updated token data.
 *
 * @remarks
 * **Request:** No request body required. Authentication via cookies.
 *
 * **Success Response (200):**
 * ```json
 * {
 *   "status": 200,
 *   "data": {
 *     "token": "string",
 *     "expiresAt": "ISO date string",
 *     "issuedAt": "ISO date string",
 *     ...new token details...
 *   }
 * }
 * ```
 *
 * **Error Response (500):**
 * - Server error when updating token
 * - Invalid or expired current token
 */
export async function PUT(req: NextRequest) {
    let res;
    try {
        res = await apiRequest<UpdateCurrentTokenResponse>("/Token", {
            method: "PUT",
            cookies: req.cookies.toString()
        });
    } catch (exc) {
        return NextResponse.json(
            { message: "Erro ao criar grupo.", status: 500 },
            { status: 500 }
        );
    }

    return NextResponse.json({
        data: res.data,
        status: res.status,
    } satisfies ServerSideResponse<UpdateCurrentTokenResponse>, { status: res.status });
}
