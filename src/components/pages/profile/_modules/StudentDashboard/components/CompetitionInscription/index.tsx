"use client";

import type React from "react";
import { useMemo } from "react";
import {
    Users,
    Calendar,
    Trophy,
    UserPlus,
    Clock,
    AlertCircle,
    CalendarX,
} from "lucide-react";
import CustomDropdown from "@/components/_ui/Dropdown";
import type { DropdownOption } from "@/components/_ui/Dropdown/types";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/_ui/Card";
import Input from "@/components/_ui/Input";
import Label from "@/components/_ui/Label";
import { Badge } from "@/components/_ui/Badge";
import { useInscriptionForm } from "./hooks/useInscriptionForm";
import { SuccessModal } from "@/components/_ui/SuccessModal";
import { Skeleton } from "@mui/material";
import Button from "@/components/_ui/Button";

const CompetitionInscription: React.FC<{
    toggleMenu: (menu: "dashboard" | "inscription") => void;
}> = ({ toggleMenu }) => {
    const {
        competitionName,
        quantityStudents,
        members,
        initialRegistration,
        registrationEnd,
        maxMembers,
        groupName,
        handleSubmit,
        isFormValid,
        groupExists,
        groupSizeError,
        isSuccess,
        setIsSuccess,
        isInscriptionsOpen,
        isSubCompetitionsLoading,
        hasCompetitions,
        openSubCompetitions,
        selectedCompetitionId,
        selectCompetition,
    } = useInscriptionForm(toggleMenu);

    const competitionOptions: DropdownOption[] = useMemo(() => {
        return openSubCompetitions.map(comp => ({
            value: comp.id,
            label: comp.name,
        }));
    }, [openSubCompetitions]);

    const readOnlyInputStyle =
        "mt-2 text-lg p-4 bg-slate-50 cursor-not-allowed border-slate-200";

    const readOnlyMemberInputStyle =
        "mt-2 text-base p-4 pl-12 bg-slate-50 cursor-not-allowed border-slate-200";

    return (
        <div>
            <div className="bg-white border-b border-slate-200 px-8 py-10 shadow-sm">
                <div className="max-w-none">
                    <div className={`flex items-center gap-4 mb-4`}>
                        <div className="w-12 h-12 bg-[#4F85A6]/10 rounded-full flex items-center justify-center">
                            <UserPlus className="h-6 w-6 text-[#4F85A6]" />
                        </div>
                        <div>
                            {isSubCompetitionsLoading ? (
                                <Skeleton
                                    variant="text"
                                    width={300}
                                    height={40}
                                />
                            ) : (
                                <h1 className="text-5xl font-bold text-slate-900">
                                    Inscrição na Maratona
                                </h1>
                            )}

                            {isSubCompetitionsLoading ? (
                                <Skeleton
                                    variant="text"
                                    width={400}
                                    height={30}
                                />
                            ) : (
                                <p className="text-xl text-slate-600 mt-2">
                                    Registre sua equipe para a competição
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-6">
                        {isSubCompetitionsLoading ? (
                            <>
                                <Skeleton
                                    variant="rounded"
                                    width={160}
                                    height={40}
                                />
                                <Skeleton
                                    variant="rounded"
                                    width={160}
                                    height={40}
                                />
                            </>
                        ) : hasCompetitions ? (
                            <>
                                {isInscriptionsOpen ? (
                                    <Badge className="border-transparent bg-green-100 text-green-800 text-xl px-5 py-2 hover:bg-green-100 hover:text-green-800">
                                        <Clock className="h-4 w-4 mr-2" />
                                        Inscrições Abertas
                                    </Badge>
                                ) : (
                                    <Badge className="border-transparent bg-red-100 text-red-800 text-xl px-5 py-2 hover:bg-red-100 hover:text-red-800">
                                        <CalendarX className="h-4 w-4 mr-2" />
                                        Inscrições Encerradas
                                    </Badge>
                                )}
                                {registrationEnd && (
                                    <span className="text-slate-600 text-xl">
                                        Prazo até: {registrationEnd}
                                    </span>
                                )}
                            </>
                        ) : null}
                    </div>
                </div>
            </div>

            <main className="px-0 py-10">
                <div className="max-w-screen-xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50">
                                <CardHeader className="bg-gradient-to-r from-[#4F85A6]/5 to-[#3C6B88]/5 rounded-t-lg pb-8">
                                    <CardTitle className="text-3xl text-[#4F85A6] flex items-center gap-4">
                                        <Trophy className="h-7 w-7" />
                                        Informações da Competição
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-10 space-y-6">
                                    {!hasCompetitions && !isSubCompetitionsLoading && (
                                        <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-300 text-yellow-900 rounded-lg text-lg">
                                            <AlertCircle className="h-6 w-6 text-yellow-700 flex-shrink-0 mt-1" />
                                            <div>
                                                <p className="font-semibold">
                                                    Nenhuma competição disponível
                                                </p>
                                                <p className="mt-1">
                                                    Não há competições com inscrições abertas no momento.
                                                    Aguarde novas competições serem criadas.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-rows-1 lg:grid-rows-2 gap-6">
                                        <div className="lg:col-span-2">
                                            <Label
                                                htmlFor="competition-name"
                                                className="text-xl font-medium text-slate-700"
                                            >
                                                {openSubCompetitions.length > 1 ? "Selecione a Maratona:" : "Nome da Maratona:"}
                                            </Label>
                                            {isSubCompetitionsLoading ? (
                                                <Skeleton
                                                    variant="rectangular"
                                                    width={"100%"}
                                                    height={56}
                                                    className="mt-2"
                                                />
                                            ) : openSubCompetitions.length > 1 ? (
                                                <CustomDropdown
                                                    options={competitionOptions}
                                                    onChange={(val: string | number | null) => {
                                                        if (val == null) return;
                                                        selectCompetition(Number(val));
                                                    }}
                                                    value={selectedCompetitionId}
                                                    disabled={isSubCompetitionsLoading || !hasCompetitions}
                                                    type="normalDropdown"
                                                    grow={true}
                                                    className="mt-2"
                                                />
                                            ) : (
                                                <Input
                                                    id="competition-name"
                                                    name="competition-name"
                                                    type="text"
                                                    value={competitionName || "Nenhuma competição disponível"}
                                                    readOnly
                                                    className="mt-2 text-xl p-4 bg-slate-50 cursor-not-allowed border-slate-200"
                                                />
                                            )}
                                        </div>

                                        <div className="flex flex-row items-center">
                                            <Label className="text-xl font-medium text-slate-700">
                                                Máximo de Membros:
                                            </Label>
                                            <div className="ml-4 mt-2 py-2 px-4  flex items-center justify-center bg-slate-50 rounded-lg border border-slate-200 w-fit">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Users className="h-5 w-5 flex-shrink-0 text-[#4F85A6]" />
                                                    {isSubCompetitionsLoading ? (
                                                        <Skeleton
                                                            variant="rounded"
                                                            width={80}
                                                            height={32}
                                                        />
                                                    ) : hasCompetitions && maxMembers ? (
                                                        <span className="text-xl font-semibold text-slate-900 whitespace-nowrap">
                                                            {maxMembers} membros
                                                        </span>
                                                    ) : (
                                                        <span className="text-xl font-semibold text-slate-500 whitespace-nowrap">
                                                            N/A
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6">
                                        {hasCompetitions && (
                                            <>
                                                <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <Calendar className="h-5 w-5 text-blue-600" />
                                                        <span className="font-medium text-slate-700 text-xl">
                                                            Início das Inscrições
                                                        </span>
                                                    </div>
                                                    {isSubCompetitionsLoading ? (
                                                        <Skeleton
                                                            variant="rounded"
                                                            width={"100%"}
                                                            height={32}
                                                        />
                                                    ) : (
                                                        <p className="text-xl font-semibold text-slate-900">
                                                            {initialRegistration || "N/A"}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="p-4 rounded-lg bg-gradient-to-r from-red-50 to-pink-50 border border-red-100">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <Calendar className="h-5 w-5 text-red-600" />
                                                        <span className="text-xl text-slate-700 ">
                                                            Fim das Inscrições
                                                        </span>
                                                    </div>
                                                    {isSubCompetitionsLoading ? (
                                                        <Skeleton
                                                            variant="rounded"
                                                            width={"100%"}
                                                            height={32}
                                                        />
                                                    ) : (
                                                        <p className="text-xl font-semibold text-slate-900">
                                                            {registrationEnd || "N/A"}
                                                        </p>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50">
                                <CardHeader className="bg-gradient-to-r from-[#4F85A6]/5 to-[#3C6B88]/5 rounded-t-lg pb-8">
                                    <CardTitle className="text-3xl text-[#4F85A6] flex items-center gap-4">
                                        <Users className="h-7 w-7" />
                                        Informações da Equipe
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="p-10 space-y-8">
                                    {!groupExists ? (
                                        <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-300 text-yellow-900 rounded-lg text-lg">
                                            <AlertCircle className="h-6 w-6 text-yellow-700 flex-shrink-0 mt-1" />
                                            <p>
                                                <span className="font-semibold">
                                                    Você ainda não possui um
                                                    grupo.
                                                </span>
                                                <br />
                                                Para se inscrever, você precisa
                                                primeiro criar um grupo no seu{" "}
                                                <span
                                                    onClick={() => {
                                                        window.scroll({
                                                            behavior: "instant",
                                                            top: 0
                                                        })
                                                        toggleMenu("dashboard");
                                                    }}
                                                    className="underline cursor-pointer font-medium hover:text-yellow-950"
                                                >
                                                    perfil
                                                </span>
                                                .
                                            </p>
                                        </div>
                                    ) : groupSizeError ? (
                                        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-lg">
                                            <AlertCircle className="h-6 w-6 text-red-700 flex-shrink-0 mt-1" />
                                            <p>
                                                Seu grupo tem {quantityStudents}{" "}
                                                {quantityStudents === 1
                                                    ? "membro"
                                                    : "membros"}
                                                . O máximo permitido para esta
                                                maratona é {maxMembers}.
                                                <br />
                                                <span className="font-semibold">
                                                    Por favor, altere seu grupo
                                                    no seu perfil para poder se
                                                    inscrever.
                                                </span>
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div>
                                                <Label
                                                    htmlFor="group-name"
                                                    className="text-xl font-medium text-slate-700"
                                                >
                                                    Nome do Grupo
                                                </Label>
                                                <Input
                                                    id="group-name"
                                                    name="group-name"
                                                    type="text"
                                                    value={groupName || ""}
                                                    className={
                                                        readOnlyInputStyle
                                                    }
                                                    readOnly
                                                />
                                            </div>

                                            <div>
                                                <Label className="text-xl font-medium text-slate-700">
                                                    Quantidade de Alunos
                                                </Label>
                                                <Input
                                                    name="membersQte"
                                                    type="text"
                                                    value={`${quantityStudents} ${
                                                        quantityStudents === 1
                                                            ? "membro"
                                                            : "membros"
                                                    }`}
                                                    className={
                                                        readOnlyInputStyle
                                                    }
                                                    readOnly
                                                />
                                            </div>

                                            <div className="space-y-6">
                                                <div className="flex items-center gap-3">
                                                    <Users className="h-6 w-6 text-[#4F85A6]" />
                                                    <h3 className="text-2xl font-semibold text-slate-900">
                                                        Membros da Equipe
                                                    </h3>
                                                </div>

                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    {members?.map(
                                                        (member, index) => (
                                                            <div
                                                                key={index}
                                                                className="space-y-2"
                                                            >
                                                                <Label
                                                                    htmlFor={`member-${index}`}
                                                                    className="text-xl font-medium text-slate-700"
                                                                >
                                                                    {index === 0
                                                                        ? "Líder da Equipe"
                                                                        : `Integrante ${
                                                                              index +
                                                                              1
                                                                          }`}
                                                                </Label>
                                                                <div className="relative">
                                                                    <Input
                                                                        id={`member-${index}`}
                                                                        name={`member-${index}`}
                                                                        type="text"
                                                                        value={
                                                                            member
                                                                        }
                                                                        className={
                                                                            readOnlyMemberInputStyle
                                                                        }
                                                                        readOnly
                                                                    />
                                                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                                                        {index ===
                                                                        0 ? (
                                                                            <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                                                                                <span className="text-yellow-600 text-xs font-bold">
                                                                                    L
                                                                                </span>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                                                                <span className="text-blue-600 text-xs font-bold">
                                                                                    {index +
                                                                                        1}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex justify-center pt-6">
                            <Button
                                type="submit"
                                className="bg-[#4F85A6] hover:bg-[#3C6B88] text-white text-xl px-12 py-5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!isFormValid || isSubCompetitionsLoading}
                            >
                                <UserPlus className="h-5 w-5 mr-3" />
                                Inscrever Equipe
                            </Button>
                        </div>
                    </form>
                </div>
            </main>

            <SuccessModal
                open={isSuccess}
                onClose={() => {
                    setIsSuccess(false);
                    toggleMenu("dashboard");
                }}
                title="Inscrição Realizada!"
                message="Equipe inscrita com sucesso!"
            />
        </div>
    );
};

export default CompetitionInscription;