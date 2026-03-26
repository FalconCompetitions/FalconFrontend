/**
 * Represents the request body for creating a competition.
 */
export interface CreateCompetitionRequest {
    /** The name of the competition. */
    name: string;
    /**
     * A brief description of the competition.
     */
    description: string;
    /** The start time of the competition (ISO string). */
    startTime: string;
    /** The duration of the competition (as a string, e.g., "02:00:00"). */
    duration: string | null;
    /** The start date/time for inscriptions (ISO string). */
    startInscriptions: string | null;
    /** The end date/time for inscriptions (ISO string). */
    endInscriptions: string | null;
    /** The date/time when the ranking will be stopped (ISO string). */
    stopRanking: string | null;
    /** Optional. The date/time when submissions will be blocked (ISO string). */
    blockSubmissions?: string | null;
    /** The penalty time for submissions, represented as a string (e.g., "00:30:00"). */
    submissionPenalty: string | null;
    /** The maximum number of exercises allowed in the competition. */
    maxExercises: number | null;
    /**
     * The maximum number of members allowed in a team.
     */
    maxMembers: number;
    /** The maximum allowed submission size (in bytes). */
    maxSubmissionSize: number;
    /** The list of exercise IDs included in the competition. */
    exerciseIds: number[];
}

/**
 * Represents the request body for updating a competition.
 * Inherits all properties from CreateCompetitionRequest except 'exerciseIds', and adds the competition ID.
 */
export interface UpdateCompetitionRequest
    extends CreateCompetitionRequest {
    /**
     * The unique identifier of the competition to update.
     */
    id: number;
}

/**
 * Represents the request to enroll a group in a competition.
 */
export interface InscribeGroupInCompetitionRequest {
    /**
     * The unique identifier of the competition to join.
     */
    competitionId: number;

    /**
     * The unique identifier of the group to enroll.
     */
    groupId: number;
}


export type LanguageType =
    | 0 // CSharp
    | 1 // Java
    | 2 // Javascript
    | 3 // Go
    | 4 // Python
    | 5 // C
    | 6 // C++
    | 7 // PHP;

/**
 * Represents a group's attempt to solve an exercise during a competition.
 */
export interface GroupExerciseAttemptRequest {
    /**
     * The unique identifier of the exercise being attempted.
     */
    exerciseId: number;

    /**
     * The programming language used for the submission.
     */
    languageType: LanguageType;

    /**
     * The source code submitted for evaluation.
     */
    code: string;
}