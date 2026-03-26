import Loading from "@/components/_ui/Loading";

/**
 * Submissions Page Loading Component
 * 
 * Shown during route transitions to the Submissions page.
 * Provides visual feedback while submissions data is being loaded.
 */
export default function SubmissionsLoading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loading 
                variant="spinner" 
                size="xl" 
                colorClass="text-[#4F85A6]"
                notAbsolute
            />
            <p className="text-lg text-[#3f3c40] font-medium">
                Carregando submissões...
            </p>
        </div>
    );
}
