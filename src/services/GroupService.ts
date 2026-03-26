import { apiRequest } from "@/libs/apiClient";
import { ServerSideResponse } from "@/types/Global";
import {
    CreateGroupRequest,
    InviteUserToGroupRequest,
} from "@/types/Group/Requests";
import {
    AcceptGroupInvitationResponse,
    CreateGroupResponse,
    GetGroupsResponse,
    GroupResponse,
    InviteUserToGroupResponse,
    UpdateGroupResponse,
} from "@/types/Group/Responses";
import { UpdateGroupRequest } from "../types/Group/Requests";
import { GroupInvitation } from "@/types/Group";

class GroupService {
    /**
     * Creates a new group with the specified name and members.
     *
     * @param groupName - The name of the group to create.
     * @param userRAs - Array of user academic registration numbers to add as group members.
     * @param abortSignal - Signal to abort the request if needed.
     * @returns A promise that resolves to the server response containing the created group data.
     */
    static async CreateGroup(
        groupName: string,
        userRAs: string[],
        abortSignal: AbortSignal
    ): Promise<ServerSideResponse<GroupResponse>> {
        const response = await apiRequest<
            ServerSideResponse<GroupResponse>,
            CreateGroupRequest
        >(`/api/group`, {
            method: "POST",
            data: {
                name: groupName,
                userRAs: userRAs,
            },
            signal: abortSignal,
        });

        return response.data;
    }

    /**
     * Updates an existing group with new information.
     *
     * @param groupId - The unique identifier of the group to update.
     * @param payload - The update request containing new group data and members to remove.
     * @returns A promise that resolves to the server response containing the updated group data.
     */
    static async UpdateGroup(
        groupId: number,
        payload: UpdateGroupRequest
    ): Promise<ServerSideResponse<UpdateGroupResponse>> {
        const response = await apiRequest<
            ServerSideResponse<UpdateGroupResponse>,
            UpdateGroupRequest
        >(`/api/group/${groupId}`, {
            method: "PUT",
            data: payload,
        });

        return response.data;
    }

    /**
     * Retrieves a paginated list of groups with optional search filtering.
     *
     * @param page - The page number to retrieve.
     * @param pageSize - The number of groups per page.
     * @param search - Search term to filter groups by name.
     * @param abortSignal - Signal to abort the request if needed.
     * @returns A promise that resolves to the server response containing the paginated groups.
     */
    static async GetGroupsWithSignal(
        page: number,
        pageSize: number,
        search: string,
        abortSignal: AbortSignal
    ): Promise<ServerSideResponse<GetGroupsResponse>> {
        const response = await apiRequest<
            ServerSideResponse<GetGroupsResponse>
        >(`/api/group`, {
            method: "GET",
            params: {
                page,
                pageSize,
                search,
            },
            signal: abortSignal,
        });

        return response.data;
    }

    /**
     * Sends an invitation to a user to join a specific group.
     *
     * @param request - The invitation request containing the user RA and group ID.
     * @returns A promise that resolves to the server response containing the invitation result.
     */
    static async SendGroupInvitationToUser(
        request: InviteUserToGroupRequest
    ): Promise<ServerSideResponse<InviteUserToGroupResponse>> {
        const response = await apiRequest<
            ServerSideResponse<InviteUserToGroupResponse>,
            InviteUserToGroupRequest
        >(`/api/group/invite`, {
            method: "POST",
            data: request,
        });

        return response.data;
    }

    /**
     * Retrieves all group invitations for the current user.
     *
     * @returns A promise that resolves to the server response containing an array of group invitations.
     */
    static async GetGroupInvitations(): Promise<
        ServerSideResponse<GroupInvitation[]>
    > {
        const response = await apiRequest<
            ServerSideResponse<GroupInvitation[]>
        >("/api/group/invite", {
            method: "GET",
        });

        return response.data;
    }

    /**
     * Accepts a group invitation for the current user.
     *
     * @param groupId - The unique identifier of the group invitation to accept.
     * @returns A promise that resolves to the server response confirming the acceptance.
     */
    static async AcceptGroupInvitation(groupId: number) {
        const response = await apiRequest<
            ServerSideResponse<AcceptGroupInvitationResponse>
        >(`/api/group/accept/${groupId}`, {
            method: "PUT",
        });

        return response.data;
    }

    /**
     * Retrieves detailed information about a specific group by its ID.
     *
     * @param id - The unique identifier of the group.
     * @returns A promise that resolves to the server response containing the group data.
     */
    static async getGroupById(id: number) {
        const response = await apiRequest<ServerSideResponse<GroupResponse>>(
            `/api/group/${id}`,
            {
                method: "GET",
            }
        )

        return response.data;
    }


    /**
     * Removes a specific user from a group.
     *
     * @param groupId - The unique identifier of the group.
     * @param userId - The user ID (RA) to remove from the group.
     * @returns A promise that resolves to the server response confirming the removal.
     */
    static async removeUserFromGroup(groupId: number, userId: string) {
        const response = await apiRequest<ServerSideResponse<unknown>>(
            `/api/group/${groupId}/exit/${userId}`,
            {
                method: "DELETE",
            }
        )

        return response.data;
    }

    /**
     * Deletes a group by its ID.
     *
     * @param groupId - The unique identifier of the group to delete.
     * @returns A promise that resolves to the server response confirming the deletion.
     */
    static async deleteGroup(groupId: number): Promise<ServerSideResponse<void>> {
        const response = await apiRequest<ServerSideResponse<void>>(
            `/api/group/${groupId}`,
            {
                method: "DELETE",
            }
        );

        return response.data;
    }

    /**
     * Retrieves the total count of groups for statistics.
     * Fetches only the first page with minimal data to get totalCount.
     *
     * @returns A promise that resolves to the server response with group statistics.
     */
    static async getGroups(
        page: number = 1,
        pageSize: number = 1,
        search?: string
    ): Promise<ServerSideResponse<GetGroupsResponse>> {
        const response = await apiRequest<ServerSideResponse<GetGroupsResponse>>(
            `/api/group`,
            {
                method: "GET",
                params: {
                    page,
                    pageSize,
                    ...(search && { search }),
                },
            }
        );

        return response.data;
    }
}

export default GroupService;
