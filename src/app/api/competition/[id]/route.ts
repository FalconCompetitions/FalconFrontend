import { apiRequest } from "@/libs/apiClient";
import { UpdateCompetitionRequest } from "@/types/Competition/Requests";
import { UpdateCompetitionResponse } from "@/types/Competition/Responses";
import { CompetitionDetail } from "@/types/Competition";
import { ServerSideResponse } from "@/types/Global";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const id = parseInt((await context.params).id);
    let res;
    try {
        res = await apiRequest<CompetitionDetail>(`/Competition/${id}`, {
            method: "GET",
            cookies: req.cookies.toString(),
        });
    } catch {
        return NextResponse.json(
            { message: "Erro ao buscar competição.", status: 500 },
            { status: 500 }
        );
    }
    return NextResponse.json(
        {
            data: res.data,
            status: res.status,
        } satisfies ServerSideResponse<CompetitionDetail>,
        { status: res.status }
    );
}

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const id = parseInt((await context.params).id);

    const body = (await req.json()) as UpdateCompetitionRequest;
    let res;
    try {
        res = await apiRequest<UpdateCompetitionResponse>(
            `/Competition/${id}`,
            {
                method: "PUT",
                data: body,
                cookies: req.cookies.toString(),
            }
        );
    } catch {
        return NextResponse.json(
            { message: "Erro ao atualizar competição.", status: 500 },
            { status: 500 }
        );
    }
    return NextResponse.json(
        {
            data: res.data,
            status: res.status,
        } satisfies ServerSideResponse<UpdateCompetitionResponse>,
        { status: res.status }
    );
}
