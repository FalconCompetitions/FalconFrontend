import { apiRequest } from "@/libs/apiClient";
import { UpdateCompetitionRequest } from "@/types/Competition/Requests";
import { UpdateCompetitionResponse } from "@/types/Competition/Responses";
import { CompetitionDetail } from "@/types/Competition";

import { Competition } from "@/types/Competition";
import { ServerSideResponse } from "@/types/Global";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles GET requests to retrieve a specific competition by its ID.
 *
 * @param req - The incoming Next.js request object.
 * @param context - Route context containing the competition ID parameter.
 * @returns A JSON response containing the competition data with all related entities.
 *
 * @remarks
 * **URL Parameter:**
 * - `id`: The unique identifier of the competition to retrieve
 *
 * **Success Response (200):**
 * ```json
 * {
 *   "status": 200,
 *   "data": {
 *     "id": number,
 *     "name": "string",
 *     "description": "string",
 *     "status": "Finished" | "Ongoing" | ...,
 *     "exercises": [...],     // All exercises with inputs/outputs
 *     "groups": [...],        // All groups with users
 *     "rankings": [...],      // Competition rankings
 *     "questions": [...],     // Questions with answers
 *     "logs": [...],          // Competition logs
 *     ...competition details...
 *   }
 * }
 * ```
 *
 * **Error Response (404):**
 * ```json
 * {
 *   "message": "Competição com ID {id} não encontrada.",
 *   "status": 404
 * }
 * ```
 *
 * **Error Response (500):**
 * - Server error when fetching competition
 */
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const id = parseInt((await context.params).id);

    let res;
    try {
        res = await apiRequest<Competition>(
            `/Competition/${id}`,
            {
                method: "GET",
                cookies: req.cookies.toString(),
            }
        );
    } catch {
        return NextResponse.json(
            { message: `Competição com ID ${id} não encontrada.`, status: 404 },
            { status: 404 }
        );
    }
    return NextResponse.json(
        {
            data: res.data,
            status: res.status,
        } satisfies ServerSideResponse<Competition>,
        { status: res.status }
    );
}

/**
 * Handles PUT requests to update an existing competition by its ID.
 *
 * @param req - The incoming Next.js request object containing the updated competition data.
 * @param context - Route context containing the competition ID parameter.
 * @returns A JSON response containing the updated competition data.
 *
 * @remarks
 * **URL Parameter:**
 * - `id`: The unique identifier of the competition to update
 *
 * **Request Body (UpdateCompetitionRequest):**
 * ```json
 * {
 *   "id": number,                        // Competition ID (must match URL param)
 *   "name": "string",                    // Competition name
 *   "description": "string",             // Competition description
 *   "startTime": "ISO date string",      // When competition starts
 *   "duration": "HH:mm:ss" | null,       // Competition duration
 *   "startInscriptions": "ISO date string" | null,
 *   "endInscriptions": "ISO date string" | null,
 *   "stopRanking": "ISO date string" | null,
 *   "blockSubmissions": "ISO date string" | null,
 *   "submissionPenalty": "HH:mm:ss" | null,
 *   "maxExercises": number | null,
 *   "maxMembers": number,
 *   "maxSubmissionSize": number,
 *   "exerciseIds": [number]
 * }
 * ```
 *
 * **Success Response (200):**
 * ```json
 * {
 *   "status": 200,
 *   "data": { ...updated competition details... }
 * }
 * ```
 *
 * **Error Response (500):**
 * - Server error when updating competition
 */
export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const id = parseInt((await context.params).id);

    const body = (await req.json()) as UpdateCompetitionRequest;
    let res;
    try {
        res = await apiRequest<UpdateCompetitionResponse>(
            `/Competition/${id}`,
            {
                method: "PUT",
                data: body,
                cookies: req.cookies.toString(),
            }
        );
    } catch {
        return NextResponse.json(
            { message: "Erro ao atualizar competição.", status: 500 },
            { status: 500 }
        );
    }
    return NextResponse.json(
        {
            data: res.data,
            status: res.status,
        } satisfies ServerSideResponse<UpdateCompetitionResponse>,
        { status: res.status }
    );
}
