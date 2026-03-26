import { NextRequest, NextResponse } from "next/server";
import { apiRequest } from "@/libs/apiClient";
import { InviteUserToGroupRequest } from "@/types/Group/Requests";
import { ServerSideResponse } from "@/types/Global";
import { InviteUserToGroupResponse } from "@/types/Group/Responses";
import { GroupInvitation } from "@/types/Group";

/**
 * Handles POST requests to send a group invitation to a user.
 *
 * @param req - The incoming Next.js request object containing the invitation data.
 * @returns A JSON response confirming the invitation was sent.
 *
 * @remarks
 * **Request Body (InviteUserToGroupRequest):**
 * ```json
 * {
 *   "ra": "string",      // User's academic registration number to invite
 *   "groupId": number    // ID of the group to invite the user to
 * }
 * ```
 *
 * **Success Response (200):**
 * ```json
 * {
 *   "status": 200,
 *   "data": {
 *     "message": "string",
 *     "invitation": { ...invitation details... }
 *   }
 * }
 * ```
 *
 * **Error Response:**
 * - 404: User not found
 * - 400: User already in group or invitation already sent
 * - 500: Server error when sending invitation
 */
export async function POST(req: NextRequest) {
    const body = (await req.json()) as InviteUserToGroupRequest;
    let res;
    try {
        res = await apiRequest<
            InviteUserToGroupResponse,
            InviteUserToGroupRequest
        >("/Group/invite", {
            method: "POST",
            data: body,
            cookies: req.cookies.toString(),
        });
    } catch (error) {
        const statusCode = (error as any).response?.status || 500;
        return NextResponse.json(
            { message: "Erro ao enviar convite para o usuário.", status: statusCode },
            { status: statusCode }
        );
    }
    
    return NextResponse.json(
        {
            data: res.data,
            status: res.status,
        } satisfies ServerSideResponse<InviteUserToGroupResponse>,
        { status: res.status }
    );
}

/**
 * Handles GET requests to retrieve all group invitations for the current user.
 *
 * @param req - The incoming Next.js request object.
 * @returns A JSON response containing an array of pending group invitations.
 *
 * @remarks
 * **Request:** No parameters required. User authenticated via cookies.
 *
 * **Success Response (200):**
 * ```json
 * {
 *   "status": 200,
 *   "data": [
 *     {
 *       "id": number,
 *       "groupId": number,
 *       "groupName": "string",
 *       "invitedBy": "string",
 *       "createdAt": "ISO date string",
 *       ...invitation details...
 *     }
 *   ]
 * }
 * ```
 *
 * **Error Response:**
 * - 500: Server error when fetching invitations
 */
export const GET = async (req: NextRequest) => {
    let res;
    try {
        res = await apiRequest<GroupInvitation[]>("/Group/invite", {
            method: "GET",
            cookies: req.cookies.toString(),
        });
    } catch (error) {
        const statusCode = (error as any).response?.status || 500;
        return NextResponse.json(
            { message: "Erro ao buscar convites para o grupo.", status: statusCode },
            { status: statusCode }
        );
    }
    return NextResponse.json(
        {
            data: res.data,
            status: res.status,
        } satisfies ServerSideResponse<GroupInvitation[]>,
        { status: res.status }
    );
};
