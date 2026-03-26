import Loading from "@/components/_ui/Loading";

/**
 * Auth Pages Loading Component
 * 
 * Shown during route transitions within the (auth) route group:
 * - /login
 * - /register
 * - /recover
 * - /logout
 * 
 * Uses gradient background matching auth pages design.
 */
export default function AuthLoading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#4F85A6] to-[#3f3c40] z-50 overflow-hidden">
            <div className="text-center">
                <Loading 
                    variant="spinner" 
                    size="xl" 
                    colorClass="text-white"
                    notAbsolute
                />
                <p className="mt-4 text-lg text-white font-medium">
                    Carregando...
                </p>
            </div>
        </div>
    );
}
