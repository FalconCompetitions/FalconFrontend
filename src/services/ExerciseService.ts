import { apiRequest } from "@/libs/apiClient";
import { Exercise, ExerciseType } from "@/types/Exercise";
import { GetExercisesResponse } from "@/types/Exercise/Responses";
import { ServerSideResponse } from "@/types/Global";

class ExerciseService {
    /**
     * Retrieves a paginated list of exercises with optional filtering.
     *
     * @param page - The page number to retrieve.
     * @param pageSize - The number of exercises per page.
     * @param search - Search term to filter exercises by name or description.
     * @param exerciseType - Optional filter by exercise type.
     * @param abortSignal - Signal to abort the request if needed.
     * @returns A promise that resolves to the server response containing the paginated exercises.
     */
    static async getExercisesWithSignal(
        page: number,
        pageSize: number,
        search: string,
        exerciseType: ExerciseType | null,
        abortSignal: AbortSignal
    ): Promise<ServerSideResponse<GetExercisesResponse>> {
        const response = await apiRequest<
            ServerSideResponse<GetExercisesResponse>
        >(`/api/exercise`, {
            method: "GET",
            params: {
                page,
                pageSize,
                search,
                exerciseType,
            },
            signal: abortSignal,
        });

        return response.data;
    }

    /**
     * Creates a new exercise in the system.
     *
     * @param exercise - Form data containing the exercise details including test cases and files.
     * @returns A promise that resolves to the server response containing the created exercise data.
     */
    static async createExercise(
        exercise: FormData
    ): Promise<ServerSideResponse<Exercise>> {
        const response = await apiRequest<ServerSideResponse<Exercise>>(
            `/api/exercise`,
            {
                method: "POST",
                data: exercise,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    }

    /**
     * Deletes an exercise by its ID.
     *
     * @param id - The unique identifier of the exercise to delete.
     * @returns A promise that resolves to the server response confirming the deletion.
     */
    static async deleteExercise(id: number): Promise<ServerSideResponse<void>> {
        const response = await apiRequest<ServerSideResponse<void>>(
            `/api/exercise/${id}`,
            {
                method: "DELETE",
            }
        );

        return response.data;
    }

    /**
     * Updates an existing exercise with new data.
     *
     * @param exercise - Form data containing the updated exercise details. Must include the exercise ID.
     * @returns A promise that resolves to the server response containing the updated exercise data.
     */
    static async updateExercise(exercise: FormData): Promise<ServerSideResponse<Exercise>> {
        const exerciseId = exercise.get("id");

        const response = await apiRequest<ServerSideResponse<Exercise>>(
            `/api/exercise/${exerciseId}`,
            {
                method: "PUT",
                data: exercise,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    }

    /**
     * Retrieves exercise statistics for dashboard.
     * Fetches exercises with minimal pagination to get totalCount.
     *
     * @param page - The page number to retrieve (default: 1).
     * @param pageSize - The number of exercises per page (default: 1 for statistics).
     * @param search - Optional search term to filter exercises.
     * @param exerciseType - Optional exercise type filter.
     * @returns A promise that resolves to the server response containing exercise statistics.
     */
    static async getExercises(
        page: number = 1,
        pageSize: number = 1,
        search?: string,
        exerciseType?: ExerciseType | null
    ): Promise<ServerSideResponse<GetExercisesResponse>> {
        const response = await apiRequest<ServerSideResponse<GetExercisesResponse>>(
            `/api/exercise`,
            {
                method: "GET",
                params: {
                    page,
                    pageSize,
                    ...(search && { search }),
                    ...(exerciseType && { exerciseType }),
                },
            }
        );

        return response.data;
    }
}

export default ExerciseService;
