import { Competition, CompetitionStatus } from ".";
import { JudgeResponseEnum } from "../Exercise";
import { CreateCompetitionRequest } from "./Requests";

/**
 * Represents the response for getting competitions.
 */
export interface GetCompetitionsResponse {
    /** List of competitions. */
    competitions: Competition[];
}

/**
 * Represents the response for creating a competition.
 */
export interface CompetitionResponse extends CreateCompetitionRequest {
    /** The unique identifier of the competition. */
    id: number;

    /**
     * Current status of the competition.
     */
    status: CompetitionStatus;

    /**
     * The end time of the competition (ISO string).
     */
    endTime: string;
}

/**
 * Represents the response for updating a competition.
 */
export interface UpdateCompetitionResponse
    extends Omit<CompetitionResponse, "exerciseIds"> {}


export interface InscribeGroupInCompetitionResponse {
    competitionId: number;
    groupId: number;
    createdOn: string;
}


export interface ExerciseSubmissionResponse {
    id: number;
    exerciseId: number;
    groupId: number;
    accepted: boolean;
    judgeResponse: JudgeResponseEnum;
}
/**
 * Represents a champion team from a competition.
 */
export interface ChampionTeamResponse {
    /** The year of the competition. */
    year: number;
    /** The name of the champion team. */
    teamName: string;
    /** The competition ID. */
    competitionId: number;
    /** The competition name. */
    competitionName: string;
    /** The total points scored by the team. */
    points: number;
}
