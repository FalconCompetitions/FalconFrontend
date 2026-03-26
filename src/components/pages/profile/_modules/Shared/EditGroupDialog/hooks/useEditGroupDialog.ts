import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseEditGroupDialogProps } from "./types";

const schema = z.object({
    name: z.string().min(1, "Nome do grupo é obrigatório"),
    membersToRemove: z.array(z.string()),
});

const useEditGroupDialog = ({
    group,
    onClose,
    toggleDialog,
    onConfirm,
}: UseEditGroupDialogProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { control, watch, reset } = useForm({
        defaultValues: {
            name: group.name,
            membersToRemove: [] as string[],
        },
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        reset({
            name: group.name,
            membersToRemove: [],
        });
    }, [group, reset]);

    const editGroupFormValues = watch();

    const handleClose = useCallback(() => {
        setError(null);
        onClose();
    }, [onClose]);

    const handleConfirm = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await onConfirm(group.id, {
                name: editGroupFormValues.name,
                membersToRemove: editGroupFormValues.membersToRemove,
            });
        } catch (err: any) {
            setError(err?.message || "Erro ao atualizar grupo.");
            setLoading(false);
        }
    }, [editGroupFormValues, onConfirm, group.id]);

    return {
        loading,
        error,
        control,
        editGroupFormValues,
        handleClose,
        handleConfirm,
        groupUsers: group.users,
    };
};

export default useEditGroupDialog;
