import { apiRequest } from "@/libs/apiClient";
import { RegisterUserRequest } from "@/types/Auth/Requests";
import { RegisterUserResponse } from "@/types/Auth/Responses";
import { ServerSideResponse } from "@/types/Global";
import { AxiosResponse } from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles POST requests to register a new user in the system.
 *
 * This endpoint creates a new user account with the provided information,
 * generates an authentication token, and sets it as an httpOnly cookie.
 *
 * @param req - The incoming Next.js request object.
 * @returns A JSON response containing the registration result and user data.
 *
 * @remarks
 * **Request Body (RegisterUserRequest):**
 * ```json
 * {
 *   "name": "string",           // User's display name
 *   "ra": "string",             // User's academic registration number
 *   "email": "string",          // User's email address
 *   "joinYear": number | null,  // Year the user joined
 *   "password": "string",       // User's chosen password
 *   "role": "Student" | "Teacher", // User role
 *   "accessCode": "string",     // Optional: Required for teacher registration
 *   "department": "string" | null // User's department
 * }
 * ```
 *
 * **Success Response (200):**
 * ```json
 * {
 *   "status": 200,
 *   "message": "Usuário registrado com sucesso.",
 *   "data": {
 *     "token": "string",
 *     "user": { ...user details... }
 *   }
 * }
 * ```
 *
 * **Error Responses:**
 * - 403: User is already authenticated
 * - 400: Validation error (invalid data)
 * - 500: Server error during registration
 */
export async function POST(req: NextRequest) {
    const cookie = await cookies();
    cookie.delete("CompetitionAuthToken");
    const token = cookie.get("CompetitionAuthToken")?.value || null;

    if(token != null) {
        return NextResponse.json(
            {
                message: "Você já está autenticado.",
                status: 403,
            } satisfies ServerSideResponse<RegisterUserResponse>,
            {
                status: 403,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }

    const body = await req.json() as RegisterUserRequest;

    let res: AxiosResponse<RegisterUserResponse> | null = null;

    try {
        res = await apiRequest<RegisterUserResponse, RegisterUserRequest>("/Auth/Register", {
            method: "POST",
            data: body,
        });

        const data = res.data;

        cookie.set("CompetitionAuthToken", data.token);

        return NextResponse.json(
            {
                message: "Usuário registrado com sucesso.",
                data,
                status: res.status,
            } satisfies ServerSideResponse<RegisterUserResponse>,
            {
                headers: {
                    "Content-Type": "application/json"
                },
                status: res.status,
            },
        );
    }
    catch(exc) {
        console.error("Registration error:", exc);
        
        const statusCode = res?.status || 500;
        
        return NextResponse.json(
            {
                data: res?.data,
                message: res?.data ? "Erro de validação" : "Erro ao registrar usuário.",
                error: "Erro no registro.",
                status: statusCode,
            } satisfies ServerSideResponse<RegisterUserResponse>,
            {
                status: statusCode,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }

}