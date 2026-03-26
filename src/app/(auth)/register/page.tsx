"use client";

import React from "react";
import { User, IdCard, Mail, Lock, Layers, Key } from "lucide-react";
import Input from "@/components/_ui/Input";
import Falcon from "@/components/_ui/icons/Falcon";
import { Controller } from "react-hook-form";
import Button from "@/components/_ui/Button";
import ScreenContainer from "@/components/_ui/ScreenContainer";
import useRegister from "@/components/pages/register/hooks/useRegister";
import Dropdown from "@/components/_ui/Dropdown";

const Cadastro: React.FC = () => {
    const {
        control,
        handleSubmit,
        handleFormSubmit,
        formData,
        roleOptions,
        isLoading,
        formError,
    } = useRegister();

    return (
        <ScreenContainer>
            {/* Seção lateral - escondida em mobile */}
            <div className="hidden lg:flex w-1/2 bg-[#4F85A6] flex-col justify-center items-center text-white p-10">
                <Falcon className="max-w-md fill-white border-none object-contain mb-4 w-48 xl:w-64 h-auto" />
                <h1 className="text-4xl xl:text-5xl font-bold mt-4">FHO</h1>
                <p className="text-base xl:text-lg text-center mb-6">
                    Para acessar sua conta da Maratona de Programação
                </p>
                <Button
                    type="link"
                    linkHref="/login"
                    variant="secondary"
                    rounded={true}
                >
                    Login
                </Button>
            </div>

            {/* Header mobile - visível apenas em telas pequenas */}
            <div className="lg:hidden w-full bg-[#4F85A6] flex flex-col items-center justify-center py-6 px-4">
                <Falcon className="w-16 h-auto fill-white mb-2" />
                <p className="text-white text-xl font-bold">FHO</p>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#4F85A6] mb-6">
                    Crie sua conta
                </h2>

                <div className="w-full max-w-sm space-y-4">
                    <form
                        className="flex flex-col gap-2"
                        // @ts-expect-error - Type mismatch with react-hook-form types
                        onSubmit={handleSubmit(handleFormSubmit, (d) =>
                            console.log(d)
                        )}
                    >
                        {formError && (
                            <div className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm" role="alert">
                                {formError}
                            </div>
                        )}
                        {/* Nome */}
                        <Controller
                            name="name"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Input
                                    type="text"
                                    icon={
                                        <User
                                            className="text-gray-500 mr-2"
                                            size={20}
                                        />
                                    }
                                    placeholder="Digite seu nome"
                                    label="Nome"
                                    error={fieldState.error}
                                    {...field}
                                />
                            )}
                        />

                        {/* Seleção de Tipo */}
                        <Controller
                            control={control}
                            name="role"
                            render={({ field, fieldState }) => (
                                <Dropdown
                                    grow={true}
                                    label="Tipo"
                                    options={roleOptions}
                                    type="normalDropdown"
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    errored={fieldState.error !== undefined}
                                    errorMessage={fieldState.error?.message}
                                />
                            )}
                        />

                        {/* RA */}
                        <Controller
                            name="ra"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Input
                                    type="text"
                                    icon={
                                        <IdCard
                                            className="text-gray-500 mr-2"
                                            size={20}
                                        />
                                    }
                                    placeholder="Digite seu RA"
                                    label="RA do Usuário"
                                    error={fieldState.error}
                                    {...field}
                                />
                            )}
                        />

                        {/* E-mail */}
                        <Controller
                            name="email"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Input
                                    type="email"
                                    icon={
                                        <Mail
                                            className="text-gray-500 mr-2"
                                            size={20}
                                        />
                                    }
                                    placeholder="Digite seu e-mail"
                                    label="E-mail Institucional"
                                    error={fieldState.error}
                                    {...field}
                                />
                            )}
                        />

                        {/* Senha */}
                        <Controller
                            name="password"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Input
                                    type="password"
                                    icon={
                                        <Lock
                                            className="text-gray-500 mr-2"
                                            size={20}
                                        />
                                    }
                                    placeholder="Digite sua senha"
                                    label="Senha"
                                    error={fieldState.error}
                                    {...field}
                                />
                            )}
                        />

                        {/* Ano de Ingresso (Alunos) */}
                        {formData.role === "Student" && (
                            <Controller
                                name="joinYear"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Input
                                        type="number"
                                        icon={
                                            <Layers
                                                className="text-gray-500 mr-2"
                                                size={20}
                                            />
                                        }
                                        placeholder="Digite o ano de ingresso"
                                        label="Ano de Ingresso"
                                        error={fieldState.error}
                                        {...field}
                                        value={
                                            field.value !== null &&
                                            field.value !== undefined
                                                ? String(field.value)
                                                : ""
                                        }
                                    />
                                )}
                            />
                        )}

                        {/* Código de Acesso (Professores) */}
                        {formData.role === "Teacher" && (
                            <Controller
                                name="accessCode"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Input
                                        type="text"
                                        icon={
                                            <Key
                                                className="text-gray-500 mr-2"
                                                size={20}
                                            />
                                        }
                                        placeholder="Digite o código de acesso"
                                        label="Código de Acesso"
                                        error={fieldState.error}
                                        {...field}
                                    />
                                )}
                            />
                        )}

                        {/* Botão Criar - agora dentro do form */}
                        <Button
                            variant="primary"
                            type="submit"
                            rounded={true}
                            fullWidth={true}
                            disabled={isLoading}
                            loading={isLoading}
                            className="mt-4"
                        >
                            Criar
                        </Button>
                    </form>

                    {/* Link para login em mobile */}
                    <p className="lg:hidden flex flex-wrap gap-1 justify-center mt-4 text-sm text-center text-gray-600">
                        Já tem uma conta?
                        <a href="/login" className="text-[#4F85A6] hover:underline font-medium">
                            Faça login
                        </a>
                    </p>
                </div>
            </div>
        </ScreenContainer>
    );
};

export default Cadastro;
