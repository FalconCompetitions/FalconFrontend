import { NextRequest, NextResponse } from "next/server";
import { apiRequest } from "@/libs/apiClient";
import { UserCompetitionHistoryResponse } from "@/types/User/Responses";
import { ServerSideResponse } from "@/types/Global";

/**
 * Handles GET requests to retrieve the competition history for a specific user.
 *
 * @param req - The incoming Next.js request object.
 * @param context - Route context containing the user ID parameter.
 * @returns A JSON response containing the user's competition history.
 *
 * @remarks
 * **URL Parameter:**
 * - `userId` (string): The user's unique identifier (ID or RA)
 *
 * **Request:** No request body required. User authenticated via cookies.
 *
 * **Success Response (200):**
 * ```json
 * {
 *   "status": 200,
 *   "data": [
 *     {
 *       "year": number,
 *       "groupName": "string",
 *       "questions": "8/12",
 *       "competitionId": number,
 *       "competitionName": "string"
 *     }
 *   ]
 * }
 * ```
 *
 * **Error Response:**
 * - 404: User not found
 * - 401: Unauthorized (not logged in)
 * - 500: Server error when fetching competition history
 *
 * @example
 * // Request
 * GET /api/user/123e4567-e89b-12d3-a456-426614174000/competition-history
 *
 * // Response
 * {
 *   "status": 200,
 *   "data": [
 *     {
 *       "year": 2024,
 *       "groupName": "Bit Busters",
 *       "questions": "8/12",
 *       "competitionId": 1,
 *       "competitionName": "Maratona de Programação 2024"
 *     }
 *   ]
 * }
 */
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ userId: string }> }
) {
    const { userId } = await context.params;

    try {
        const res = await apiRequest<UserCompetitionHistoryResponse[]>(
            `/User/${userId}/competition-history`,
            {
                method: "GET",
                cookies: req.cookies.toString(),
            }
        );

        return NextResponse.json(
            {
                data: res.data,
                status: res.status,
            } satisfies ServerSideResponse<UserCompetitionHistoryResponse[]>,
            { status: res.status }
        );
    } catch (exc) {
        const statusCode = (exc as any).response?.status || 500;
        const errorMessage =
            statusCode === 404
                ? "Usuário não encontrado."
                : "Erro ao buscar histórico de competições.";

        return NextResponse.json(
            { message: errorMessage, status: statusCode },
            { status: statusCode }
        );
    }
}
