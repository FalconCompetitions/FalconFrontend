import { apiRequest } from "@/libs/apiClient";
import { Competition } from "@/types/Competition";
import { ServerSideResponse } from "@/types/Global";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles GET requests to retrieve all competitions currently open for inscription.
 *
 * This endpoint returns competitions that are accepting group registrations,
 * i.e., competitions where the current date is within the inscription period.
 *
 * @param req - The incoming Next.js request object.
 * @returns A JSON response containing an array of open competitions.
 *
 * @remarks
 * **Request:** No parameters required. Authentication via cookies.
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
 *       "startInscriptions": "ISO date string",
 *       "endInscriptions": "ISO date string",
 *       ...competition details...
 *     }
 *   ]
 * }
 * ```
 *
 * **Error Response (500):**
 * - Server error when fetching open competitions
 */
export async function GET(req: NextRequest) {
    let res;
    try {
        res = await apiRequest<Competition>("/Competition/open", {
            method: "GET",
            cookies: req.cookies.toString(),
        });
    } catch {
        return NextResponse.json(
            { message: "Erro ao buscar competição.", status: 500 },
            { status: 500 }
        );
    }
    return NextResponse.json(
        {
            data: res.data,
            status: res.status,
        } satisfies ServerSideResponse<Competition>,
        { status: res.status }
    );
}
