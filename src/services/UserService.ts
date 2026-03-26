import { apiRequest } from "@/libs/apiClient";
import type { ServerSideResponse } from "@/types/Global";
import type { UserEditRequest } from "@/types/User/Requests";
import type { GetUsersResponse, UserCompetitionHistoryResponse } from "@/types/User/Responses";
import type { GenericUserInfo, User, UserRole } from "@/types/User";

class UserService {
    /**
     * Retrieves the current authenticated user's information on the server side.
     *
     * @returns A promise that resolves to the user data.
     */
    static async getUserInfoSSR(): Promise<User> {
        const response = await apiRequest<User>(`/User`, {
            method: "GET",
        });

        return response.data;
    }

    /**
     * Retrieves a paginated list of users with optional filtering by search term and role.
     *
     * @param page - The page number to retrieve.
     * @param pageSize - The number of users per page.
     * @param search - Search term to filter users by name, email, or RA.
     * @param abortSignal - Signal to abort the request if needed.
     * @param role - Filter users by role (Admin, Teacher, or Student).
     * @returns A promise that resolves to the server response containing the paginated users.
     */
    static async GetUsersWithSignal(
        page: number,
        pageSize: number,
        search: string,
        abortSignal: AbortSignal,
        role: UserRole
    ): Promise<ServerSideResponse<GetUsersResponse>> {
        const response = await apiRequest<ServerSideResponse<GetUsersResponse>>(
            `/api/user`,
            {
                method: "GET",
                params: {
                    page,
                    pageSize,
                    search,
                    role,
                },
                signal: abortSignal,
            }
        );

        return response.data;
    }

    /**
     * Retrieves a paginated list of teacher users with optional search filtering.
     *
     * @param page - The page number to retrieve.
     * @param pageSize - The number of teachers per page.
     * @param search - Search term to filter teachers by name, email, or RA.
     * @param abortSignal - Signal to abort the request if needed.
     * @returns A promise that resolves to the response containing the paginated teachers.
     */
    static async GetTeacherUsers(
        page: number,
        pageSize: number,
        search: string,
        abortSignal: AbortSignal
    ): Promise<GetUsersResponse> {
        const response = await apiRequest<GetUsersResponse>(`/api/user`, {
            method: "GET",
            params: {
                page,
                pageSize,
                search,
                role: "Teacher",
            },
            signal: abortSignal,
        });

        return response.data;
    }

    /**
     * Updates a user's information.
     *
     * @param userId - The unique identifier (RA) of the user to update.
     * @param request - The update request containing the new user data.
     * @returns A promise that resolves to the server response containing the updated user information.
     */
    static async updateUser(userId: string, request: UserEditRequest) {
        const response = await apiRequest<ServerSideResponse<GenericUserInfo>>(
            `/api/user/${userId}`,
            {
                method: "PUT",
                data: request,
            }
        );

        return response.data;
    }

    /**
     * Deletes a user from the system.
     *
     * @param userId - The unique identifier (RA) of the user to delete.
     * @returns A promise that resolves to the server response confirming the deletion.
     */
    static async deleteUser(userId: string): Promise<ServerSideResponse<void>> {
        const response = await apiRequest<ServerSideResponse<void>>(`/api/user/${userId}`, {
            method: "DELETE",
        });

        return response.data;
    }

    /**
     * Retrieves the competition history for a specific user.
     *
     * @param userId - The unique identifier of the user.
     * @returns A promise that resolves to the server response containing the list of competition history records.
     */
    static async getUserCompetitionHistory(userId: string): Promise<ServerSideResponse<UserCompetitionHistoryResponse[]>> {
        const response = await apiRequest<ServerSideResponse<UserCompetitionHistoryResponse[]>>(
            `/api/user/${userId}/competition-history`,
            {
                method: "GET",
            }
        );

        return response.data;
    }

    /**
     * Retrieves user statistics for dashboard.
     * Fetches users with minimal pagination to get totalCount.
     *
     * @param page - The page number to retrieve (default: 1).
     * @param pageSize - The number of users per page (default: 1 for statistics).
     * @param search - Optional search term to filter users.
     * @param role - Optional role filter (Admin, Teacher, or Student).
     * @returns A promise that resolves to the server response containing user statistics.
     */
    static async getUsers(
        page: number = 1,
        pageSize: number = 1,
        search?: string,
        role?: UserRole
    ): Promise<ServerSideResponse<GetUsersResponse>> {
        const response = await apiRequest<ServerSideResponse<GetUsersResponse>>(
            `/api/user`,
            {
                method: "GET",
                params: {
                    page,
                    pageSize,
                    ...(search && { search }),
                    ...(role && { role }),
                },
            }
        );

        return response.data;
    }
}

export default UserService;
