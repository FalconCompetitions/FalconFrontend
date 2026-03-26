/**
 * Represents the response containing the current authentication token.
 */
export interface GetCurrentTokenResponse {
    /**
     * The current authentication token string.
     */
    currentToken: string;
}

/**
 * Represents the response containing a newly generated authentication token.
 */
export interface UpdateCurrentTokenResponse {
    /**
     * The newly generated authentication token string.
     */
    newToken: string;
}