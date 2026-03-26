import { NextRequest, NextResponse } from "next/server";
import { apiRequest } from "@/libs/apiClient";
import { ChampionTeamResponse } from "@/types/Competition/Responses";
import { ServerSideResponse } from "@/types/Global";

/**
 * Handles GET requests to retrieve all champion teams from finished competitions.
 *
 * @param req - The incoming Next.js request object.
 * @returns A JSON response containing the list of champion teams.
 *
 * @remarks
 * **Request:** No parameters or authentication required (public endpoint).
 *
 * **Success Response (200):**
 * ```json
 * {
 *   "status": 200,
 *   "data": [
 *     {
 *       "year": number,
 *       "teamName": "string",
 *       "competitionId": number,
 *       "competitionName": "string",
 *       "points": number
 *     }
 *   ]
 * }
 * ```
 *
 * **Response Details:**
 * - Returns champions ordered by year in descending order (most recent first)
 * - Only includes competitions with status "Finished"
 * - Each entry represents the first-place team of a competition
 * - Points include the total score achieved by the champion team
 *
 * **Error Response (500):**
 * - Server error when fetching champion teams
 *
 * @example
 * // Request
 * GET /api/competition/champions
 *
 * // Response
 * {
 *   "status": 200,
 *   "data": [
 *     {
 *       "year": 2024,
 *       "teamName": "Code Warriors",
 *       "competitionId": 5,
 *       "competitionName": "Maratona de Programação 2024",
 *       "points": 850.5
 *     },
 *     {
 *       "year": 2023,
 *       "teamName": "Bit Busters",
 *       "competitionId": 3,
 *       "competitionName": "Maratona de Programação 2023",
 *       "points": 720.0
 *     }
 *   ]
 * }
 */
export async function GET(req: NextRequest) {
    try {
        const res = await apiRequest<ChampionTeamResponse[]>(
            "/Competition/champions",
            {
                method: "GET",
                cookies: req.cookies.toString(),
            }
        );

        return NextResponse.json(
            {
                data: res.data,
                status: res.status,
            } satisfies ServerSideResponse<ChampionTeamResponse[]>,
            { status: res.status }
        );
    } catch (exc) {
        const statusCode = (exc as any).response?.status || 500;

        return NextResponse.json(
            {
                message: "Erro ao buscar times campeões.",
                status: statusCode,
            },
            { status: statusCode }
        );
    }
}
