"use client";

import type React from "react";
import { useState, useMemo, useCallback } from "react";
import { useCompetition } from "@/contexts/CompetitionContext";
import { CreateCompetitionRequest } from "@/types/Competition/Requests";

export const useCompetitionForm = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [maxMembers, setMaxMembers] = useState("3");

    const [initialDate, setInitialDate] = useState("");
    const [initialDateTime, setInitialDateTime] = useState("");

    const [initialRegistration, setInitialRegistration] = useState("");
    const [initialRegistrationTime, setInitialRegistrationTime] = useState("");

    const [endRegistration, setEndRegistration] = useState("");
    const [endRegistrationTime, setEndRegistrationTime] = useState("");

    const [status, setStatus] = useState("Fechado");

    const { createCompetition } = useCompetition();

    const isStartAfterEnd = useMemo(() => {
        if (
            !initialRegistration ||
            !initialRegistrationTime ||
            !endRegistration ||
            !endRegistrationTime
        ) {
            return false;
        }
        const start = new Date(
            `${initialRegistration}T${initialRegistrationTime}`
        );
        const end = new Date(`${endRegistration}T${endRegistrationTime}`);
        return start > end;
    }, [
        initialRegistration,
        initialRegistrationTime,
        endRegistration,
        endRegistrationTime,
    ]);

    const isEndAfterMarathon = useMemo(() => {
        if (
            !endRegistration ||
            !endRegistrationTime ||
            !initialDate ||
            !initialDateTime
        ) {
            return false;
        }
        const end = new Date(`${endRegistration}T${endRegistrationTime}`);
        const marathon = new Date(`${initialDate}T${initialDateTime}`);
        return end > marathon;
    }, [endRegistration, endRegistrationTime, initialDate, initialDateTime]);

    const hasDateErrors = isStartAfterEnd || isEndAfterMarathon;

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            if (hasDateErrors) return;

            try {
                // Criar Dates no horário local e converter para UTC
                const startTimeLocal = new Date(`${initialDate}T${initialDateTime}:00`);
                const startInscriptionsLocal = new Date(`${initialRegistration}T${initialRegistrationTime}:00`);
                const endInscriptionsLocal = new Date(`${endRegistration}T${endRegistrationTime}:00`);

                console.group("🔍 DEBUG - CreateSubscription");
                console.log("📅 Input do usuário (LOCAL):");
                console.log(`   startTime: ${initialDate} ${initialDateTime}`);
                console.log(`   Date object: ${startTimeLocal.toString()}`);
                console.log(`   Timezone offset: ${startTimeLocal.getTimezoneOffset()} minutos`);
                console.log("\n📤 Enviando para backend (UTC):");
                
                const startTimeISO = startTimeLocal.toISOString();
                const startInscriptionsISO = startInscriptionsLocal.toISOString();
                const endInscriptionsISO = endInscriptionsLocal.toISOString();
                
                console.log(`   startTime: ${startTimeISO}`);
                console.log(`   startInscriptions: ${startInscriptionsISO}`);
                console.log(`   endInscriptions: ${endInscriptionsISO}`);
                console.groupEnd();

                const dataCompetition: CreateCompetitionRequest = {
                    name,
                    description,
                    maxMembers: Number(maxMembers),
                    startTime: startTimeISO,
                    startInscriptions: startInscriptionsISO,
                    endInscriptions: endInscriptionsISO,
                    duration: "01:30:00",
                    stopRanking: "01:20:00",
                    submissionPenalty: "00:20:00",
                    maxExercises: null,
                    maxSubmissionSize: 20,
                    exerciseIds: [],
                    blockSubmissions: "01:25:00",
                };

                await createCompetition(dataCompetition);
            } catch (error) {
                console.log(error);
            }
        },
        [
            name,
            description,
            maxMembers,
            initialDate,
            initialDateTime,
            initialRegistration,
            initialRegistrationTime,
            endRegistration,
            endRegistrationTime,
            createCompetition,
            hasDateErrors,
        ]
    );

    const isFormValid = useMemo(() => {
        return (
            name &&
            description &&
            initialDate &&
            initialDateTime &&
            initialRegistration &&
            initialRegistrationTime &&
            endRegistration &&
            endRegistrationTime &&
            !hasDateErrors
        );
    }, [
        name,
        description,
        initialDate,
        initialDateTime,
        initialRegistration,
        initialRegistrationTime,
        endRegistration,
        endRegistrationTime,
        hasDateErrors,
    ]);

    return {
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
        status,
        setStatus,
        handleSubmit,
        isFormValid,
        isStartAfterEnd,
        isEndAfterMarathon,
    };
};
