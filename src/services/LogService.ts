import { apiRequest } from "@/libs/apiClient";
import type { ServerSideResponse } from "@/types/Global";
import type { CreateLogRequest } from "@/types/Log/Requests";
import type { GetLogsResponse, LogResponse } from "@/types/Log/Responses";

class LogService {
    /**
     * Retrieves a paginated list of all logs with optional search filtering.
     *
     * @param page - The page number to retrieve.
     * @param pageSize - The number of logs per page.
     * @param search - Optional search term to filter logs.
     * @returns A promise that resolves to the server response containing the paginated logs.
     */
    public async GetLogs(page: number, pageSize: number, search?: string) {
        const response = await apiRequest<ServerSideResponse<GetLogsResponse>>(
            "/api/log",
            {
                method: "GET",
                params: {
                    page,
                    pageSize,
                    search,
                },
            }
        );
        return response.data;
    }

    /**
     * Retrieves a paginated list of logs for a specific competition with optional search filtering.
     *
     * @param competitionId - The unique identifier of the competition.
     * @param page - The page number to retrieve.
     * @param pageSize - The number of logs per page.
     * @param search - Optional search term to filter logs.
     * @returns A promise that resolves to the server response containing the paginated competition logs.
     */
    public async GetLogsByCompetition(
        competitionId: number,
        page: number,
        pageSize: number,
        search?: string
    ) {
        const response = await apiRequest<ServerSideResponse<GetLogsResponse>>(
            `/api/log/competition/${competitionId}`,
            {
                method: "GET",
                params: {
                    page,
                    pageSize,
                    search,
                },
            }
        );
        return response.data;
    }

    /**
     * Retrieves a paginated list of logs for a specific user with optional search filtering.
     *
     * @param userId - The unique identifier (RA) of the user.
     * @param page - The page number to retrieve.
     * @param pageSize - The number of logs per page.
     * @param search - Optional search term to filter logs.
     * @returns A promise that resolves to the server response containing the paginated user logs.
     */
    public async GetLogsByUser(
        userId: string,
        page: number,
        pageSize: number,
        search?: string
    ) {
        const response = await apiRequest<ServerSideResponse<GetLogsResponse>>(
            `/api/log/user/${userId}`,
            {
                method: "GET",
                params: {
                    page,
                    pageSize,
                    search,
                },
            }
        );
        return response.data;
    }

    /**
     * Retrieves a paginated list of logs for a specific group with optional search filtering.
     *
     * @param groupId - The unique identifier of the group.
     * @param page - The page number to retrieve.
     * @param pageSize - The number of logs per page.
     * @param search - Optional search term to filter logs.
     * @returns A promise that resolves to the server response containing the paginated group logs.
     */
    public async GetLogsByGroup(
        groupId: number,
        page: number,
        pageSize: number,
        search?: string
    ) {
        const response = await apiRequest<ServerSideResponse<GetLogsResponse>>(
            `/api/log/group/${groupId}`,
            {
                method: "GET",
                params: {
                    page,
                    pageSize,
                    search,
                },
            }
        );
        return response.data;
    }

    /**
     * Creates a new log entry in the system.
     *
     * @param request - The log creation request containing the log details.
     * @returns A promise that resolves to the server response containing the created log data.
     */
    public async CreateLog(request: CreateLogRequest) {
        const response = await apiRequest<ServerSideResponse<LogResponse>>(
            "/api/log",
            {
                method: "POST",
                data: request,
            }
        );
        return response.data;
    }

    /**
     * Retrieves detailed information about a specific log by its ID.
     *
     * @param id - The unique identifier of the log.
     * @returns A promise that resolves to the server response containing the log data.
     */
    public async GetLogById(id: number) {
        const response = await apiRequest<ServerSideResponse<LogResponse>>(
            `/api/log/${id}`,
            {
                method: "GET",
            }
        );
        return response.data;
    }
}

export default LogService;
