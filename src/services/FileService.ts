"use client";

import { apiRequest } from "@/libs/apiClient";

const PUBLIC_URL = process.env.NEXT_PUBLIC_API_URL_CUSTOM;

/**
 * Provides helpers for downloading files from the backend API.
 *
 * This service centralizes logic for requesting binary file payloads (as Blob objects)
 * and returning any relevant HTTP metadata (for example, the raw Content-Disposition header
 * which often contains the original filename or filename* data).
 *
 * The implemented methods use the shared `apiRequest` helper and request the response
 * with `responseType: "blob"`. Consumers of this service are responsible for handling
 * the returned Blob (creating Object URLs, saving to disk, reading via FileReader, etc.)
 * and for parsing the filename from the returned Content-Disposition header when needed.
 *
 * @remarks
 * - Network errors or non-success HTTP responses are propagated from the underlying
 *   `apiRequest` implementation; callers should handle or rethrow these errors.
 * - If a filename is required, parse it from the `contentDisposition` return value
 *   (supporting both `filename*` and `filename` parameters and appropriate decoding).
 * - This class contains only static helpers and does not maintain instance state.
 *
 * @example
 * // Download a file and trigger a browser download
 * const { blob, contentDisposition } = await FileService.downloadFile(123);
 * const url = URL.createObjectURL(blob);
 * const filename = parseFilenameFromContentDisposition(contentDisposition) ?? "download";
 * triggerBrowserDownload(url, filename);
 *
 */
class FileService {
    /**
     * Downloads a file from the API and returns the file data as a Blob together with the raw
     * "Content-Disposition" response header value.
     *
     * @param fileId - The numeric identifier of the file to download.
     * @returns A Promise that resolves to an object containing:
     *  - blob: the file data as a Blob,
     *  - contentDisposition: the raw value of the "Content-Disposition" response header (may be an empty string or undefined if the header is absent).
     *
     * @remarks
     * - The HTTP request is performed with responseType "blob". Consumers are responsible for handling the Blob
     *   (for example, creating an object URL, saving to disk, or reading via FileReader).
     * - If you need a filename, parse it from the contentDisposition value (e.g., parsing the filename* or filename parameter).
     * - Errors from the underlying request (network failures or non-success status codes) will propagate from the underlying apiRequest implementation.
     *
     * @throws Will rethrow errors produced by the underlying apiRequest call.
     *
     * @example
     * const { blob, contentDisposition } = await FileService.downloadFile(123);
     * const url = URL.createObjectURL(blob);
     * // parse filename from contentDisposition or fallback to a default
     * const filename = parseFilenameFromContentDisposition(contentDisposition) ?? "download";
     * triggerBrowserDownload(url, filename);
     */
    static async downloadFile(fileId: number, token: string): Promise<{
        blob: Blob;
        contentDisposition: string;
    }> {
        const response = await apiRequest<Blob>(
            `${PUBLIC_URL}/api/File/${fileId}`,
            {
                method: "GET",
                responseType: "blob",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*"
                }
            }
        );

        // Axios returns headers as an object, not a Map with .get()
        const contentDisposition: string = 
            response.headers?.["content-disposition"] || 
            response.headers?.["Content-Disposition"] || 
            "";

        return {
            blob: response.data,
            contentDisposition: contentDisposition,
        };
    }
}

export default FileService;
