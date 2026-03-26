import Loading from "@/components/_ui/Loading";

/**
 * Logs Page Loading Component
 * 
 * Shown during route transitions to the Logs page.
 * Provides visual feedback while log data is being loaded.
 */
export default function LogsLoading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loading 
                variant="spinner" 
                size="xl" 
                colorClass="text-[#4F85A6]"
                notAbsolute
            />
            <p className="text-lg text-[#3f3c40] font-medium">
                Carregando logs da competição...
            </p>
        </div>
    );
}
