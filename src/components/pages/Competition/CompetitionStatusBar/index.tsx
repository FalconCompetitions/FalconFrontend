/**
 * Competition Status Bar Component
 * 
 * Real-time status bar for competitions showing:
 * - Competition name and description
 * - Connection status (connected/disconnected)
 * - Competition status (ongoing/ended/waiting)
 * - Live countdown timer
 * - Submission status (open/blocked)
 * - Ranking status (active/frozen)
 * - Number of exercises
 * 
 * Usage:
 * ```tsx
 * import { CompetitionStatusBar } from "@/components/pages/Competition/CompetitionStatusBar";
 * 
 * <CompetitionStatusBar />
 * ```
 * 
 * This component uses the CompetitionHubContext and requires:
 * - User to be authenticated
 * - WebSocket connection to be established
 * - CompetitionHubProvider to wrap the app
 */
"use client";

import React, { useEffect, useState } from "react";
import { useCompetitionStatus } from "@/contexts/CompetitionHubContext/hooks";
import { 
    FaCircle, 
    FaCheckCircle, 
    FaTimesCircle, 
    FaClock, 
    FaTrophy, 
    FaExclamationTriangle,
    FaCode,
    FaHourglassHalf,
    FaSyncAlt
} from "react-icons/fa";
import { formatDateWithoutTimezone } from "@/libs/utils";

/**
 * Competition Status Bar - Shows real-time competition status, timer, and info.
 * Designed to match the project's UI style with #4F85A6 color scheme.
 */
