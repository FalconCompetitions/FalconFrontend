import { apiRequest } from "@/libs/apiClient";
import { Competition } from "@/types/Competition";
import { ServerSideResponse } from "@/types/Global";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles GET requests to retrieve all competition templates.
 *
 * Competition templates are predefined competition configurations that can be used
 * as starting points for creating new competitions.
 *
 * @param req - The incoming Next.js request object.
 * @returns A JSON response containing an array of competition templates.
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
 *       ...template details...
 *     }
 *   ]
 * }
 * ```
 *
 * **Error Response (500):**
 * - Server error when fetching templates
 */
export async function GET(req: NextRequest) {
    let res;
    try {
        res = await apiRequest<Competition>("/Competition/template", {
            method: "GET",
            cookies: req.cookies.toString()
        });
    } catch {
        return NextResponse.json(
            { message: "Erro ao buscar competição.", status: 500 },
            { status: 500 }
        );
    }
    return NextResponse.json({
        data: res.data,
        status: res.status,
    } satisfies ServerSideResponse<Competition>, { status: res.status });
}