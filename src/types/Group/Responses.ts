import { PagedResult } from "../Global";
import { GenericUserInfo } from "../User";

/**
 * Represents the response for creating a group.
 */
export interface CreateGroupResponse {
    /** The unique identifier of the group. */
    id: number;
    /** The name of the group. */
    name: string;
    /** The ID of the group leader. */
    leaderId: string;
    /** The list of users in the group. */
    users: GenericUserInfo[];
}

/**
 * Represents a group invitation response.
 */
export interface GroupInvitationResponse {
    /** The unique identifier of the invitation. */
    id: number;
    /** The user information. */
    user?: GenericUserInfo;
    /** The group information. */
    group?: GroupResponse | null;
    /** Indicates if the invitation was accepted. */
    accepted: boolean;
}

/**
 * Represents the response for a group.
 */
export interface GroupResponse {
    /** The unique identifier of the group. */
    id: number;
    /** The name of the group. */
    name: string;
    /** The ID of the group leader. */
    leaderId: string;
    /** The list of users in the group. */
    users: GenericUserInfo[];
    /** Optional list of group invitations. */
    groupInvitations?: GroupInvitationResponse[];
    /** The date of the last competition the group participated in. */
    lastCompetitionDate?: string;
}

/**
 * Represents the response for updating a group.
 */
export interface UpdateGroupResponse {
    /** The new name of the group. */
    name: string;
    /** The list of user IDs in the group. */
    userIds: string[];
}

/**
 * Represents the response for getting groups.
 */
export type GetGroupsResponse = PagedResult<GroupResponse>

/**
 * Represents the response for inviting a user to a group.
 */
export interface InviteUserToGroupResponse {
    /** The unique identifier of the invitation. */
    id: number;
    /** Indicates if the invitation was accepted. */
    accepted: boolean;
    /** The group information. */
    group: GroupResponse;
    /** The user information. */
    user: GenericUserInfo;
}

/**
 * Represents the response for accepting a group invitation.
 */
export interface AcceptGroupInvitationResponse {
    /** The unique identifier of the invitation. */
    id: number;
    /** Indicates if the invitation was accepted. */
    accepted: boolean;
    /** The ID of the group. */
    groupId: number;
    /** The ID of the user who accepted. */
    userId: string;
    /** The group information. */
    group: GroupResponse;
}