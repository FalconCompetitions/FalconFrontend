import Loading from "@/components/_ui/Loading";

/**
 * Root Loading Component
 * 
 * This loading UI is shown automatically by Next.js during:
 * - Initial page load
 * - Route transitions
 * - Data fetching in layouts/pages
 * 
 * Applies to all routes unless overridden by more specific loading.tsx files.
 */
export default function RootLoading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="text-center">
                <Loading 
                    variant="spinner" 
                    size="xl" 
                    colorClass="text-[#4F85A6]"
                    notAbsolute
                />
                <p className="mt-4 text-lg text-[#3f3c40] font-medium">
                    Carregando...
                </p>
            </div>
        </div>
    );
}
