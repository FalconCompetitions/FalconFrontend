import { useUser } from "@/contexts/UserContext";
import AuthService from "@/services/AuthService";
import {
    LoginUserResponse,
} from "@/types/Auth/Responses";
import { ServerSideResponse } from "@/types/Global";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm, FieldValues } from "react-hook-form";
import z from "zod";
import { mapBackendErrors } from "@/utilities/formErrorHandler";

interface LoginInputs {
    ra: string;
    password: string;
}

const schema = z.object({
    ra: z
        .string()
        .min(6, { message: "RA deve ter no mínimo 6 digitos!" })
        .max(7, { message: "RA deve ter no máximo 7 digitos!" }),
    password: z.string(),
});

const useLogin = () => {
    const { setUser } = useUser();

    const router = useRouter();
    
    const [formError, setFormError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        handleSubmit,
        control,
        setValue,
        formState: { errors },
        setError,
    } = useForm<LoginInputs>({
        defaultValues: {
            ra: "",
            password: "",
        },
        mode: "onBlur",
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
        let res: ServerSideResponse<LoginUserResponse> | null = null;

        try {
            setFormError(null);
            setIsLoading(true);
            res = await AuthService.loginUser(data);

            if(res.status != 200) {
                if(res.data?.errors) {
                    mapBackendErrors({
                        errors: res.data.errors,
                        setError,
                        setValue,
                        setFormError,
                        validFields: ["ra", "password"],
                    });
                }

                setIsLoading(false);
                return;
            }

            if(!res.data) {
                console.log(res);
                return;
            }

            const body = res.data;

            if (body) {
                setUser({
                    id: body.user.id,
                    email: body.user.email,
                    ra: body.user.ra,
                    joinYear: body.user.joinYear,
                    name: body.user.name,
                    role: body.user.role,
                    groupId: body.user.groupId,
                    token: body.token,
                    department: body.user.department,
                    group: body.user.group ? {
                        id: body.user.group.id,
                        name: body.user.group.name,
                        leaderId: body.user.group.leaderId,
                        users: body.user.group.users,
                        groupInvitations: body.user.group.groupInvitations?.map(invite => ({
                            id: invite.id,
                            userId: invite.user?.id || "",
                            group: invite.group || null,
                            user: invite.user!,
                            accepted: invite.accepted,
                        })) || [],
                    } : null,
                    groupInvitations: body.user.groupInvitations?.map(invite => ({
                        id: invite.id,
                        userId: invite.user?.id || "",
                        group: invite.group || null,
                        user: invite.user!,
                        accepted: invite.accepted,
                    })) || [],
                });

                setTimeout(() => {
                    router.push("/Profile");
                }, 300);
            }
        } catch (err) {
            console.error(err);
            setFormError("Erro ao fazer login. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        control,
        handleSubmit,
        onSubmit,
        formError,
        isLoading,
    };
};

export default useLogin;
