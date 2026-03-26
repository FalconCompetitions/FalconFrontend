import { apiRequest } from "@/libs/apiClient";
import { UpdateGroupRequest } from "@/types/Group/Requests";
import { GroupResponse, UpdateGroupResponse } from "@/types/Group/Responses";
import { ServerSideResponse } from "@/types/Global";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles GET requests to retrieve detailed information about a specific group.
 *
 * @param req - The incoming Next.js request object.
 * @param params - Route parameters containing the group ID.
 * @returns A JSON response containing the group data.
 *
 * @remarks
 * **URL Parameter:**
 * - `groupId` (string): The unique identifier of the group
 *
 * **Success Response (200):**
 * ```json
 * {
 *   "status": 200,
 *   "data": {
 *     "id": number,
 *     "name": "string",
 *     "members": [...],
 *     "createdAt": "ISO date string",
 *     ...group details...
 *   }
 * }
 * ```
 *
 * **Error Response (500):**
 * - Server error when fetching group
 * - Group not found
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
    const { groupId } = await params;

    let res;

    try {
        res = await apiRequest<GroupResponse>(`/Group/${groupId}`, {
            method: "GET",
            cookies: req.cookies.toString()
        });
    } catch(exc) {
        return NextResponse.json(
            { message: "Erro ao obter grupo.", status: 500 },
            { status: 500 },
        );
    }

    return NextResponse.json({
        data: res.data,
        status: res.status,
    } satisfies ServerSideResponse<GroupResponse>, { status: res.status });
}

/**
 * Handles PUT requests to update a group's information.
 *
 * @param req - The incoming Next.js request object containing the update data.
 * @param params - Route parameters containing the group ID.
 * @returns A JSON response containing the updated group data.
 *
 * @remarks
 * **URL Parameter:**
 * - `groupId` (string): The unique identifier of the group to update
 *
 * **Request Body (UpdateGroupRequest):**
 * ```json
 * {
 *   "name": "string",                  // New group name
 *   "membersToRemove": ["string"]      // Array of user RAs to remove from group
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
 *     ...updated group details...
 *   }
 * }
 * ```
 *
 * **Error Response (500):**
 * - Server error when updating group
 * - Group not found
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
    const { groupId } = await params;
    const body = await req.json() as UpdateGroupRequest;
    let res;
    try {
        res = await apiRequest<UpdateGroupResponse>(`/Group/${groupId}`, {
            method: "PUT",
            data: body,
            cookies: req.cookies.toString()
        });
    } catch (exc) {
        return NextResponse.json(
            { message: "Erro ao atualizar grupo.", status: 500 },
            { status: 500 },
        );
    }

    return NextResponse.json({
        data: res.data,
        status: res.status,
    } satisfies ServerSideResponse<UpdateGroupResponse>, { status: res.status });
}

/**
 * Handles DELETE requests to permanently delete a group.
 *
 * @param req - The incoming Next.js request object.
 * @param params - Route parameters containing the group ID.
 * @returns A JSON response confirming the deletion.
 *
 * @remarks
 * **URL Parameter:**
 * - `groupId` (string): The unique identifier of the group to delete
 *
 * **Request:** No request body required. User authenticated via cookies.
 *
 * **Success Response (200):**
 * ```json
 * {
 *   "status": 200
 * }
 * ```
 *
 * **Error Response:**
 * - 403: User not authorized to delete this group
 * - 500: Server error when deleting group
 * - Group not found
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
    const { groupId } = await params;
    let res;

    try {
        res = await apiRequest<void>(`/Group/${groupId}`, {
            method: "DELETE",
            cookies: req.cookies.toString()
        });
    } catch (exc) {
        const statusCode = (exc as any).response?.status || 500;
        return NextResponse.json(
            { message: "Erro ao deletar grupo.", status: statusCode },
            { status: statusCode }
        );
    }

    return NextResponse.json(
        { status: res.status, data: undefined } satisfies ServerSideResponse<void>,
        { status: res.status }
    );
}
