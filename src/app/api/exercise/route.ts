import { apiRequest } from "@/libs/apiClient";
import { CreateExerciseRequest } from "@/types/Exercise/Requests";
import { GetExercisesResponse } from "@/types/Exercise/Responses";
import { Exercise, ExerciseType } from "@/types/Exercise";
import { ServerSideResponse } from "@/types/Global";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles GET requests to retrieve a paginated list of exercises.
 *
 * @param req - The incoming Next.js request object with query parameters.
 * @returns A JSON response containing paginated exercises.
 *
 * @remarks
 * **Query Parameters:**
 * - `page` (number, default: 1): Page number to retrieve
 * - `pageSize` (number, default: 10): Number of exercises per page
 * - `search` (string, default: ""): Search term to filter exercises by title or description
 * - `exerciseType` (ExerciseType | null): Filter by exercise type (0=Algorithm, 1=DataStructure, etc.)
 *
 * **Success Response (200):**
 * ```json
 * {
 *   "status": 200,
 *   "data": {
 *     "items": [
 *       {
 *         "id": number,
 *         "title": "string",
 *         "description": "string",
 *         "exerciseTypeId": number,
 *         "estimatedTime": number,
 *         "judgeUuid": "string",
 *         ...exercise details...
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
 * - 500: Server error when fetching exercises
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;
    const search = searchParams.get("search") || "";
    const exerciseType = searchParams.get("exerciseType") || null;

    let res;
    try {
        res = await apiRequest<GetExercisesResponse>("/Exercise", {
            method: "GET",
            params: { page, pageSize, search, exerciseType },
            cookies: req.cookies.toString(),
        });
    } catch (exc) {
        const statusCode = (exc as any).response?.status || 500;
        return NextResponse.json(
            { message: "Erro ao buscar exercícios.", status: statusCode },
            { status: statusCode }
        );
    }

    return NextResponse.json(
        {
            data: res.data,
            status: res.status,
        } satisfies ServerSideResponse<GetExercisesResponse>,
        { status: res.status }
    );
}

/**
 * Handles POST requests to create a new exercise.
 *
 * This endpoint accepts multipart/form-data containing exercise metadata and a PDF file.
 *
 * @param req - The incoming Next.js request object containing the form data.
 * @returns A JSON response containing the created exercise data.
 *
 * @remarks
 * **Request Body (multipart/form-data):**
 * - `title` (string): Exercise title
 * - `exerciseTypeId` (number): Type of exercise (0=Algorithm, 1=DataStructure, etc.)
 * - `description` (string): Exercise description
 * - `estimatedTime` (number): Estimated time to complete in minutes
 * - `judgeUuid` (string): UUID of the judge system to use
 * - `inputs` (JSON string): Array of test case inputs
 * - `outputs` (JSON string): Array of expected outputs
 * - `pdfFile` (File): PDF file containing the exercise statement
 *
 * **Success Response (201):**
 * ```json
 * {
 *   "status": 201,
 *   "data": {
 *     "id": number,
 *     "title": "string",
 *     "description": "string",
 *     ...created exercise details...
 *   }
 * }
 * ```
 *
 * **Error Response (500):**
 * - Server error when creating exercise
 * - Invalid test cases format
 */
export async function POST(req: NextRequest) {
    const formData = await req.formData();

    const metadataPayload: Omit<CreateExerciseRequest, "pdfFile"> = {
        title: formData.get("title") as string,
        // @ts-expect-error - Number conversion to ExerciseType
        exerciseTypeId: Number(formData.get("exerciseTypeId") as ExerciseType),
        description: formData.get("description") as string,
        estimatedTime: Number(formData.get("estimatedTime")),
        judgeUuid: formData.get("judgeUuid") as string,
        inputs: JSON.parse(formData.get("inputs") as string),
        outputs: JSON.parse(formData.get("outputs") as string),
    };

    const backendPayload = new FormData();
    backendPayload.append("file", formData.get("pdfFile") as File);
    console.log(JSON.stringify(metadataPayload));
    backendPayload.append("metadata", JSON.stringify(metadataPayload));

    let res;
    try {
        res = await apiRequest<Exercise>("/Exercise", {
            method: "POST",
            data: backendPayload,
            headers: {
                "Content-Type": "multipart/form-data",
            },
            cookies: req.cookies.toString(),
        });
    } catch (exc) {
        return NextResponse.json(
            { message: "Erro ao criar exercício.", status: 500 },
            { status: 500 }
        );
    }

    return NextResponse.json(
        {
            data: res.data,
            status: 201,
        } satisfies ServerSideResponse<Exercise>,
        { status: 201 }
    );
}
