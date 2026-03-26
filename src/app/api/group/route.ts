import { apiRequest } from "@/libs/apiClient";
import { ServerSideResponse } from "@/types/Global";
import { CreateGroupRequest } from "@/types/Group/Requests";
import {
    CreateGroupResponse,
    GetGroupsResponse,
    GroupResponse,
} from "@/types/Group/Responses";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles GET requests to retrieve a paginated list of groups.
 *
 * @param req - The incoming Next.js request object with query parameters.
 * @returns A JSON response containing paginated groups.
 *
 * @remarks
 * **Query Parameters:**
 * - `page` (number, default: 1): Page number to retrieve
 * - `pageSize` (number, default: 10): Number of groups per page
 * - `search` (string, default: ""): Search term to filter groups by name
 *
 * **Success Response (200):**
 * ```json
 * {
 *   "status": 200,
 *   "data": {
 *     "items": [
 *       {
 *         "id": number,
 *         "name": "string",
 *         "members": [...],
 *         ...group details...
 *       }
 *     ],
 *     "totalCount": number,
 *     "page": number,
 *     "pageSize": number
 *   }
 * }
 * ```
 *
 * **Error Response:**
 * - 500: Server error when fetching groups
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;
    const search = searchParams.get("search") || "";

    let res;
    try {
        res = await apiRequest<GetGroupsResponse>("/Group", {
            method: "GET",
            params: { page, pageSize, search },
            cookies: req.cookies.toString(),
        });
    } catch (exc) {
        const statusCode = (exc as any).response?.status || 500;
        return NextResponse.json(
            { message: "Erro ao buscar grupos.", status: statusCode },
            { status: statusCode }
        );
    }

    return NextResponse.json(
        {
            data: res.data,
            status: res.status,
        } satisfies ServerSideResponse<GetGroupsResponse>,
        { status: res.status }
    );
}

/**
 * Handles POST requests to create a new group.
 *
 * @param req - The incoming Next.js request object containing the group data.
 * @returns A JSON response containing the created group data.
 *
 * @remarks
 * **Request Body (CreateGroupRequest):**
 * ```json
 * {
 *   "name": "string",          // Group name
 *   "userRAs": ["string"]      // Array of user RAs to add as members
 * }
 * ```
 *
 * **Success Response (200):**
 * ```json
 * {
 *   "status": 200,
 *   "data": {
 *     "id": number,
 *     "name": "string",
 *     "members": [...],
 *     ...created group details...
 *   }
 * }
 * ```
 *
 * **Error Response:**
 * - 500: Server error when creating group
 * - 400: Invalid request data (e.g., user not found, duplicate members)
 */
export async function POST(req: NextRequest) {
    const body = (await req.json()) as CreateGroupRequest;
    let res;
    console.log(body);
    try {
        res = await apiRequest<GroupResponse>(
            "/Group",
            {
                method: "POST",
                data: body,
                cookies: req.cookies.toString(),
            }
        );
    } catch (exc) {
        console.error(exc);
        const statusCode = (exc as any).response?.status || 500;
        return NextResponse.json(
            { message: "Erro ao criar grupo.", status: statusCode },
            { status: statusCode }
        );
    }

    return NextResponse.json({
        data: res.data,
        status: res.status,
    } satisfies ServerSideResponse<GroupResponse>, { status: res.status });
}
