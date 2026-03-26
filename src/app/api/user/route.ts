import { apiRequest } from "@/libs/apiClient";
import { ServerSideResponse } from "@/types/Global";
import { GetUsersResponse } from "@/types/User/Responses";
import { AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles GET requests to retrieve a paginated list of users.
 *
 * @param req - The incoming Next.js request object with query parameters.
 * @returns A JSON response containing paginated users.
 *
 * @remarks
 * **Query Parameters:**
 * - `page` (number, default: 1): Page number to retrieve
 * - `pageSize` (number, default: 10): Number of users per page
 * - `search` (string, default: ""): Search term to filter users by name, email, or RA
 * - `role` (string | null): Filter by user role ("Admin", "Teacher", or "Student")
 *
 * **Success Response (200):**
 * ```json
 * {
 *   "status": 200,
 *   "data": {
 *     "items": [
 *       {
 *         "ra": "string",
 *         "name": "string",
 *         "email": "string",
 *         "role": "Student" | "Teacher" | "Admin",
 *         "joinYear": number,
 *         "department": "string",
 *         ...user details...
 *       }
 *     ],
 *     "totalCount": number,
 *     "page": number,
 *     "pageSize": number
 *   }
 * }
 * ```
 *
 * **Error Response (500):**
 * - Server error when fetching users
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || null;

    let res: AxiosResponse<GetUsersResponse>;
    try {
        res = await apiRequest<GetUsersResponse>("/User", {
            method: "GET",
            params: { page, pageSize, search, role },
            cookies: req.cookies.toString()
        });
    } catch (exc) {
        return NextResponse.json(
            { message: "Erro ao buscar usuários.", status: 500 },
            { status: 500 }
        );
    }

    return NextResponse.json({
        data: res.data,
        status: res.status,
    } satisfies ServerSideResponse<GetUsersResponse>, { status: res.status });
}
