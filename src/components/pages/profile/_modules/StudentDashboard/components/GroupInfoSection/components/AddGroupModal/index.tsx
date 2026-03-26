import Button from "@/components/_ui/Button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/_ui/Card";
import Input from "@/components/_ui/Input";
import Label from "@/components/_ui/Label";
import { Plus } from "lucide-react";
import useAddGroup from "./hooks/useAddGroup";
import { Controller } from "react-hook-form";

interface AddGroupModalProps {
    onClose: () => void;
}

const AddGroupModal = ({ onClose }: AddGroupModalProps) => {
    const {
        control,
        handleSubmit,
        isLoading,
        handleSubmitError,
        handleSubmitForm,
        formError,
    } = useAddGroup(onClose);

    // Wrapper to prevent native form submit reload and delegate to react-hook-form
    const onFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(handleSubmitForm, handleSubmitError)();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <form onSubmit={onFormSubmit}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Plus /> Criar Novo Grupo
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {formError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                                {formError}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="groupName">Nome do Grupo</Label>
                            <Controller
                                control={control}
                                name="name"
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder="Ex: Os Campeões da Maratona"
                                        required
                                        {...field}
                                    />
                                )}
                            />
                        </div>
                        <p className="text-sm text-slate-600">
                            Adicione até 2 outros integrantes (opcional). Você
                            já está incluído como líder.
                        </p>
                        <div className="space-y-2">
                            <Label htmlFor="member2">RA do Integrante 2</Label>
                            <Controller
                                control={control}
                                name="member2Ra"
                                render={({ field }) => (
                                    <Input
                                        id="member2"
                                        type="text"
                                        placeholder="Ex: 123456"
                                        {...field}
                                    />
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="member3">RA do Integrante 3</Label>
                            <Controller
                                control={control}
                                name="member3Ra"
                                render={({ field }) => (
                                    <Input
                                        id="member3"
                                        type="text"
                                        placeholder="Ex: 789012"
                                        {...field}
                                    />
                                )}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="destructive"
                            rounded
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="success"
                            rounded
                            disabled={isLoading}
                            loading={isLoading}
                        >
                            Criar Grupo
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default AddGroupModal;
