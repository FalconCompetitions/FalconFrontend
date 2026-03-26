'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/_ui/Dialog';
import Button from '@/components/_ui/Button';
import { AlertTriangle, Loader2, Trash2, AlertCircle, Info } from 'lucide-react';

type ConfirmDialogVariant = 'destructive' | 'warning' | 'info';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: ConfirmDialogVariant;
    isLoading?: boolean;
    itemName?: string;
}

const variantConfig = {
    destructive: {
        icon: Trash2,
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        confirmButtonClass: 'bg-red-600 hover:bg-red-700',
        confirmIcon: Trash2,
    },
    warning: {
        icon: AlertTriangle,
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        confirmButtonClass: 'bg-yellow-600 hover:bg-yellow-700',
        confirmIcon: AlertCircle,
    },
    info: {
        icon: Info,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        confirmButtonClass: 'bg-[#4F85A6] hover:bg-[#3C6B88]',
        confirmIcon: null,
    },
};

/**
 * Componente de diálogo de confirmação reutilizável
 * Ideal para ações destrutivas ou que requerem confirmação do usuário
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'destructive',
    isLoading = false,
    itemName,
}) => {
    const config = variantConfig[variant];
    const IconComponent = config.icon;
    const ConfirmIconComponent = config.confirmIcon;

    const handleConfirm = () => {
        if (!isLoading) {
            onConfirm();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${config.iconBg}`}>
                            <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
                        </div>
                        <DialogTitle className="text-xl text-[#3f3c40]">
                            {title}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-base text-[#4F85A6] mt-3 pl-11">
                        {description}
                        {itemName && (
                            <span className="block mt-2 font-semibold text-[#3f3c40]">
                                &quot;{itemName}&quot;
                            </span>
                        )}
                        {variant === 'destructive' && (
                            <span className="block mt-2 text-sm text-red-500">
                                ⚠️ Esta ação não pode ser desfeita.
                            </span>
                        )}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6 gap-3 sm:gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="border-[#e9edee] text-[#3f3c40] hover:bg-[#e9edee]"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={`${config.confirmButtonClass} text-white min-w-[120px]`}
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                {ConfirmIconComponent && (
                                    <ConfirmIconComponent className="w-4 h-4 mr-2" />
                                )}
                                {confirmText}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDialog;
