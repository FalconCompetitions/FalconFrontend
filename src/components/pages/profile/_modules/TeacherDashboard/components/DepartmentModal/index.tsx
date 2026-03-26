"use client";

import React, { useCallback, useState } from "react";
import Modal from "@/components/_ui/Modal";
import Input from "@/components/_ui/Input";
import { useUser } from "@/contexts/UserContext";
import z from "zod";
import {
    Controller,
    SubmitErrorHandler,
    SubmitHandler,
    useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import UserService from "@/services/UserService";
import { useSnackbar } from "notistack";

interface DepartmentModalProps {
    open: boolean;
    onClose: () => void;
}

const schema = z.object({
    department: z
        .string()
        .min(3, "O nome do departamento deve ter pelo menos 3 caracteres"),
    email: z.string().email("E-mail inválido"),
});

const DepartmentModal: React.FC<DepartmentModalProps> = ({ open, onClose }) => {
    const { user, setUser } = useUser();
    const [isLoading, setIsLoading] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    const { control, handleSubmit, reset, setValue, setError, watch } = useForm(
        {
            defaultValues: {
                department: user!.department || "",
                email: user!.email,
            },
            resolver: zodResolver(schema),
        }
    );

    const onConfirm: SubmitHandler<z.infer<typeof schema>> = useCallback(
        async (data) => {
            try {
                setIsLoading(true);
                const res = await UserService.updateUser(user!.id, {
                    id: user!.id,
                    department: data.department,
                    email: data.email,
                    joinYear: user!.joinYear,
                    name: user!.name,
                    status: 0,
                    group: user!.group,
                    groupId: user!.groupId,
                });

                if (res.status == 200 && res.data) {
                    const updatedUser = res.data;

                    setUser((prev) => {
                        if (!prev) return null;
                        return {
                            ...prev,
                            department:
                                updatedUser.department ?? prev.department,
                            email: updatedUser.email,
                            name: updatedUser.name,
                            joinYear: updatedUser.joinYear ?? prev.joinYear,
                        };
                    });

                    enqueueSnackbar("Informações atualizadas com sucesso!", {
                        variant: "success",
                        autoHideDuration: 5000,
                        anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "right",
                        },
                    });
                    setIsLoading(false);
                    onClose();
                    return;
                }
                throw new Error("Failed to update user");
            } catch (error) {
                console.error(error);
                enqueueSnackbar(
                    "Erro ao atualizar informações. Tente novamente mais tarde.",
                    {
                        variant: "error",
                        autoHideDuration: 5000,
                        anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "right",
                        },
                    }
                );
                setIsLoading(false);
            }
        },
        [enqueueSnackbar, onClose, setUser, user]
    );

    const onError: SubmitErrorHandler<z.infer<typeof schema>> =
        useCallback(() => {
            // Log errors if needed
        }, []);

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Alterar informações"
            description="Altere seus dados"
            hasConfirmButton
            hasCancelButton
            loading={isLoading}
            confirmButtonContent="Salvar alterações"
            cancelButtonContent="Cancelar"
            onConfirm={handleSubmit(onConfirm, onError)}
            onCancel={onClose}
            center
            bodyContent={
                <div className="flex flex-col gap-4 px-2 py-1">
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Departamento
                        </label>
                        <Controller
                            control={control}
                            name="department"
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    className="mt-1"
                                    disabled={isLoading}
                                    placeholder="Digite o nome do departamento"
                                    {...field}
                                />
                            )}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            E-mail
                        </label>
                        <Controller
                            control={control}
                            name="email"
                            render={({ field }) => (
                                <Input
                                    type="email"
                                    className="mt-1"
                                    disabled={isLoading}
                                    placeholder="Digite o e-mail institucional"
                                    {...field}
                                />
                            )}
                        />
                    </div>
                </div>
            }
        />
    );
};

export default DepartmentModal;
