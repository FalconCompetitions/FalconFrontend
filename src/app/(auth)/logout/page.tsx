"use client";

import { useUser } from "@/contexts/UserContext";
import AuthService from "@/services/AuthService";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Loading from "@/components/_ui/Loading";

/**
 * Logout Page Component
 * 
 * Handles user logout with a smooth loading animation.
 * 
 * Flow:
 * 1. Shows loading animation
 * 2. Calls logout service to clear cookies
 * 3. Clears user context
 * 4. Redirects to login page
 * 
 **/
const Logout = () => {
    const { setUser } = useUser();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(true);

    const handleLogout = useCallback(async (signal?: AbortSignal) => {
        try {
            // Call logout service to clear server-side session/cookies
            await AuthService.logoutUser();
            
            // Check if component is still mounted before proceeding
            if (signal?.aborted) return;
            
            // Clear user context
            setUser(null);

            // Small delay for smooth transition
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    if (!signal?.aborted) resolve();
                }, 500);
            });

            // Redirect to login page
            if (!signal?.aborted) {
                router.push("/login");
            }
        } catch (error) {
            // Even if logout fails, clear local state and redirect
            // This ensures user can't stay in an invalid state
            console.error("Logout error:", error);
            if (!signal?.aborted) {
                setUser(null);
                router.push("/login");
            }
        } finally {
            if (!signal?.aborted) {
                setIsLoggingOut(false);
            }
        }
    }, [setUser, router]);

    useEffect(() => {
        const controller = new AbortController();
        
        handleLogout(controller.signal);

        // Cleanup function to prevent state updates on unmounted component
        return () => {
            controller.abort();
        };
    }, [handleLogout]);

    if (!isLoggingOut) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#4F85A6] to-[#3f3c40] overflow-hidden">
            <div className="text-center">
                <div className="mb-6 flex justify-center">
                    <Loading 
                        variant="spinner" 
                        size="xl" 
                        colorClass="text-white"
                        notAbsolute
                    />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-2">
                    Encerrando sessão...
                </h2>
                <p className="text-white/80">
                    Aguarde enquanto fazemos logout da sua conta
                </p>
            </div>
        </div>
    );
};

export default Logout;