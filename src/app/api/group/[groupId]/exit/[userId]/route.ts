import { apiRequest } from "@/libs/apiClient";
import { ServerSideResponse } from "@/types/Global";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles DELETE requests to remove a user from a group.
 *
 * This endpoint allows removing a specific user from a group, either by the group
 * leader or by the user themselves (to leave the group).
 *
 * @param req - The incoming Next.js request object.
 * @param params - Route parameters containing the group ID and user ID.
 * @returns A JSON response confirming the user removal.
 *
 * @remarks
 * **URL Parameters:**
 * - `groupId` (string): The unique identifier of the group
 * - `userId` (string): The RA (academic registration number) of the user to remove
 *
 * **Request:** No request body required. User authenticated via cookies.
 *
 * **Success Response (200):**
 * ```json
 * {
 *   "status": 200,
 *   "data": {
 *     "message": "string"
 *   }
 * }
 * ```
 *
 * **Error Response (500):**
 * - Server error when removing user
 * - User not found in group
 * - Insufficient permissions
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ groupId: string, userId: string }> }) {
    const { groupId, userId } = await params;

    let res;

    try {
        res = await apiRequest<unknown>(`/Group/${groupId}/exit/${userId}`, {
            method: "DELETE",
            cookies: req.cookies.toString()
        });
    } catch(exc) {
        return NextResponse.json(
            { message: "Erro ao tentar deletar usuário do grupo.", status: 500 },
            { status: 500 },
        );
    }

    return NextResponse.json({
        data: res.data,
        status: res.status,
    } satisfies ServerSideResponse<unknown>, { status: res.status });
}