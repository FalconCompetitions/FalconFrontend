import { apiRequest } from "@/libs/apiClient";
import { InscribeGroupInCompetitionRequest } from "@/types/Competition/Requests";
import { InscribeGroupInCompetitionResponse } from "@/types/Competition/Responses";
import { ServerSideResponse } from "@/types/Global";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles POST requests to enroll a group in a competition.
 *
 * This endpoint registers a group for participation in a specific competition
 * during the inscription period.
 *
 * @param request - The incoming Next.js request object containing the inscription data.
 * @returns A JSON response confirming the group's enrollment in the competition.
 *
 * @remarks
 * **Request Body (InscribeGroupInCompetitionRequest):**
 * ```json
 * {
 *   "competitionId": number,  // ID of the competition to join
 *   "groupId": number         // ID of the group to enroll
 * }
 * ```
 *
 * **Success Response (200):**
 * ```json
 * {
 *   "status": 200,
 *   "data": {
 *     "message": "string",
 *     ...inscription details...
 *   }
 * }
 * ```
 *
 * **Error Response (500):**
 * - Server error when enrolling group
 * - Competition not open for inscriptions
 * - Group already enrolled
 */
export async function POST(request: NextRequest) {
    const body = (await request.json()) as InscribeGroupInCompetitionRequest;

    let res;

    try {
        res = await apiRequest<InscribeGroupInCompetitionResponse>(
            "/Competition/inscribe",
            {
                method: "POST",
                data: body,
                cookies: request.cookies.toString(),
            }
        );
    } catch (error) {
        console.error(error);
        return new NextResponse(
            JSON.stringify({
                message: "Erro ao inscrever grupo na competição.",
                status: 500,
            }),
            { status: 500 }
        );
    }

    return NextResponse.json(
        {
            data: res.data,
            status: res.status,
        } satisfies ServerSideResponse<InscribeGroupInCompetitionResponse>,
        { status: res.status }
    );
}
