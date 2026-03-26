import Loading from "@/components/_ui/Loading";

/**
 * Manual Correction Page Loading Component
 * 
 * Shown during route transitions to the Manual Correction page.
 * Provides visual feedback while correction data is being loaded.
 */
export default function ManualCorrectionLoading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loading 
                variant="spinner" 
                size="xl" 
                colorClass="text-[#4F85A6]"
                notAbsolute
            />
            <p className="text-lg text-[#3f3c40] font-medium">
                Carregando exercícios para correção...
            </p>
        </div>
    );
}
