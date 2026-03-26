import { GenericUserInfo } from ".";
import { PagedResult } from "../Global";

/**
 * Represents the response for getting users.
 */
export type GetUsersResponse = PagedResult<GenericUserInfo>;

/**
 * Represents the competition history for a user.
 */
export interface UserCompetitionHistoryResponse {
    /** The year of the competition. */
    year: number;
    /** The name of the group that participated. */
    groupName: string;
    /** The number of questions solved in the format "solved/total". */
    questions: string;
    /** The competition ID. */
    competitionId: number;
    /** The competition name. */
    competitionName: string;
}
