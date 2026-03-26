import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Converts a number representing seconds into a time span string formatted as "HH:mm:ss".
 *
 * @param value - The number of seconds to convert.
 * @returns A string representing the time span in "HH:mm:ss" format, with each unit padded to two digits.
 *
 * @example
 * ```typescript
 * convertNumberToTimeSpan(3661); // "01:01:01"
 * ```
 */
export const convertNumberToTimeSpan = (value: number) => {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = value % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export const convertTimeSpanToNumber = (timeSpan: string) => {
    const [hours, minutes, seconds] = timeSpan.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
};

/**
 * Formata uma data ISO (UTC) para formato brasileiro sem conversão de timezone.
 * Útil para competições locais onde queremos que o horário digitado seja o horário exibido.
 * 
 * @param isoDateString - String de data em formato ISO (ex: "2025-11-22T21:00:00.000Z")
 * @returns String formatada em pt-BR (ex: "22/11/2025, 21:00") sem conversão de timezone
 * 
 * @example
 * ```typescript
 * formatDateWithoutTimezone("2025-11-22T21:00:00.000Z"); // "22/11/2025, 21:00"
 * ```
 */
export const formatDateWithoutTimezone = (isoDateString: string): string => {
    // Extrair componentes da data diretamente da string ISO
    const datePart = isoDateString.split('T')[0]; // "2025-11-22"
    const timePart = isoDateString.split('T')[1]?.split('.')[0] || isoDateString.split('T')[1]?.split('Z')[0]; // "21:00:00"
    
    if (!datePart || !timePart) return "Data inválida";
    
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    
    // Formatar no padrão brasileiro DD/MM/YYYY, HH:MM
    return `${day}/${month}/${year}, ${hour}:${minute}`;
};

/**
 * Formata apenas a data (sem hora) de uma string ISO sem conversão de timezone.
 * 
 * @param isoDateString - String de data em formato ISO
 * @returns String formatada como DD/MM/YYYY
 */
export const formatDateOnlyWithoutTimezone = (isoDateString: string): string => {
    const datePart = isoDateString.split('T')[0];
    if (!datePart) return "Data inválida";
    
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;
};

/**
 * Parses a date string in the format "YYYY-MM-DD" and returns a Date object.
 *
 * @param dateStr - The date string to parse, expected in "YYYY-MM-DD" format.
 * @returns A Date object representing the parsed date, or `null` if the input is invalid.
 */
export const parseDate = (dateStr: string): Date | null => {
    const [year, month, day] = dateStr.split("-");
    console.log(year, month, day);
    if (!day || !month || !year) return null;

    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
};

/**
 * Converts a UTF-8 string to its Base64-encoded representation.
 *
 * @param str - The input string to encode.
 * @returns The Base64-encoded string.
 */
export const toBase64 = (str: string): string => {
    return Buffer.from(str, "utf-8").toString("base64");
};

/**
 * Decodes a Base64-encoded string into a UTF-8 string.
 *
 * @param base64 - The Base64-encoded string to decode.
 * @returns The decoded UTF-8 string.
 */
export const fromBase64 = (base64: string): string => {
    return Buffer.from(base64, "base64").toString("utf-8");
};

/**
 * Initiates a browser download for the provided Blob, attempting to derive a filename
 * from a Content-Disposition header when available.
 *
 * The function:
 * - Uses `fileId` to generate a fallback filename of the form `file_<fileId>`.
 * - If `contentDisposition` is provided, attempts to parse a filename using either:
 *   - the RFC 5987 `filename*` form with UTF-8 percent-encoding (e.g. `filename*=UTF-8''...`),
 *   - or the basic `filename="..."` form.
 *   If a `filename*` value is present it will be decoded via `decodeURIComponent`.
 * - Creates an object URL via `URL.createObjectURL(blob)`, creates a temporary `<a>` element,
 *   sets its `href` and `download` attributes, appends it to the document, programmatically
 *   clicks it to start the download, removes the element, and finally revokes the object URL.
 *
 * Remarks:
 * - This function must run in a browser environment (access to `document` and `window.URL`).
 * - The Content-Disposition parsing uses simple regular expressions and may not handle
 *   every edge case of the header; provide a sanitized or normalized header when possible.
 * - The function has visible side effects (modifies the DOM temporarily and triggers a file download).
 *
 * @param fileId - Numeric identifier used to construct a fallback filename when no filename
 *                 can be extracted from `contentDisposition`.
 * @param blob - The Blob (or File) instance containing the data to be downloaded.
 * @param contentDisposition - Optional value of a `Content-Disposition` HTTP header. If present,
 *                             the function will attempt to extract a filename from it. Supported
 *                             patterns include `filename*=UTF-8''...` and `filename="..."`.
 * @returns void
 *
 * @example
 * // Download a plain text blob, preferring any filename found in the header:
 * // downloadBlobFile(42, new Blob(['hello world'], { type: 'text/plain' }), 'attachment; filename="greeting.txt"');
 */
export const downloadBlobFile = (
    fileId: number,
    blob: Blob,
    contentDisposition: string
) => {
    let fileName = `file_${fileId}`;
    if (contentDisposition) {
        const filenameStarMatch = contentDisposition.match(
            /filename\*\s*=\s*UTF-8''([^;\n]+)/
        );
        if (filenameStarMatch && filenameStarMatch[1]) {
            fileName = decodeURIComponent(filenameStarMatch[1]);
        } else {
            const filenameMatch = contentDisposition.match(
                /filename="?([^";\n]+)"?/
            );
            if (filenameMatch && filenameMatch[1]) {
                fileName = filenameMatch[1];
            }
        }
    }

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
};
