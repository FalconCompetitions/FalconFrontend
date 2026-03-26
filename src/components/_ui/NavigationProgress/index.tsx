"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "./NavigationProgress.module.scss";

/**
 * Navigation Progress Bar Component
 * 
 * Shows a progress bar at the top of the page during route transitions.
 * This provides instant visual feedback when navigating between pages.
 * 
 * Features:
 * - Automatic start/stop on route changes
 * - Customizable appearance via CSS
 * - Minimal performance impact
 * 
 * @usage Add this component to your root layout:
 * ```tsx
 * import NavigationProgress from "@/components/NavigationProgress";
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <NavigationProgress />
 *         {children}
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export default function NavigationProgress() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Configure NProgress
        NProgress.configure({
            showSpinner: false, // Hide spinner, keep only the bar
            trickleSpeed: 50,
            minimum: 0.08,
            easing: "ease",
            speed: 200,
        });
    }, []);

    useEffect(() => {
        // Start progress bar when route changes
        NProgress.start();

        // Complete progress bar after a short delay
        const timer = setTimeout(() => {
            NProgress.done();
        }, 100);

        return () => {
            clearTimeout(timer);
            NProgress.done();
        };
    }, [pathname, searchParams]);

    return null;
}
