/**
 * Enum representing the type of action performed.
 * These values must match the backend LogType enum.
 */
export enum LogTypeEnum {
    UserAction = 0,
    SystemAction = 1,
    Login = 2,
    Logout = 3,
    SubmittedExercise = 4,
    GroupBlockedInCompetition = 5,
    GroupUnblockedInCompetition = 6,
    QuestionSent = 7,
    AnswerGiven = 8,
    CompetitionUpdated = 9,
    CompetitionFinished = 10,
}

/**
 * Represents the type of action performed by a user in the system.
 * @deprecated Use LogTypeEnum instead for type safety.
 */
export type ActionType =
    | "Login"
    | "Logout"
    | "SubmitExercise"
    | "CreateQuestion"
    | "AnswerQuestion"
    | "ViewRanking"
    | "Other";

/**
 * Represents a log entry in the system tracking user actions.
 */
export interface Log {
    /**
     * The unique identifier of the log entry.
     */
    id: number;

    /**
     * The type of action that was performed (enum value).
     */
    actionType: number | ActionType;

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
 * Represents team activity information for monitoring purposes.
 */
export interface TeamActivity {
    /**
     * The name of the team.
     */
    teamName: string;

    /**
     * The IP address used by the team.
     */
    ip: string;

    /**
     * The timestamp of the last login (ISO date string).
     */
    lastLogin: string;

    /**
     * The timestamp of the last logout (ISO date string).
     */
    lastLogout: string;

    /**
     * Comma-separated list of team member names.
     */
    members: string;

    /**
     * The timestamp of the last action performed (ISO date string).
     */
    lastActionTime: string;

    /**
     * Description of the last action performed.
     */
    lastAction: string;
}

/**
 * Helper function to get a human-readable description for a log action type.
 * @param actionType - The action type enum value.
 * @param userName - Optional user name for personalized messages.
 * @param groupName - Optional group name for personalized messages.
 * @returns A human-readable description of the action.
 */
export function getLogActionDescription(
    actionType: number,
    userName?: string | null,
    groupName?: string | null
): string {
    const user = userName || "Usuário";
    const group = groupName || "Grupo";

    switch (actionType) {
        case LogTypeEnum.UserAction:
            return `${user} realizou uma ação`;
        case LogTypeEnum.SystemAction:
            return "Ação do sistema";
        case LogTypeEnum.Login:
            return `${user} (${group}) entrou na competição`;
        case LogTypeEnum.Logout:
            return `${user} (${group}) saiu da competição`;
        case LogTypeEnum.SubmittedExercise:
            return `${group} enviou uma submissão de exercício`;
        case LogTypeEnum.GroupBlockedInCompetition:
            return `${group} foi bloqueado na competição`;
        case LogTypeEnum.GroupUnblockedInCompetition:
            return `${group} foi desbloqueado na competição`;
        case LogTypeEnum.QuestionSent:
            return `${group} enviou uma pergunta`;
        case LogTypeEnum.AnswerGiven:
            return `Pergunta de ${group} foi respondida`;
        case LogTypeEnum.CompetitionUpdated:
            return "Configurações da competição foram atualizadas";
        case LogTypeEnum.CompetitionFinished:
            return "Competição foi finalizada manualmente";
        default:
            return "Ação desconhecida";
    }
}
