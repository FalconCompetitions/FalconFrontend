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
    // CurrentCompetitionResponse, //já deixei sincronizado com oq tem no back (ta faltando coisa no back que tem no frontend), precisa ver se vai usar
    // SubmissionResponse, //já deixei sincronizado com oq tem no back(ta faltando coisa no back que tem no frontend), precisa ver se vai usar
} from "@/types/Competition/Responses";
import type { ServerSideResponse } from "@/types/Global";

class CompetitionService {
    static async getExistentCompetition() {
        const response = await apiRequest<
            ServerSideResponse<CompetitionResponse>
        >("/api/competition", {
            method: "GET",
        });

        return response.data;
    }

    static async getCompetitionTemplates() {
        const response = await apiRequest<ServerSideResponse<Competition[]>>(
            "/api/competition/template",
            {
                method: "GET",
            }
        );

        return response.data;
    }

    static async getCompetitionsOpenForInscription() {
        const response = await apiRequest<ServerSideResponse<Competition[]>>(
            "/api/competition/open",
            {
                method: "GET",
            }
        );

        return response.data;
    }

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
}

export default CompetitionService;