export const CompetitionStatusBar: React.FC = () => {
    const {
        ongoingCompetition,
        isConnected,
        hasActiveCompetition,
        competitionStatus,
        canSubmit,
        isRankingActive,
        timeRemaining,
    } = useCompetitionStatus();

    const [currentTime, setCurrentTime] = useState(new Date());

    // Update timer every second for smooth countdown
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (!isConnected) {
        return (
            <div className="bg-red-100 border-b border-red-300 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-red-800">
                        <div className="flex items-center gap-2">
                            <FaExclamationTriangle className="w-5 h-5 animate-pulse" />
                            <span className="font-medium text-sm sm:text-base">⚠️ Desconectado do servidor. Tentando reconectar...</span>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors flex items-center gap-2 font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            aria-label="Recarregar página"
                        >
                            <FaSyncAlt className="w-4 h-4" />
                            Recarregar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!hasActiveCompetition) {
        return (
            <div className="bg-gray-100 border-b border-gray-300 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                        <FaTimesCircle className="w-5 h-5" />
                        <span className="font-medium">Nenhuma competição ativa no momento</span>
                    </div>
                </div>
            </div>
        );
    }

    // Get status badge styling
    const getStatusBadge = () => {
        if (competitionStatus?.isEnded) {
            return {
                bg: "bg-red-500",
                icon: <FaTimesCircle className="w-4 h-4" />,
                text: "Encerrada",
            };
        }
        if (competitionStatus?.isOngoing) {
            return {
                bg: "bg-green-500",
                icon: <FaCheckCircle className="w-4 h-4" />,
                text: "Em Andamento",
            };
        }
        return {
            bg: "bg-yellow-500",
            icon: <FaHourglassHalf className="w-4 h-4" />,
            text: "Aguardando Início",
        };
    };

    const statusBadge = getStatusBadge();

    // Calculate timer urgency level
    const getTimerUrgency = () => {
        if (!timeRemaining) return "ended";
        const totalSeconds = timeRemaining.hours * 3600 + timeRemaining.minutes * 60 + timeRemaining.seconds;
        if (totalSeconds <= 5 * 60) return "critical"; // <= 5 minutes
        if (totalSeconds <= 10 * 60) return "warning"; // <= 10 minutes
        return "normal";
    };

    const timerUrgency = getTimerUrgency();
    
    const timerStyles = {
        critical: "bg-red-600 text-white animate-pulse",
        warning: "bg-orange-500 text-white",
        normal: "bg-[#4F85A6] text-white",
        ended: "bg-gray-400 text-white"
    };

    return (
        <div className="bg-white border-b border-gray-200 shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3">
                {/* Main Status Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                    {/* Competition Info */}
                    <div className="flex items-center gap-3">
                        <FaTrophy className="w-6 h-6 text-[#4F85A6]" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                {ongoingCompetition!.name}
                            </h2>
                            {ongoingCompetition!.description && (
                                <p className="text-sm text-gray-600">
                                    {ongoingCompetition!.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex items-center gap-3">
                        {/* Connection Indicator */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100">
                            <FaCircle 
                                className={`w-2 h-2 ${isConnected ? "text-green-500 animate-pulse" : "text-red-500"}`} 
                            />
                            <span className="text-sm font-medium text-gray-700">
                                {isConnected ? "Conectado" : "Desconectado"}
                            </span>
                        </div>

                        {/* Competition Status */}
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-white ${statusBadge.bg}`}>
                            {statusBadge.icon}
                            <span className="text-sm font-semibold">{statusBadge.text}</span>
                        </div>
                    </div>
                </div>

                {/* Info Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {/* Timer Card */}
                    <div className={`flex items-center gap-3 p-3 rounded-lg shadow transition-colors ${timerStyles[timerUrgency]}`}>
                        <FaClock className={`w-5 h-5 ${timerUrgency === 'critical' ? 'animate-bounce' : ''}`} />
                        <div>
                            <p className="text-xs font-light opacity-90">
                                {timerUrgency === 'critical' ? '⚠️ Tempo Restante' : 'Tempo Restante'}
                            </p>
                            {timeRemaining ? (
                                <p className={`text-lg font-bold font-mono ${timerUrgency === 'critical' ? 'text-xl' : ''}`}>
                                    {timeRemaining.hours.toString().padStart(2, "0")}:
                                    {timeRemaining.minutes.toString().padStart(2, "0")}:
                                    {timeRemaining.seconds.toString().padStart(2, "0")}
                                </p>
                            ) : (
                                <p className="text-lg font-bold text-white/70">Encerrada</p>
                            )}
                        </div>
                    </div>

                    {/* Submissions Card */}
                    <div className={`flex items-center gap-3 p-3 rounded-lg shadow ${
                        canSubmit ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                        {canSubmit ? (
                            <FaCheckCircle className="w-5 h-5" />
                        ) : (
                            <FaExclamationTriangle className="w-5 h-5" />
                        )}
                        <div>
                            <p className="text-xs font-light">Submissões</p>
                            <p className="text-lg font-bold">
                                {canSubmit ? "Abertas" : "Bloqueadas"}
                            </p>
                        </div>
                    </div>

                    {/* Exercises Card */}
                    <div className="flex items-center gap-3 p-3 bg-blue-50 text-blue-800 rounded-lg shadow">
                        <FaCode className="w-5 h-5" />
                        <div>
                            <p className="text-xs font-light">Exercícios</p>
                            <p className="text-lg font-bold">
                                {ongoingCompetition!.exercises?.length || 0}
                            </p>
                        </div>
                    </div>

                    {/* Ranking Status Card */}
                    <div className={`flex items-center gap-3 p-3 rounded-lg shadow ${
                        isRankingActive ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-600"
                    }`}>
                        <FaTrophy className="w-5 h-5" />
                        <div>
                            <p className="text-xs font-light">Ranking</p>
                            <p className="text-lg font-bold">
                                {isRankingActive ? "Ativo" : "Congelado"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Competition Ended Alert */}
                {competitionStatus?.isEnded && (
                    <div className="mt-3 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800 text-center font-medium">
                            ⏰ Competição encerrada em{" "}
                            {ongoingCompetition!.endTime 
                                ? formatDateWithoutTimezone(ongoingCompetition!.endTime.toString())
                                : "data desconhecida"
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompetitionStatusBar;