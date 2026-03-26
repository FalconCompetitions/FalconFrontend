import { DropdownOption } from "@/components/_ui/Dropdown/types";
import { useUser } from "@/contexts/UserContext";
import AuthService from "@/services/AuthService";
import { RegisterUserRequest } from "@/types/Auth/Requests";
import { RegisterUserResponse } from "@/types/Auth/Responses";
import { ServerSideResponse } from "@/types/Global";
import { mapBackendErrors } from "@/utilities/formErrorHandler";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import z from "zod";
import { useRouter } from "next/navigation";

const schema = z
    .object({
        name: z.string({ message: "Campo obrigatório" }),
        ra: z
            .string()
            .min(6, { message: "RA deve ter no mínimo 6 dígitos!" })
            .max(7, { message: "RA deve ter no máximo 7 dígitos!" }),
        email: z.string().email("Formato de e-mail inválido!"),
        password: z
            .string({ message: "Campo obrigatório" })
            .min(8, { message: "A senha deve ter no mínimo 8 caracteres" })
            .regex(/[0-9]/, { message: "A senha deve conter pelo menos um número" }),
        joinYear: z.coerce.number().nullable().optional(),
        role: z.enum(["Student", "Teacher"]),
        accessCode: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.role === "Teacher" && data.accessCode === "") {
            ctx.addIssue({
                path: ["accessCode"],
                code: "custom",
                message: "É necessário o código de acesso!",
            });
        }

        const addInvalidJoinYear = () => {
            ctx.addIssue({
                path: ["joinYear"],
                code: "custom",
                message: "Ano inválido",
            });
        };

        if (data.role === "Student") {
            const currentYear = new Date().getFullYear();
            
            // @ts-expect-error : extra
            if (data.joinYear === "" || data.joinYear === null || data.joinYear === undefined) {
                addInvalidJoinYear();
            } else if (
                data.joinYear === 0 ||
                data.joinYear < currentYear - 8
            ) {
                addInvalidJoinYear();
            } else if (data.joinYear > currentYear) {
                addInvalidJoinYear();
            }
        }
    });

const useRegister = () => {
    const { setUser } = useUser();

    const {
        control,
        handleSubmit,
        setError,
        setValue,
        register,
        watch,
        formState: { isValid },
    } = useForm<RegisterUserRequest>({
        defaultValues: {
            name: "",
            ra: "",
            role: "Student",
            email: "",
            // @ts-expect-error : irrelevant
            joinYear: "",
            password: "",
            accessCode: "",
        },
        mode: "onBlur",
        // @ts-expect-error : irrelevant
        resolver: zodResolver(schema),
    });

    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const router = useRouter();

    const roleOptions: DropdownOption[] = [
        {
            label: "Estudante",
            value: "Student",
        },
        {
            label: "Professor",
            value: "Teacher",
        },
    ];

    const handleFormSubmit: SubmitHandler<RegisterUserRequest> = useCallback(
        async (data: RegisterUserRequest) => {
            if (!isValid) {
                return;
            }

            setIsLoading(true);
            setFormError(null);

            try {
                const res = await AuthService.registerUser(data);

                if (res.status !== 200) {
                    if (res.data?.errors) {
                        mapBackendErrors({
                            errors: res.data.errors,
                            setError,
                            setValue,
                            setFormError,
                            validFields: ["name", "ra", "email", "password", "joinYear", "accessCode"],
                        });
                    }

                    return;
                }

                const resData = res.data;

                if (res.status === 200 && resData) {
                    setUser({
                        id: resData.user.id,
                        ra: resData.user.ra,
                        name: resData.user.name,
                        email: resData.user.email,
                        role: resData.user.role,
                        groupId: resData.user.groupId,
                        joinYear: resData.user.joinYear,
                        token: resData.token,
                        department: resData.user.department,
                        group: resData.user.group ? {
                            id: resData.user.group.id,
                            name: resData.user.group.name,
                            leaderId: resData.user.group.leaderId,
                            users: resData.user.group.users,
                            groupInvitations: resData.user.group.groupInvitations?.map(invite => ({
                                id: invite.id,
                                userId: invite.user?.id || "",
                                group: invite.group || null,
                                user: invite.user!,
                                accepted: invite.accepted,
                            })) || [],
                        } : undefined,
                        groupInvitations: resData.user.groupInvitations?.map(invite => ({
                            id: invite.id,
                            userId: invite.user?.id || "",
                            group: invite.group || null,
                            user: invite.user!,
                            accepted: invite.accepted,
                        })) || [],
                    });

                    setTimeout(() => {
                        router.push("/Profile");
                    }, 100);
                }
            } catch (err) {
                console.error("Registration error:", err);
                setFormError("Erro ao registrar usuário. Tente novamente.");
            } finally {
                setIsLoading(false);
            }
        },
        [isValid, router, setError, setUser, setValue, setFormError]
    );

    const formData = watch();

    return {
        control,
        handleSubmit,
        handleFormSubmit,
        register,
        formData,
        roleOptions,
        isLoading,
        formError,
    };
};

export default useRegister;
