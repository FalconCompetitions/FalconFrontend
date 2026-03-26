"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { WebSocketContextProps } from "./types";
import {
    HubConnection,
    HubConnectionBuilder,
    HubConnectionState,
    HttpTransportType,
} from "@microsoft/signalr";
import { useSnackbar } from "notistack";
import { useUser } from "../UserContext";
import { usePathname } from "next/navigation";

export const WebSocketContext = createContext<WebSocketContextProps | null>(
    null
);

export const WebSocketContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { user } = useUser();
    const location = usePathname();
    const { enqueueSnackbar } = useSnackbar();

    const [webSocketConnection, setWebSocketConnection] =
        useState<HubConnection | null>(null);
    const [connectionId, setConnectionId] = useState<string | null>(null);

    // Track connection state to prevent race conditions
    const connectionStateRef = useRef<{
        isConnecting: boolean;
        isConnected: boolean;
        currentUserId: string | null;
        connectionInstance: HubConnection | null;
    }>({
        isConnecting: false,
        isConnected: false,
        currentUserId: null,
        connectionInstance: null,
    });

    // Stable reference to enqueueSnackbar to avoid unnecessary effect triggers
    const enqueueSnackbarRef = useRef(enqueueSnackbar);
    useEffect(() => {
        enqueueSnackbarRef.current = enqueueSnackbar;
    }, [enqueueSnackbar]);

    // Debounce timer for user changes
    const userChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Clear any pending debounce timeout
        if (userChangeTimeoutRef.current) {
            clearTimeout(userChangeTimeoutRef.current);
            userChangeTimeoutRef.current = null;
        }

        // Don't attempt connection on public routes
        const publicRoutes = ["/login", "/register", "/recover"];
        const isPublicRoute =
            location === "/" ||
            publicRoutes.some((route) => location.startsWith(route));

        if (isPublicRoute) {
            console.log(
                "🚫 Skipping WebSocket connection on public route:",
                location
            );
            return;
        }

        // Don't create connection if no user is logged in
        if (!user || user.token == null) {
            // Clean up existing connection if user logged out
            const currentConnection =
                connectionStateRef.current.connectionInstance;
            if (currentConnection != null) {
                console.log(
                    "🔌 User logged out, stopping WebSocket connection"
                );

                // Stop connection regardless of state
                if (
                    currentConnection.state !== HubConnectionState.Disconnected
                ) {
                    currentConnection.stop().catch((err) => {
                        console.error(
                            "Error stopping WebSocket connection:",
                            err
                        );
                    });
                }

                setWebSocketConnection(null);
                setConnectionId(null);
                connectionStateRef.current = {
                    isConnecting: false,
                    isConnected: false,
                    currentUserId: null,
                    connectionInstance: null,
                };
            }
            return;
        }

        // Check if user changed - if so, close old connection and create new one
        const userChanged =
            connectionStateRef.current.currentUserId !== null &&
            connectionStateRef.current.currentUserId !== user.id;

        if (userChanged) {
            console.log("👤 User changed, closing old WebSocket connection");
            const oldConnection = connectionStateRef.current.connectionInstance;

            if (
                oldConnection != null &&
                oldConnection.state !== HubConnectionState.Disconnected
            ) {
                oldConnection.stop().catch((err) => {
                    console.error(
                        "Error stopping old WebSocket connection:",
                        err
                    );
                });
            }

            setWebSocketConnection(null);
            setConnectionId(null);
            connectionStateRef.current = {
                isConnecting: false,
                isConnected: false,
                currentUserId: null,
                connectionInstance: null,
            };
        }

        // Prevent duplicate connections - check all non-idle states
        const existingConnection =
            connectionStateRef.current.connectionInstance;
        const isInProgress =
            connectionStateRef.current.isConnecting ||
            connectionStateRef.current.isConnected ||
            (existingConnection != null &&
                existingConnection.state !== HubConnectionState.Disconnected);

        if (isInProgress) {
            console.log(
                "⏸️  WebSocket connection already in progress, skipping duplicate attempt"
            );
            return;
        }

        // Debounce connection creation to allow UserContext to stabilize
        // Keep a local reference (in the effect scope) to the connection instance we create
        // so the cleanup can stop exactly that instance instead of an unrelated one.
        // Also create an AbortController per effect run so we can signal early
        // cancellation of any in-flight start operations.
        let createdConnection: HubConnection | null = null;
        const abortController = new AbortController();
        userChangeTimeoutRef.current = setTimeout(() => {
            // Validate backend URL is configured
            const backendUrl = process.env.NEXT_PUBLIC_API_URL_CUSTOM;
            if (!backendUrl) {
                console.error("❌ NEXT_PUBLIC_API_URL_CUSTOM not configured");
                return;
            }

            console.log(
                "🔄 Creating new WebSocket connection for user:",
                user.id
            );
            console.log("📍 Backend URL:", backendUrl);

            // If this effect run was already aborted, don't proceed.
            if (abortController.signal.aborted) return;

            connectionStateRef.current.isConnecting = true;
            connectionStateRef.current.currentUserId = user.id;

            // Use HTTP transport to avoid SSL certificate issues in development
            // SignalR will automatically fall back to WebSocket over HTTP

            const isDevelopment = process.env.NEXT_PUBLIC_DEV === "1";

            const newConnection = new HubConnectionBuilder()
                .withUrl(
                    `${process.env.NEXT_PUBLIC_API_URL_CUSTOM}/hub/competition`,
                    {
                        withCredentials: true,
                        accessTokenFactory() {
                            return user.token;
                        },
                        // Use ServerSentEvents as primary transport to avoid SSL issues
                        // WebSockets over HTTPS requires valid SSL certificate
                        transport: isDevelopment
                            ? HttpTransportType.ServerSentEvents |
                              HttpTransportType.LongPolling
                            : HttpTransportType.WebSockets,
                        skipNegotiation: false,
                    }
                )
                .withAutomaticReconnect({
                    nextRetryDelayInMilliseconds: (retryContext) => {
                        // Exponential backoff: 0, 2, 10, 30 seconds
                        if (retryContext.previousRetryCount < 4) {
                            return Math.min(
                                1000 *
                                    Math.pow(
                                        2,
                                        retryContext.previousRetryCount
                                    ),
                                30000
                            );
                        }
                        return null; // Stop retrying after 4 attempts
                    },
                })
                .build();

            // Do NOT store the connection instance as the active instance yet.
            // We only mark a connection as active after start() resolves successfully.

            // Keep a local reference for the cleanup closure to avoid stopping
            // a different connection instance if a new one is created later.
            createdConnection = newConnection;

            // Set up event handlers before starting connection
            newConnection.on("ReceiveConnectionId", (id: string) => {
                console.log("🆔 Received connection ID:", id);
                setConnectionId(id);
            });

            newConnection.onclose((error) => {
                console.log("🔌 WebSocket connection closed", error);
                setConnectionId(null);
                connectionStateRef.current.isConnecting = false;
                connectionStateRef.current.isConnected = false;
            });

            newConnection.onreconnecting((error) => {
                console.log("🔄 WebSocket reconnecting...", error);
                setConnectionId(null);
                connectionStateRef.current.isConnected = false;
            });

            newConnection.onreconnected((connectionId) => {
                console.log("✅ WebSocket reconnected", connectionId);
                connectionStateRef.current.isConnected = true;

                // Request new connection ID after reconnection
                if (newConnection.state === HubConnectionState.Connected) {
                    newConnection.invoke("GetConnectionId").catch((err) => {
                        console.error(
                            "Error getting connection ID after reconnect:",
                            err
                        );
                    });

                    // Trigger a re-fetch of competition data by emitting an event
                    // This ensures the CompetitionHubContext gets fresh data
                    console.log(
                        "🔄 Requesting fresh competition data after reconnection"
                    );
                }
            });

            // Track whether start() completed successfully for this effect run.
            // This helps distinguish an actual "start" cancellation (start rejected
            // because stop/abort was called while it was pending) from a normal
            // stop after the connection had already established.
            let startFinished = false;

            // Start the connection
            newConnection
                .start()
                .then(() => {
                    startFinished = true;
                    // Only set the connection instance as the active one after a successful start
                    // and only if this effect run hasn't been aborted in the meantime.
                    if (!abortController.signal.aborted) {
                        connectionStateRef.current.connectionInstance =
                            newConnection;
                    }
                    // If the effect run was aborted after start resolved, stop and treat as cancelled
                    if (abortController.signal.aborted) {
                        console.log(
                            "🔄 Start finished but effect already aborted — stopping created connection"
                        );
                        return newConnection.stop();
                    }
                    console.log("✅ WebSocket connection established");
                    connectionStateRef.current.isConnecting = false;
                    connectionStateRef.current.isConnected = true;

                    // Set state after successful connection
                    // Only update the public state if this connection is the active one
                    if (
                        connectionStateRef.current.connectionInstance ===
                        newConnection
                    ) {
                        setWebSocketConnection(newConnection);
                    } else {
                        // If another connection has been marked active, stop this one to avoid duplicates
                        console.log(
                            "⚠️ Start succeeded but another connection became active — stopping this instance"
                        );
                        return newConnection.stop();
                    }

                    // Request connection ID after successful connection
                    return newConnection.invoke("GetConnectionId");
                })
                .then(() => {
                    console.log("🆔 Connection ID requested");
                })
                .catch((error) => {
                    // Reset state on failure
                    connectionStateRef.current.isConnecting = false;
                    connectionStateRef.current.isConnected = false;
                    connectionStateRef.current.connectionInstance = null;

                    // Differentiate between error types
                    const msg = String(error?.message ?? error);

                    const isNetworkError =
                        msg.includes("Failed to fetch") ||
                        msg.includes("Failed to complete negotiation");

                    // Treat an explicit stop during start as a cancellation. The signalr
                    // client returns the message "Failed to start the HttpConnection before stop() was called.".
                    // This happens when React unmounts/re-renders and we call stop() while start() is in-flight
                    // (common in production under route changes or StrictMode in dev).
                    // Consider it cancelled when our AbortController was triggered AND
                    // the start did not finish, OR when the client returns the known
                    // stop-vs-start message. If startFinished is true, a later stop()
                    // was intentional and should not be treated as a start-cancellation.
                    const isCancellation =
                        (!startFinished && abortController.signal.aborted) ||
                        msg.includes("Invocation canceled") ||
                        msg.includes("underlying connection being closed") ||
                        msg.includes(
                            "Failed to start the HttpConnection before stop() was called"
                        );

                    if (isCancellation) {
                        // Expected in React.StrictMode (development only)
                        console.log(
                            "🔄 WebSocket connection cancelled (stop() called while start() was pending)"
                        );
                    } else if (isNetworkError) {
                        console.warn(
                            "⚠️ WebSocket connection failed - backend may be unavailable:",
                            error?.message
                        );
                    } else {
                        console.error("❌ WebSocket connection failed:", error);

                        // Only show user-facing error for non-network/non-cancellation issues
                        enqueueSnackbarRef.current(
                            "Erro ao conectar ao servidor",
                            {
                                variant: "error",
                                autoHideDuration: 5000,
                                anchorOrigin: {
                                    vertical: "bottom",
                                    horizontal: "right",
                                },
                            }
                        );
                    }
                });
        }, 100); // 100ms debounce to allow UserContext to stabilize

        // Cleanup function
        return () => {
            // Signal cancellation to the effect run and any in-flight start operation.
            try {
                abortController.abort();
            } catch {
                /* ignore */
            }
            // Clear debounce timeout on cleanup
            if (userChangeTimeoutRef.current) {
                clearTimeout(userChangeTimeoutRef.current);
                userChangeTimeoutRef.current = null;
            }

            // If we created a connection in this effect run, attempt to stop only that
            // specific instance. This avoids races where another effect created a newer
            // connection and we'd otherwise stop it here.
            const conn = connectionStateRef.current.connectionInstance;
            if (
                conn != null &&
                [
                    HubConnectionState.Connected,
                    HubConnectionState.Connecting,
                    HubConnectionState.Reconnecting,
                ].indexOf(conn.state) === -1
            ) {
                // If a createdConnection exists in this closure, only stop it if it's
                // still the active instance (avoids stopping newer instances created
                // by later effect runs). If it's null, we'll fall back to the active
                // connection from the ref.
                const createdConnectionLocal = createdConnection;

                // Which instance should we stop? Prefer stopping the created one when present
                const instanceToStop = createdConnectionLocal ?? conn;

                const state = instanceToStop.state;

                // Only attempt to stop if not already disconnected
                if (state !== HubConnectionState.Disconnected) {
                    console.log(
                        `🧹 Cleanup: Stopping WebSocket (state: ${HubConnectionState[state]})`
                    );
                    instanceToStop
                        .stop()
                        .catch((err) => {
                            console.error("Error during cleanup:", err);
                        })
                        .finally(() => {
                            // If we stopped the currently active instance, clear refs
                            if (
                                connectionStateRef.current
                                    .connectionInstance === instanceToStop
                            ) {
                                connectionStateRef.current = {
                                    isConnecting: false,
                                    isConnected: false,
                                    currentUserId: null,
                                    connectionInstance: null,
                                };
                                setWebSocketConnection(null);
                                setConnectionId(null);
                            }
                        });
                }
            }
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <WebSocketContext.Provider
            value={{ webSocketConnection, connectionId }}
        >
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocketContext = () => {
    const context = useContext(WebSocketContext);

    if (context == null) {
        throw new Error("You are not inside the context scope");
    }

    return context;
};
