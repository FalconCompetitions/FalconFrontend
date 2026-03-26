import { apiRequest } from "@/libs/apiClient";
import { EditExerciseRequest } from "@/types/Exercise/Requests";
import { Exercise, ExerciseType } from "@/types/Exercise";
import { ServerSideResponse } from "@/types/Global";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles DELETE requests to permanently delete an exercise.
 *
 * @param req - The incoming Next.js request object.
 * @param params - Route parameters containing the exercise ID.
 * @returns A JSON response confirming the deletion.
 *
 * @remarks
 * **URL Parameter:**
 * - `id` (string): The unique identifier of the exercise to delete
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
 * **Error Response (500):**
 * - Server error when deleting exercise
 * - Exercise not found
 * - Exercise is being used in active competitions
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    let res;
    const exerciseId = (await params).id;
    try {
        res = await apiRequest<ServerSideResponse<void>>(
            `/Exercise/${exerciseId}`,
            {
                method: "DELETE",
                cookies: req.cookies.toString(),
            }
        );
    } catch (exc) {
        return NextResponse.json(
            { message: "Erro ao deletar exercício.", status: 500 },
            { status: 500 }
        );
    }

    return NextResponse.json(
        { status: res.status, data: undefined } satisfies ServerSideResponse<void>,
        { status: res.status }
    );
}

/**
 * Handles PUT requests to update an existing exercise.
 *
 * This endpoint accepts multipart/form-data to update exercise metadata and optionally a new PDF file.
 *
 * @param req - The incoming Next.js request object containing the form data.
 * @param params - Route parameters containing the exercise ID.
 * @returns A JSON response containing the updated exercise data.
 *
 * @remarks
 * **URL Parameter:**
 * - `id` (string): The unique identifier of the exercise to update
 *
 * **Request Body (multipart/form-data):**
 * - `title` (string): Exercise title
 * - `exerciseTypeId` (number): Type of exercise (0=Algorithm, 1=DataStructure, etc.)
 * - `description` (string): Exercise description
 * - `estimatedTime` (number): Estimated time to complete in minutes
 * - `judgeUuid` (string): UUID of the judge system to use
 * - `inputs` (JSON string): Array of test case inputs
 * - `outputs` (JSON string): Array of expected outputs
 * - `pdfFile` (File, optional): New PDF file containing the exercise statement
 *
 * **Success Response (200):**
 * ```json
 * {
 *   "status": 200,
 *   "data": {
 *     "id": number,
 *     "title": "string",
 *     "description": "string",
 *     ...updated exercise details...
 *   }
 * }
 * ```
 *
 * **Error Response (500):**
 * - Server error when updating exercise
 * - Exercise not found
 */
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const exerciseId = (await params).id;
    const formData = await req.formData();

    const metadataPayload: Omit<EditExerciseRequest, "pdfFile"> = {
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

    // Only append file if it's a valid file with content
    if (formData.has("pdfFile")) {
        const file = formData.get("pdfFile");
        if (file instanceof File && file.size > 0 && file.name) {
            backendPayload.append("file", file);
        }
    }

    backendPayload.append("metadata", JSON.stringify(metadataPayload));

    let res;
    try {
        res = await apiRequest<Exercise>(`/Exercise/${exerciseId}`, {
            method: "PUT",
            data: backendPayload,
            headers: {
                "Content-Type": "multipart/form-data",
            },
            cookies: req.cookies.toString(),
        });
    } catch (exc) {
        return NextResponse.json(
            { message: "Erro ao atualizar exercício.", status: 500 },
            { status: 500 }
        );
    }

    return NextResponse.json(
        {
            data: res.data,
            status: res.status,
        } satisfies ServerSideResponse<Exercise>,
        { status: res.status }
    );
}
