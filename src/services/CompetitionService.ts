import { apiRequest } from "@/libs/apiClient";
import type { Competition, CompetitionDetail } from "@/types/Competition";
import type {
    CreateCompetitionRequest,
    InscribeGroupInCompetitionRequest,
    UpdateCompetitionRequest,
    // SubmitExerciseRequest, //já deixei sincronizado com oq tem no back(ta faltando coisa no back que tem no frontend), precisa ver se vai usar
} from "@/types/Competition/Requests";
import type {
    CompetitionResponse,
    InscribeGroupInCompetitionResponse,
    ChampionTeamResponse,
    // CurrentCompetitionResponse, //já deixei sincronizado com oq tem no back (ta faltando coisa no back que tem no frontend), precisa ver se vai usar
    // SubmissionResponse, //já deixei sincronizado com oq tem no back(ta faltando coisa no back que tem no frontend), precisa ver se vai usar
} from "@/types/Competition/Responses";
import type { ServerSideResponse } from "@/types/Global";

class CompetitionService {
    /**
     * Retrieves the existing competition.
     *
     * @returns A promise that resolves to the server response containing the competition data.
     */
    static async getExistentCompetition() {
        const response = await apiRequest<
            ServerSideResponse<CompetitionResponse>
        >("/api/competition", {
            method: "GET",
        });

        return response.data;
    }

    /**
     * Retrieves all available competition templates.
     *
     * @returns A promise that resolves to the server response containing an array of competition templates.
     */
    static async getCompetitionTemplates() {
        const response = await apiRequest<ServerSideResponse<Competition[]>>(
            "/api/competition/template",
            {
                method: "GET",
            }
        );

        return response.data;
    }

    /**
     * Retrieves all competitions that are currently open for group inscription.
     *
     * @returns A promise that resolves to the server response containing an array of competitions open for inscription.
     */
    static async getCompetitionsOpenForInscription() {
        const response = await apiRequest<ServerSideResponse<Competition[]>>(
            "/api/competition/open",
            {
                method: "GET",
            }
        );

        return response.data;
    }

    /**
     * Creates a new competition with the specified configuration.
     *
     * @param data - The competition creation request containing all necessary details such as name, description, dates, and exercise IDs.
     * @returns A promise that resolves to the server response containing the created competition data.
     */
    static async createCompetition(data: CreateCompetitionRequest) {
        const response = await apiRequest<
            ServerSideResponse<CompetitionResponse>,
            CreateCompetitionRequest
        >("/api/competition", {
            method: "POST",
            data: data,
        });

        return response.data;
    }

    /**
     * Updates an existing competition with new configuration data.
     *
     * @param data - The competition update request containing the competition ID and updated details.
     * @returns A promise that resolves to the server response containing the updated competition data.
     */
    static async updateCompetition(data: UpdateCompetitionRequest) {
        const response = await apiRequest<
            ServerSideResponse<CompetitionResponse>,
            UpdateCompetitionRequest
        >(`/api/competition/${data.id}`, {
            method: "PUT",
            data: data,
        });

        return response.data;
    }

    static async getFinishedCompetitions() {
        const response = await apiRequest<ServerSideResponse<Competition[]>>(
            "/api/competition/finished",
            { method: "GET" }
        );
        return response.data;
    }

    static async getCompetitionById(id: number) {
        const response = await apiRequest<ServerSideResponse<CompetitionDetail>>(
            `/api/competition/${id}`,
            { method: "GET" }
        );
        return response.data;
    }

    /**
     * Enrolls a group in a specific competition.
     *
     * @param data - The inscription request containing the group ID and competition ID.
     * @returns A promise that resolves to the server response containing the inscription result.
     */
    static async inscribeGroupInCompetition(
        data: InscribeGroupInCompetitionRequest
    ) {
        const response = await apiRequest<
            ServerSideResponse<InscribeGroupInCompetitionResponse>,
            InscribeGroupInCompetitionRequest
        >(`/api/competition/inscribe`, {
            method: "POST",
            data: data,
        });

        return response.data;
    }

    // static async getCurrentCompetitionWithRanking() {
    //     const response = await apiRequest<
    //         ServerSideResponse<CurrentCompetitionResponse>
    //     >(`/api/competition/current`, {
    //         method: "GET",
    //     });

    //     return response.data;
    // }

    // static async submitExerciseSolution(data: SubmitExerciseRequest) {
    //     const formData = new FormData();
    //     formData.append("competitionId", data.competitionId.toString());
    //     formData.append("exerciseId", data.exerciseId.toString());
    //     formData.append("languageId", data.languageId.toString());
    //     formData.append("solutionFile", data.solutionFile);

    //     const response = await apiRequest<
    //         ServerSideResponse<SubmissionResponse>
    //     >(`/api/competition/submit`, {
    //         method: "POST",
    //         data: formData,
    //         headers: {
    //             "Content-Type": "multipart/form-data",
    //         },
    //     });

    //     return response.data;
    // }

    /**
     * Retrieves all champion teams from finished competitions.
     *
     * @returns A promise that resolves to the server response containing the list of champion team records.
     */
    static async getChampionTeams(): Promise<
        ServerSideResponse<ChampionTeamResponse[]>
    > {
        const response = await apiRequest<
            ServerSideResponse<ChampionTeamResponse[]>
        >(`/api/competition/champions`, {
            method: "GET",
        });

        return response.data;
    }

    /**
     * Retrieves all finished competitions with their full data.
     *
     * @returns A promise that resolves to the server response containing an array of finished competitions.
     * @remarks Only accessible by Admin/Teacher roles.
     */
    static async getFinishedCompetitions(): Promise<
        ServerSideResponse<Competition[]>
    > {
        const response = await apiRequest<ServerSideResponse<Competition[]>>(
            `/api/competition/finished`,
            {
                method: "GET",
            }
        );

        return response.data;
    }

    /**
     * Retrieves a specific competition by its ID, including all related entities.
     *
     * @param id - The unique identifier of the competition to retrieve.
     * @returns A promise that resolves to the server response containing the competition data with exercises, groups, rankings, questions, and logs.
     * @remarks Works for both active and finished competitions. Only accessible by Admin/Teacher roles.
     */
    static async getCompetitionById(
        id: number
    ): Promise<ServerSideResponse<Competition>> {
        const response = await apiRequest<ServerSideResponse<Competition>>(
            `/api/competition/${id}`,
            {
                method: "GET",
            }
        );

        return response.data;
    }
}

export default CompetitionService;
