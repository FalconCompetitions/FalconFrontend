"use client";

import type React from "react";
import { Trophy, Users, Calendar, CheckCircle, FileText, AlertCircle } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/_ui/Card";
import Input from "@/components/_ui/Input";
import { ButtonAdm } from "@/components/_ui/ButtonAdm";
import { Badge } from "@/components/_ui/Badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/_ui/Select";

import { useCompetitionForm } from "./hooks/useCreateSubscription";

const CreateCompetitionSubscription: React.FC = () => {
    const {
        name,
        setName,
        description,
        setDescription,
        maxMembers,
        setMaxMembers,
        initialDate,
        setInitialDate,
        initialDateTime,
        setInitialDateTime,
        initialRegistration,
        setInitialRegistration,
        initialRegistrationTime,
        setInitialRegistrationTime,
        endRegistration,
        setEndRegistration,
        endRegistrationTime,
        setEndRegistrationTime,
        handleSubmit,
        isFormValid,
        isStartAfterEnd,
        isEndAfterMarathon
    } = useCompetitionForm();

    const formatDateTime = (date: string, time: string) => {
        if (!date || !time) return "Incompleto";
        try {
            // Formatar sem conversão de timezone
            const [year, month, day] = date.split('-');
            return `${day}/${month}/${year}, ${time}`;
        } catch {
            return "Data inválida";
        }
    };

    return (
        <div className="flex">
            <div className="flex-1">
                <div className="container mx-auto p-8 space-y-12">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-5xl font-bold text-[#3f3c40] flex items-center gap-6">
                                <Trophy className="h-16 w-auto text-[#4F85A6]" />
                                Modelo de Inscrição
                            </h1>
                            <p className="text-xl text-[#4F85A6] mt-4">
                                Configure as inscrições para a maratona de programação
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-12">
                            
                            <Card className="bg-white border-[#e9edee] shadow-sm">
                                <CardHeader className="pb-8">
                                    <CardTitle className="text-3xl text-[#3f3c40] flex items-center gap-4">
                                        <FileText className="h-8 w-8 text-[#4F85A6]" />
                                        Informações da Maratona
                                    </CardTitle>
                                    <CardDescription className="text-xl text-[#4F85A6] mt-2">
                                        Configure os dados principais da competição
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    <div>
                                        <label className="block text-xl font-medium text-[#3f3c40] mb-4">
                                            Nome da Maratona
                                        </label>
                                        <Input
                                            name="competitionName"
                                            type="text"
                                            placeholder="Ex: XII Olimpíada de Raciocínio Lógico"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="border-[#e9edee] focus:border-[#4F85A6] focus:ring-[#4F85A6] text-xl h-16 px-6"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xl font-medium text-[#3f3c40] mb-4">
                                            Descrição
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Descreva os objetivos e características da maratona..."
                                            className="w-full min-h-32 border border-[#e9edee] rounded-md px-6 py-4 text-xl text-[#3f3c40] focus:border-[#4F85A6] focus:ring-2 focus:ring-[#4F85A6] focus:ring-offset-2 resize-none"
                                            required
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-[#e9edee] shadow-sm">
                                <CardHeader className="pb-8">
                                    <CardTitle className="text-3xl text-[#3f3c40] flex items-center gap-4">
                                        <Users className="h-8 w-8 text-[#4F85A6]" />
                                        Configuração de Equipes
                                    </CardTitle>
                                    <CardDescription className="text-xl text-[#4F85A6] mt-2">
                                        Defina as regras para formação de grupos
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    <div>
                                        <label className="block text-xl font-medium text-[#3f3c40] mb-4">
                                            Número Máximo de Integrantes por Grupo
                                        </label>
                                        <Select value={maxMembers} onValueChange={setMaxMembers}>
                                            <SelectTrigger className="w-full border-[#e9edee] focus:border-[#4F85A6] focus:ring-[#4F85A6] text-xl h-16 px-6">
                                                <SelectValue placeholder="Selecione o número máximo" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-[#e9edee]">
                                                {[1, 2, 3].map((num) => (
                                                    <SelectItem
                                                        key={num}
                                                        value={num.toString()}
                                                        className="text-lg"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <Users className="h-4 w-4 text-[#4F85A6]" />
                                                            {num} {num === 1 ? "integrante" : "integrantes"}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-[#e9edee] shadow-sm">
                                <CardHeader className="pb-8">
                                    <CardTitle className="text-3xl text-[#3f3c40] flex items-center gap-4">
                                        <Calendar className="h-8 w-8 text-[#4F85A6]" />
                                        Configuração de Datas
                                    </CardTitle>
                                    <CardDescription className="text-xl text-[#4F85A6] mt-2">
                                        Defina o cronograma da competição
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-xl font-medium text-[#3f3c40] mb-4">
                                                Início das Inscrições
                                            </label>
                                            <div className="flex gap-4">
                                                <Input
                                                    name="initialRegistration"
                                                    type="date"
                                                    value={initialRegistration}
                                                    onChange={(e) => setInitialRegistration(e.target.value)}
                                                    className="flex-1 border-[#e9edee] focus:border-[#4F85A6] focus:ring-[#4F85A6] text-xl h-16 px-6"
                                                    required
                                                />
                                                <Input
                                                    name="initialRegistrationTime"
                                                    type="time"
                                                    value={initialRegistrationTime}
                                                    onChange={(e) => setInitialRegistrationTime(e.target.value)}
                                                    className="w-36 border-[#e9edee] focus:border-[#4F85A6] focus:ring-[#4F85A6] text-xl h-16 px-4 text-center"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xl font-medium text-[#3f3c40] mb-4">
                                                Fim das Inscrições
                                            </label>
                                            <div className="flex gap-4">
                                                <Input
                                                    name="endRegistration"
                                                    type="date"
                                                    value={endRegistration}
                                                    onChange={(e) => setEndRegistration(e.target.value)}
                                                    className="flex-1 border-[#e9edee] focus:border-[#4F85A6] focus:ring-[#4F85A6] text-xl h-16 px-6"
                                                    required
                                                />
                                                <Input
                                                    name="endRegistrationTime"
                                                    type="time"
                                                    value={endRegistrationTime}
                                                    onChange={(e) => setEndRegistrationTime(e.target.value)}
                                                    className="w-36 border-[#e9edee] focus:border-[#4F85A6] focus:ring-[#4F85A6] text-xl h-16 px-4 text-center"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {isStartAfterEnd && (
                                        <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-center justify-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
                                            <AlertCircle className="h-5 w-5" />
                                            <span className="text-base font-medium">
                                                Erro: O início das inscrições não pode ser posterior ao fim.
                                            </span>
                                        </div>
                                    )}

                                    <div className="border-t border-[#e9edee] my-4"></div>

                                    <div>
                                        <label className="block text-xl font-medium text-[#3f3c40] mb-4 text-center">
                                            Data e Horário da Maratona
                                        </label>
                                        <div className="flex justify-center gap-4">
                                            <Input
                                                name="initialDate"
                                                type="date"
                                                value={initialDate}
                                                onChange={(e) => setInitialDate(e.target.value)}
                                                className="w-1/2 border-[#e9edee] focus:border-[#4F85A6] focus:ring-[#4F85A6] text-xl h-16 px-6"
                                                required
                                            />
                                            <Input
                                                name="initialDateTime"
                                                type="time"
                                                value={initialDateTime}
                                                onChange={(e) => setInitialDateTime(e.target.value)}
                                                className="w-36 border-[#e9edee] focus:border-[#4F85A6] focus:ring-[#4F85A6] text-xl h-16 px-4 text-center"
                                                required
                                            />
                                        </div>

                                        {isEndAfterMarathon && (
                                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center justify-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
                                                <AlertCircle className="h-5 w-5" />
                                                <span className="text-base font-medium">
                                                    Erro: As inscrições devem terminar antes do início da maratona.
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-12">
                            <Card className="bg-white border-[#e9edee] shadow-sm sticky top-6">
                                <CardHeader className="pb-8">
                                    <CardTitle className="text-2xl text-[#3f3c40]">
                                        Resumo da Configuração
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg text-[#4F85A6]">Nome:</span>
                                            <span className="text-lg text-[#3f3c40] font-medium">
                                                {name || "Não definido"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-lg text-[#4F85A6]">Max. Integrantes:</span>
                                            <Badge
                                                variant="outline"
                                                className="border-[#9abbd6] text-[#4F85A6] bg-[#9abbd6]/10 text-lg px-4 py-2"
                                            >
                                                {maxMembers} {Number(maxMembers) === 1 ? "pessoa" : "pessoas"}
                                            </Badge>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-lg text-[#4F85A6]">Data da Maratona:</span>
                                            <span className="text-lg text-[#3f3c40] font-medium">
                                                {formatDateTime(initialDate, initialDateTime)}
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg text-[#4F85A6]">Inscrições:</span>
                                            </div>
                                            <div className="text-sm text-[#3f3c40] space-y-2 pl-2 border-l-2 border-[#e9edee]">
                                                <div>
                                                    <span className="block text-[#4F85A6] text-xs">INÍCIO</span>
                                                    <span className="text-base font-medium">
                                                        {formatDateTime(initialRegistration, initialRegistrationTime)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="block text-[#4F85A6] text-xs">FIM</span>
                                                    <span className="text-base font-medium">
                                                        {formatDateTime(endRegistration, endRegistrationTime)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-[#e9edee]">
                                        <ButtonAdm
                                            onClick={handleSubmit}
                                            disabled={!isFormValid}
                                            className="w-full bg-[#4F85A6] hover:bg-[#3f3c40] text-white disabled:opacity-50 disabled:cursor-not-allowed text-xl h-16"
                                        >
                                            <CheckCircle className="w-6 h-6 mr-3" />
                                            Liberar Inscrição
                                        </ButtonAdm>
                                    </div>

                                    {!isFormValid && (
                                        <div className="text-lg text-[#4F85A6] space-y-3">
                                            <p>Para liberar as inscrições, complete:</p>
                                            <ul className="list-disc list-inside space-y-2 ml-4 text-base">
                                                {!name && <li>Nome da maratona</li>}
                                                {!description && <li>Descrição</li>}
                                                {!initialDate && <li>Data da maratona</li>}
                                                {!initialDateTime && <li>Horário da maratona</li>}
                                                {!initialRegistration && <li>Data de início das inscrições</li>}
                                                {!initialRegistrationTime && <li>Horário de início das inscrições</li>}
                                                {!endRegistration && <li>Data de fim das inscrições</li>}
                                                {!endRegistrationTime && <li>Horário de fim das inscrições</li>}
                                                
                                                {/* SÍMBOLOS > CORRIGIDOS PARA &gt; */}
                                                {isStartAfterEnd && <li className="text-red-500 font-bold">Início &gt; Fim Inscrição</li>}
                                                {isEndAfterMarathon && <li className="text-red-500 font-bold">Fim Inscrição &gt; Maratona</li>}
                                            </ul>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCompetitionSubscription;