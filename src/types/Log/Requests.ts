import type { ActionType } from ".";

/**
 * Represents the request payload for creating a log entry.
 */
export interface CreateLogRequest {
    /**
     * The type of action being logged.
     */
    actionType: ActionType;

    /**
     * The IP address from which the action was performed.
     */
    ipAddress: string;

    /**
     * The RA (academic registration number) of the user performing the action.
     */
    userId: string;

    /**
     * The ID of the group associated with the action.
     * @remarks Optional - only include for group-related actions.
     */
    groupId?: number;

    /**
     * The ID of the competition associated with the action.
     * @remarks Optional - only include for competition-related actions.
     */
    competitionId?: number;
}
