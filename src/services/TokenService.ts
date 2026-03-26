import { apiRequest } from "@/libs/apiClient";
import { ServerSideResponse } from "@/types/Global";
import { GetCurrentTokenResponse, UpdateCurrentTokenResponse } from "@/types/Token/Responses";

class TokenService {
    /**
     * Retrieves the current authentication token information.
     *
     * @returns A promise that resolves to the server response containing the current token data.
     */
    public static async getCurrentToken(): Promise<
        ServerSideResponse<GetCurrentTokenResponse>
    > {
        const res = await apiRequest<
            ServerSideResponse<GetCurrentTokenResponse>
        >("/api/token", {
            method: "GET",
        });

        return res.data;
    }

    /**
     * Updates the current authentication token by generating a new one.
     *
     * @returns A promise that resolves to the server response containing the updated token data.
     */
    public static async updateCurrentToken(): Promise<
        ServerSideResponse<UpdateCurrentTokenResponse>
    > {
        const res = await apiRequest<
            ServerSideResponse<UpdateCurrentTokenResponse>
        >("/api/token", {
            method: "PUT",
        });
        return res.data;
    }
}

export default TokenService;
