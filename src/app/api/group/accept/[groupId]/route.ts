import { NextRequest, NextResponse } from "next/server";
import { apiRequest } from "@/libs/apiClient";
import { ServerSideResponse } from "@/types/Global";
import { AcceptGroupInvitationResponse } from "@/types/Group/Responses";

/**
 * Handles PUT requests to accept a group invitation.
 *
 * This endpoint allows a user to accept an invitation to join a group.
 *
 * @param req - The incoming Next.js request object.
 * @param context - Route context containing the group ID parameter.
 * @returns A JSON response confirming the invitation acceptance.
 *
 * @remarks
 * **URL Parameter:**
 * - `groupId` (string): The unique identifier of the group invitation to accept
 *
 * **Request:** No request body required. User authenticated via cookies.
 *
 * **Success Response (200):**
 * ```json
 * {
 *   "status": 200,
 *   "data": {
 *     "message": "string",
 *     "group": { ...group details... }
 *   }
 * }
 * ```
 *
 * **Error Response (500):**
 * - Server error when accepting invitation
 * - Invitation not found or already accepted
 */
export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ groupId: string }> }
) {
    const { groupId } = await context.params;
    let res;
    try {
        res = await apiRequest<
            AcceptGroupInvitationResponse
        >(`/Group/accept/${groupId}`, {
            method: "PUT",
            cookies: req.cookies.toString(),
        });
    } catch (exc) {
        return NextResponse.json(
            { message: "Erro ao aceitar convite do grupo.", status: 500 },
            { status: 500 }
        );
    }

    return NextResponse.json({
        data: res.data,
        status: res.status,
    } satisfies ServerSideResponse<AcceptGroupInvitationResponse>, { status: res.status });
}
