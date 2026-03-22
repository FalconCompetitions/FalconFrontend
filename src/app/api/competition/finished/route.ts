import { apiRequest } from "@/libs/apiClient";
import { Competition } from "@/types/Competition";
import { ServerSideResponse } from "@/types/Global";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    let res;
    try {
        res = await apiRequest<Competition[]>("/Competition/finished", {
            method: "GET",
            cookies: req.cookies.toString(),
        });
    } catch {
        return NextResponse.json(
            { message: "Erro ao buscar competições finalizadas.", status: 500 },
            { status: 500 }
        );
    }
    return NextResponse.json(
        {
            data: res.data,
            status: res.status,
        } satisfies ServerSideResponse<Competition[]>,
        { status: res.status }
    );
}
