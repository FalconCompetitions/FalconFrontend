import { apiRequest } from "@/libs/apiClient";
import { NextRequest, NextResponse } from "next/server";
import { ServerSideResponse } from "@/types/Global";
import { CreateCompetitionRequest, UpdateCompetitionRequest } from "@/types/Competition/Requests";
import { UpdateCompetitionResponse } from "@/types/Competition/Responses";
import { Competition } from "@/types/Competition";

/**
 * Handles GET requests to retrieve the current active competition.
 *
 * @param req - The incoming Next.js request object.
 * @returns A JSON response containing the active competition data.
 *
 * @remarks
 * **Request:** No parameters required. Authentication via cookies.
 *
 * **Success Response (200):**
 * ```json
 * {
 *   "status": 200,
 *   "data": {
 *     "id": number,
 *     "name": "string",
 *     "description": "string",
 *     "startTime": "ISO date string",
 *     "duration": "string",
 *     ...competition details...
 *   }
 * }
 * ```
 *
 * **Error Response (500):**
 * - Server error when fetching competition
 */
export async function GET(req: NextRequest) {
    let res;
    try {
        res = await apiRequest<Competition>("/Competition", {
            method: "GET",
            cookies: req.cookies.toString()
        });
    } catch {
        return NextResponse.json(
            { message: "Erro ao buscar competição.", status: 500 },
            { status: 500 }
        );
    }
    return NextResponse.json({
        data: res.data,
        status: res.status,
    } satisfies ServerSideResponse<Competition>, { status: res.status });
}

/**
 * Handles POST requests to create a new competition.
 *
 * @param req - The incoming Next.js request object containing the competition data.
 * @returns A JSON response containing the created competition data.
 *
 * @remarks
 * **Request Body (CreateCompetitionRequest):**
 * ```json
 * {
 *   "name": "string",                    // Competition name
 *   "description": "string",             // Competition description
 *   "startTime": "ISO date string",      // When competition starts
 *   "duration": "HH:mm:ss" | null,       // Competition duration
 *   "startInscriptions": "ISO date string" | null,  // Inscription start time
 *   "endInscriptions": "ISO date string" | null,    // Inscription end time
 *   "stopRanking": "ISO date string" | null,        // When to stop ranking
 *   "blockSubmissions": "ISO date string" | null,   // When to block submissions
 *   "submissionPenalty": "HH:mm:ss" | null,         // Penalty time per submission
 *   "maxExercises": number | null,       // Max exercises in competition
 *   "maxMembers": number,                // Max members per team
 *   "maxSubmissionSize": number,         // Max submission size in bytes
 *   "exerciseIds": [number]              // Array of exercise IDs to include
 * }
 * ```
 *
 * **Success Response (200):**
 * ```json
 * {
 *   "status": 200,
 *   "data": { ...created competition details... }
 * }
 * ```
 *
 * **Error Response (500):**
 * - Server error when creating competition
 */
export async function POST(req: NextRequest) {
    const body = await req.json() as CreateCompetitionRequest;
    let res;
    try {
        res = await apiRequest<Competition>("/Competition", {
            method: "POST",
            data: body,
            cookies: req.cookies.toString()
        });
    } catch {
        return NextResponse.json(
            { message: "Erro ao criar competição.", status: 500 },
            { status: 500 }
        );
    }

    return NextResponse.json({
        data: res.data,
        status: res.status,
    } satisfies ServerSideResponse<Competition>, { status: res.status });
}

