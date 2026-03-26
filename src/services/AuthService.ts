import {
    LoginUserResponse,
    LogoutUserResponse,
    RegisterUserResponse,
    ValidateTokenResponse,
} from "@/types/Auth/Responses";
import { apiRequest } from "@/libs/apiClient";
import { LoginUserRequest, RegisterUserRequest } from "@/types/Auth/Requests";
import { ServerSideResponse } from "@/types/Global";

class AuthService {
    /**
     * Validate the authentication token in the context of SSR (Server-Side Rendering).
     *
     * @param token - string containing the authentication token.
     * @returns A boolean value indicating if the token is valid.
     */
    static async validateTokenSSR(token: string): Promise<boolean> {
        const req = await apiRequest<ValidateTokenResponse>("/Auth/validate", {
            method: "GET",
            cookies: {
                CompetitionAuthToken: token,
            },
        });

        return req.data.valid;
    }

    /**
     * Perform the registration of a new user.
     *
     * @param payload - Object containing the data required for the user registration.
     * @returns The object of response of the user registration if the registration is successful.
     */
    static async registerUser(payload: RegisterUserRequest) {
        const response = await apiRequest<ServerSideResponse<RegisterUserResponse>>(
            "/api/auth/register",
            {
                method: "POST",
                data: payload,
            }
        );

        return response.data;
    }

    /**
     * Performs user authentication with the provided credentials.
     *
     * @param payload - Object containing the user's RA and password for authentication.
     * @returns A promise that resolves to the server response containing the authenticated user data and token.
     */
    static async loginUser(payload: LoginUserRequest) {
        const response = await apiRequest<
            ServerSideResponse<LoginUserResponse>
        >("/api/auth/login", {
            method: "POST",
            data: payload,
        });

        return response.data;
    }

    /**
     * Logs out the current user by invalidating their session.
     *
     * @returns A promise that resolves to the server response confirming the logout.
     */
    static async logoutUser() {
        const req = await fetch("/api/auth/logout", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            next: { revalidate: false },
            cache: "no-cache",
        });

        const data =
            (await req.json()) as ServerSideResponse<LogoutUserResponse>;

        return data;
    }
}

export default AuthService;
