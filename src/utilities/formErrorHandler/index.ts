import { UseFormSetError, UseFormSetValue, FieldValues, Path } from "react-hook-form";

export interface BackendError {
    target: string;
    error: string;
}

export interface ErrorHandlerOptions<T extends FieldValues> {
    errors: BackendError[];
    setError: UseFormSetError<T>;
    setValue: UseFormSetValue<T>;
    setFormError: (error: string) => void;
    validFields: Path<T>[];
    clearOnError?: boolean;
}

/**
 * Helper genérico para mapear erros do backend para campos de formulário
 * @param options - Opções de configuração
 * @returns void
 */
export const mapBackendErrors = <T extends FieldValues>({
    errors,
    setError,
    setValue,
    setFormError,
    validFields,
    clearOnError = true,
}: ErrorHandlerOptions<T>): void => {
    errors.forEach((err) => {
        // Erros gerais de formulário
        if (err.target === "form" || err.target === "Error" || err.target === "general") {
            setFormError(err.error);
            return;
        }

        // Erros de campos específicos
        if (validFields.includes(err.target as Path<T>)) {
            setError(err.target as Path<T>, {
                type: "onBlur",
                message: err.error,
            });

            // Limpar o valor do campo com erro (opcional)
            if (clearOnError) {
                setValue(err.target as Path<T>, "" as any);
            }
        }
    });
};
