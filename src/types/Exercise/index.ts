
/**
 * Represents the possible response codes from the judge system.
 */
export enum JudgeResponseEnum {
    Accepted = 0,
    WrongAnswer = 1,
    RuntimeError = 2,
    CompilationError = 3,
    PresentationError = 4,
    TimeLimitExceeded = 5,
    MemoryLimitExceeded = 6,
    SecurityError = 7
}

/**
 * Maps JudgeResponseEnum to user-friendly Portuguese messages.
 */
export const JudgeResponseMessages: Record<JudgeResponseEnum, string> = {
    [JudgeResponseEnum.Accepted]: "Resposta aceita",
    [JudgeResponseEnum.WrongAnswer]: "Resposta incorreta",
    [JudgeResponseEnum.RuntimeError]: "Erro de execução",
    [JudgeResponseEnum.CompilationError]: "Erro de compilação",
    [JudgeResponseEnum.PresentationError]: "Erro de apresentação",
    [JudgeResponseEnum.TimeLimitExceeded]: "Tempo limite excedido",
    [JudgeResponseEnum.MemoryLimitExceeded]: "Memória limite excedida",
    [JudgeResponseEnum.SecurityError]: "Erro de segurança",
};

/**
 * Gets the user-friendly message for a judge response.
 */
export function getJudgeResponseMessage(response: JudgeResponseEnum): string {
    return JudgeResponseMessages[response] ?? "Resposta desconhecida";
}

/**
 * Represents the output generated for a specific exercise input by the judge system.
 */
export interface ExerciseOutput {
    /**
     * Unique identifier for the exercise output.
     */
    id: number;

    /**
     * Identifier of the exercise associated with this output.
     */
    exerciseId: number;

    /**
     * Identifier of the input used for this exercise output.
     */
    exerciseInputId: number;

    /**
     * UUID of the judge that processed the output, or null if not available.
     */
    judgeUuid: string | null;

    output: string;
}

/**
 * Represents the input data for an exercise, used by the judge system.
 */
export interface ExerciseInput {
    /**
     * Unique identifier for the exercise input.
     */
    id: number;

    /**
     * Identifier of the exercise associated with this input.
     */
    exerciseId: number;

    /**
     * UUID of the judge that will process this input.
     */
    judgeUuid: string;

    /**
     * The input string provided to the exercise.
     */
    input: string;
}


/**
 * Represents the different types of exercises.
 * - 1 -> Estruturas de Dados
 * - 2 -> Algoritmos
 * - 3 -> Matemática Computacional
 * - 4 -> Grafos
 * - 5 -> Programação Dinâmica
 * - 6 -> Geometria Computacional
 * - 7 -> Teoria dos Números
 */
export type ExerciseType = 1 | 2 | 3 | 4 | 5 | 6 | 7;


/**
 * Represents an exercise with its details and metadata.
 */
/**
 * Describes an exercise/problem entity used by the application.
 *
 * This interface aggregates identifying metadata, resource references,
 * descriptive content, estimated completion time, judge association, and
 * the structured input/output definitions required to evaluate the exercise.
 *
 * @remarks
 * - `estimatedTime` is expressed in seconds.
 * - `judgeUuid` is either a UUID string identifying the judge service/instance
 *   associated with this exercise, or `null` when no judge is assigned.
 * - `createdAt` is an ISO 8601 timestamp as a string.
 *
 * @property id - Unique numeric identifier for the exercise.
 * @property attachedFileId - Numeric identifier of an attached file/resource.
 * @property title - Human-readable title of the exercise.
 * @property exerciseTypeId - The exercise type identifier (see {@link ExerciseType}).
 * @property description - Full textual description or statement of the exercise.
 * @property estimatedTime - Estimated time to complete the exercise, in seconds.
 * @property judgeUuid - UUID of the judge associated with the exercise, or `null` if none.
 * @property createdAt - ISO 8601 formatted creation timestamp.
 * @property inputs - Array of {@link ExerciseInput} describing the input specifications.
 * @property outputs - Array of {@link ExerciseOutput} describing the expected outputs.
 *
 * @example
 * // Example shape (values elided for brevity)
 * // {
 * //   id: 1,
 * //   attachedFileId: 10,
 * //   title: "Example Problem",
 * //   exerciseTypeId: ExerciseType.Coding,
 * //   description: "Do something with input and produce output.",
 * //   estimatedTime: 600,
 * //   judgeUuid: null,
 * //   createdAt: "2023-01-01T00:00:00.000Z",
 * //   inputs: [...],
 * //   outputs: [...]
 * // }
 */
export interface Exercise {
    /**
     * Unique identifier for the exercise.
     */
    id: number;

    /**
     * Identifier of the attached file for the exercise.
     */
    attachedFileId: number;

    /**
     * Title of the exercise.
     */
    title: string;

    /**
     * Type of the exercise.
     */
    exerciseTypeId: ExerciseType;

    /**
     * Description of the exercise.
     */
    description: string;

    /**
     * Estimated time to complete the exercise, in seconds.
     */
    estimatedTime: number;

    /**
     * UUID of the judge associated with the exercise, or null if not assigned.
     */
    judgeUuid: string | null;

    /**
     * ISO string representing when the exercise was created.
     */
    createdAt: string;

    /**
     * Array of inputs for the exercise.
     */
    inputs: Array<ExerciseInput>;

    /**
     * Array of outputs for the exercise.
     */
    outputs: Array<ExerciseOutput>;
}


/**
 * Represents the relationship between an exercise and a competition.
 */
export interface ExerciseInCompetition {
    /**
     * Identifier of the exercise included in the competition.
     */
    exerciseId: number;

    /**
     * Identifier of the competition containing the exercise.
     */
    competitionId: number;
}