import type { PagedResult } from "../Global";

/**
 * Represents a log entry in the response.
 */
export interface LogResponse {
    /**
     * The unique identifier of the log entry.
     */
    id: number;

    /**
     * The type of action that was logged (numeric enum value).
     */
    actionType: number;

    /**
     * Human-readable description of the action.
     */
    actionDescription?: string;

    /**
     * The timestamp when the action occurred (ISO date string).
     */
    actionTime: string;

    /**
     * The IP address from which the action was performed.
     */
    ipAddress: string;

    /**
     * The ID of the user who performed the action.
     */
    userId?: string | null;

    /**
     * The name of the user who performed the action.
     */
    userName?: string | null;

    /**
     * The ID of the group associated with the action.
     */
    groupId?: number | null;

    /**
     * The name of the group associated with the action.
     */
    groupName?: string | null;

    /**
     * The ID of the competition associated with the action.
     */
    competitionId?: number | null;
}

/**
 * Represents a paginated response containing log entries.
 */
export type GetLogsResponse = PagedResult<LogResponse>;
