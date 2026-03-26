import { useUser } from "@/contexts/UserContext";
import { parseDate, formatDateWithoutTimezone } from "@/libs/utils";
import useLoadCompetitions from "@/providers/CompetitionContextProvider/hooks/useLoadCompetitions";
import CompetitionService from "@/services/CompetitionService";
import { Competition } from "@/types/Competition";
import { InscribeGroupInCompetitionRequest } from "@/types/Competition/Requests";
import { useSnackbar } from "notistack";
import { useState, useEffect, useCallback, useMemo } from "react";

export const useInscriptionForm = (
    toggleMenu: (menu: "dashboard" | "inscription") => void
) => {
    const { user } = useUser();

    const { enqueueSnackbar } = useSnackbar();

    const [activeCompetition, setActiveCompetition] =
        useState<Competition | null>(null);
    const [selectedCompetitionId, setSelectedCompetitionId] = useState<number | null>(null);

    const [blockedState, setBlockedState] = useState(false);

    const {
        openSubCompetitions,
        isSubCompetitionsLoading,
        loadOpenSubCompetitions,
    } = useLoadCompetitions();

    const [groupExists] = useState(!!user?.group);
    const [initialMembers] = useState<string[] | null>(
        user?.group?.users.map((u) => u.name) || null
    );

    const [competitionName, setCompetitionName] = useState("");
    const [quantityStudents, setQuantityStudents] = useState(
        initialMembers?.length || 0
    );
    const [members, setMembers] = useState<string[] | null>(initialMembers);
    const [initialRegistration, setInitialRegistration] = useState("");
    const [registrationEnd, setRegistrationEnd] = useState("");
    const [maxMembers, setMaxMembers] = useState(3);
    const [groupName, setGroupName] = useState(user?.group?.name || null);
    const [groupSizeError, setGroupSizeError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isInscriptionsOpen, setIsInscriptionsOpen] = useState(true);
    const [hasCompetitions, setHasCompetitions] = useState(true);

    const isFormValid = useMemo(() => {
        return groupExists && !groupSizeError && isInscriptionsOpen && activeCompetition !== null;
    }, [groupExists, groupSizeError, isInscriptionsOpen, activeCompetition]);

    const selectCompetition = useCallback((competitionId: number) => {
        const selected = openSubCompetitions.find(c => c.id === competitionId);
        if (!selected) return;

        setSelectedCompetitionId(competitionId);
        setActiveCompetition(selected);
        setCompetitionName(selected.name);
        setMaxMembers(selected.maxMembers!);
        
        // Formatar datas SEM conversão de timezone (mantém horário original)
        setInitialRegistration(
            selected.startInscriptions 
                ? formatDateWithoutTimezone(selected.startInscriptions.toString())
                : "N/A"
        );
        setRegistrationEnd(
            selected.endInscriptions 
                ? formatDateWithoutTimezone(selected.endInscriptions.toString())
                : "N/A"
        );

        // Validate group size against selected competition
        if (initialMembers && selected.maxMembers! < initialMembers.length) {
            setGroupSizeError(true);
        } else {
            setGroupSizeError(false);
        }
    }, [openSubCompetitions, initialMembers]);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            if (!isFormValid) return;
            const payload: InscribeGroupInCompetitionRequest = {
                competitionId: activeCompetition!.id,
                groupId: user!.group!.id,
            };

            try {
                const response =
                    await CompetitionService.inscribeGroupInCompetition(
                        payload
                    );

                if (response.status == 200) {
                    setIsSuccess(true);
                }

                if (response.status !== 200) {
                    // @ts-expect-error : Irrelevant
                    enqueueSnackbar(response.data.message, {
                        variant: "warning",
                        anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "right",
                        },
                        autoHideDuration: 3000,
                    });
                }
            } catch (error) {
                console.error("Error during inscription:", error);
                enqueueSnackbar("Erro ao inscrever o grupo na competição.", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "right",
                    },
                    autoHideDuration: 3000,
                });

                setIsSuccess(false);
            }
        },
        [isFormValid, activeCompetition, user, enqueueSnackbar]
    );

    useEffect(() => {
        loadOpenSubCompetitions();
    }, [loadOpenSubCompetitions]);

    useEffect(() => {
        // Check if there are any competitions available
        if (openSubCompetitions.length === 0) {
            setHasCompetitions(false);
            setIsInscriptionsOpen(false);
            return;
        }

        setHasCompetitions(true);

        // Parse dates for all competitions
        const parsedCompetitions = openSubCompetitions.map(comp => ({
            ...comp,
            startInscriptions: comp.startInscriptions ? new Date(comp.startInscriptions) : null,
            endInscriptions: comp.endInscriptions ? new Date(comp.endInscriptions) : null,
        }));

        // Check if at least one competition has open inscriptions
        const now = new Date();
        const hasOpenInscriptions = parsedCompetitions.some(comp => {
            if (!comp.startInscriptions || !comp.endInscriptions) return false;
            return now >= comp.startInscriptions && now <= comp.endInscriptions;
        });

        setIsInscriptionsOpen(hasOpenInscriptions);

        // Auto-select first competition if only one is available
        if (openSubCompetitions.length === 1 && !selectedCompetitionId) {
            selectCompetition(openSubCompetitions[0].id);
        }

        // Update member info
        if (initialMembers) {
            setQuantityStudents(initialMembers.length);
            setMembers(initialMembers);
        } else {
            setQuantityStudents(0);
            setMembers([]);
        }
    }, [openSubCompetitions, initialMembers, selectedCompetitionId, selectCompetition]);

    return {
        isSubCompetitionsLoading,
        activeCompetition,
        competitionName,
        quantityStudents,
        members,
        initialRegistration,
        registrationEnd,
        maxMembers,
        groupName,
        setGroupName,
        handleSubmit,
        isFormValid,
        groupExists,
        groupSizeError,
        isSuccess,
        setIsSuccess,
        isInscriptionsOpen,
        hasCompetitions,
        openSubCompetitions,
        selectedCompetitionId,
        selectCompetition,
    };
};
