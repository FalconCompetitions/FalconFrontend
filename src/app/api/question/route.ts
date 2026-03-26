import { apiRequest } from "@/libs/apiClient";
import { GetQuestionsResponse } from "@/types/Question/Responses";
import { ServerSideResponse } from "@/types/Global";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles GET requests to retrieve a paginated list of questions.
 *
 * Questions are inquiries or doubts submitted by participants during a competition.
 *
 * @param req - The incoming Next.js request object with query parameters.
 * @returns A JSON response containing paginated questions.
 *
 * @remarks
 * **Query Parameters:**
 * - `page` (number, default: 1): Page number to retrieve
 * - `pageSize` (number, default: 10): Number of questions per page
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
 *         "content": "string",
 *         "askedBy": "string",
 *         "answer": "string" | null,
 *         "createdAt": "ISO date string",
 *         ...question details...
 *       }
 *     ],
 *     "totalCount": number,
 *     "page": number,
 *     "pageSize": number
 *   }
 * }
 * ```
 *
 * **Error Response (500):**
 * - Server error when fetching questions
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;
    
    let res;
    try {
        res = await apiRequest<GetQuestionsResponse>("/Question", {
            method: "GET",
            params: { page, pageSize },
            cookies: req.cookies.toString(),
        });
    } catch (exc) {
        return NextResponse.json(
            { message: "Erro ao buscar questões.", status: 500 },
            { status: 500 }
        );
    }

    return NextResponse.json(
        {
            data: res.data,
            status: res.status,
        } satisfies ServerSideResponse<GetQuestionsResponse>,
        { status: res.status }
    );
}
