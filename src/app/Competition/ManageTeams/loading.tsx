import Loading from "@/components/_ui/Loading";

/**
 * Manage Teams Page Loading Component
 * 
 * Shown during route transitions to the Manage Teams page.
 * Provides visual feedback while team data is being loaded.
 */
export default function ManageTeamsLoading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loading 
                variant="spinner" 
                size="xl" 
                colorClass="text-[#4F85A6]"
                notAbsolute
            />
            <p className="text-lg text-[#3f3c40] font-medium">
                Carregando equipes...
            </p>
        </div>
    );
}
