import axios from "axios";
import type { ApiRequestOptions } from "./types";

/**
 * Base URL for the API. This should be set in your environment variables.
 * @remarks It can be either `PRIVATE_API_URL` or `NEXT_PUBLIC_API_URL` depending on the access context, either server-side or client-side.
 */
const API_URL = process.env.PRIVATE_API_URL || "";

const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Ensures cookies are sent with requests
    validateStatus: () => true, // Accept all HTTP statuses
});

/**
 * Performs an API request with axios, ensuring cookies are sent with requests.
 *
 * @param url The URL to request.
 * @param options The request options.
 * @param options.method The HTTP method to use (default: "GET").
 * @param options.data The request body (if applicable).
 * @param options.headers The headers to send with the request (if applicable).
 * @param options.cookies The cookies to send with the request (if applicable).
 * @param options.params The URL query parameters (if applicable).
 *
 * @returns The response data.
 */
export async function apiRequest<T, X = unknown>(
    url: string,
    options: ApiRequestOptions<X>
) {
    const { method = "GET", data, cookies, params } = options;

    let cookieHeader: string | undefined = undefined;

    if (cookies && typeof cookies === "string") {
        cookieHeader = cookies;
    } else {
        cookieHeader = cookies
            ? Object.entries(cookies)
                  .map(([key, value]) => `${key}=${value}`)
                  .join("; ")
            : undefined;
    }

    const headers = {
        ...options.headers,
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    };

    if (!("Content-Type" in headers) || headers["Content-Type"] === undefined) {
        headers["Content-Type"] = "application/json";
    }

    return await apiClient.request<T>({
        url: url,
        method: method,
        data: data,
        params: params,
        withCredentials: true,
        fetchOptions: {
            credentials: "include",
            referrerPolicy: "origin-when-cross-origin",
        },
        headers: headers,
        signal: options.signal,
        responseType: options.responseType,
    });
}
