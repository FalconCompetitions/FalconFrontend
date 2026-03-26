import { apiRequest } from "@/libs/apiClient";

import { NextRequest, NextResponse } from "next/server";
import { ServerSideResponse } from "@/types/Global";
import { Competition } from "@/types/Competition";

/**
 * Handles GET requests to retrieve all finished competitions.
 *
 * @param req - The incoming Next.js request object.
 * @returns A JSON response containing an array of finished competitions.
 *
 * @remarks
 * **Request:** No parameters required. Authentication via cookies. 
 * Only accessible by Admin/Teacher roles.
 *
 * **Success Response (200):**
 * ```json
 * {
 *   "status": 200,
 *   "data": [
 *     {
 *       "id": number,
 *       "name": "string",
 *       "description": "string",
 *       "startTime": "ISO date string",
 *       "endTime": "ISO date string",
 *       "status": "Finished",
 *       "exercises": [...],
 *       "groups": [...],
 *       ...competition details...
 *     }
 *   ]
 * }
 * ```
 *
 * **Error Response (401):**
 * - Unauthorized: User not authenticated
 *
 * **Error Response (403):**
 * - Forbidden: User does not have Admin/Teacher role
 *
 * **Error Response (500):**
 * - Server error when fetching finished competitions
 */
export async function GET(req: NextRequest) {
    let res;
    try {
        res = await apiRequest<Competition[]>("/Competition/finished", {
            method: "GET",
            cookies: req.cookies.toString()
        });
    } catch {
        return NextResponse.json(
            { message: "Erro ao buscar competições finalizadas.", status: 500 },
            { status: 500 }
        );
    }
    return NextResponse.json({
        data: res.data,
        status: res.status,
    } satisfies ServerSideResponse<Competition[]>, { status: res.status });
}
