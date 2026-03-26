import Loading from "@/components/_ui/Loading";

/**
 * Profile Section Loading Component
 * 
 * Shown during route transitions within the Profile section:
 * - /Profile (dashboard)
 * - /Profile/CreateSubscription
 * - /Profile/Subscription
 * 
 * Uses a clean design that doesn't interfere with the profile layout.
 */
export default function ProfileLoading() {
    return (
        <div className="flex items-center justify-center min-h-[60vh] w-full">
            <div className="text-center">
                <Loading 
                    variant="spinner" 
                    size="lg" 
                    colorClass="text-[#4F85A6]"
                    notAbsolute
                />
                <p className="mt-4 text-base text-[#3f3c40]">
                    Carregando perfil...
                </p>
            </div>
        </div>
    );
}
