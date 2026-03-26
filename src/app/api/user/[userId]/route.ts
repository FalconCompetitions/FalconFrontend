import { NextRequest, NextResponse } from "next/server";
import { apiRequest } from "@/libs/apiClient";
import { UserEditRequest } from "@/types/User/Requests";
import { User } from "@/types/User";
import { ServerSideResponse } from "@/types/Global";

/**
 * Handles PUT requests to update a user's information.
 *
 * @param req - The incoming Next.js request object containing the updated user data.
 * @param context - Route context containing the user ID parameter.
 * @returns A JSON response containing the updated user data.
 *
 * @remarks
 * **URL Parameter:**
 * - `userId` (string): The user's RA (academic registration number)
 *
 * **Request Body (UserEditRequest):**
 * ```json
 * {
 *   "name": "string",           // User's display name
 *   "email": "string",          // User's email address
 *   "joinYear": number | null,  // Year the user joined
 *   "department": "string" | null // User's department
 * }
 * ```
 *
 * **Success Response (200):**
 * ```json
 * {
 *   "status": 200,
 *   "data": {
 *     "ra": "string",
 *     "name": "string",
 *     "email": "string",
 *     ...updated user details...
 *   }
 * }
 * ```
 *
 * **Error Response:**
 * - 404: User not found
 * - 500: Server error when updating user
 */
export async function PUT(req: NextRequest, context: { params: Promise<{ userId: string }> }) {
    const { userId } = await context.params;
    const body = await req.json() as UserEditRequest;
    let res;
    try {
        res = await apiRequest<User>(`/User/${userId}`, {
            method: "PUT",
            data: body,
            cookies: req.cookies.toString()
        });
    } catch (exc) {
        const statusCode = (exc as any).response?.status || 500;
        return NextResponse.json(
            { message: "Erro ao atualizar usuário.", status: statusCode },
            { status: statusCode }
        );
    }
    return NextResponse.json({
        data: res.data,
        status: res.status,
    } satisfies ServerSideResponse<User>, { status: res.status });
}

/**
 * Handles DELETE requests to permanently delete a user from the system.
 *
 * @param req - The incoming Next.js request object.
 * @param context - Route context containing the user ID parameter.
 * @returns A JSON response confirming the deletion.
 *
 * @remarks
 * **URL Parameter:**
 * - `userId` (string): The user's RA (academic registration number) to delete
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
 * **Error Response:**
 * - 404: User not found
 * - 403: Insufficient permissions to delete this user
 * - 500: Server error when deleting user
 */
export async function DELETE(req: NextRequest, context: { params: Promise<{ userId: string }> }) {
    const { userId } = await context.params;
    let res;

    try {
        res = await apiRequest<void>(`/User/${userId}`, {
            method: "DELETE",
            cookies: req.cookies.toString()
        });
    } catch (exc) {
        const statusCode = (exc as any).response?.status || 500;
        return NextResponse.json(
            { message: "Erro ao deletar usuário.", status: statusCode },
            { status: statusCode }
        );
    }
    
    // Para DELETE com void, retornamos um objeto com status seguindo o padrão ServerSideResponse
    return NextResponse.json(
        { status: res.status, data: undefined } satisfies ServerSideResponse<void>,
        { status: res.status }
    );
}
