"use client";

import { FC } from "react";
import { Skeleton } from "./index";

interface TableSkeletonProps {
    columns?: number;
    rows?: number;
    showHeader?: boolean;
}

/**
 * Skeleton loading component for tables
 * Displays animated placeholder rows while data is loading
 */
export const TableSkeleton: FC<TableSkeletonProps> = ({
    columns = 4,
    rows = 5,
    showHeader = true,
}) => {
    return (
        <div className="w-full overflow-hidden rounded-xl shadow-md bg-white">
            {/* Header Skeleton */}
            {showHeader && (
                <div className="flex bg-[#4F85A6] p-4 gap-4">
                    {Array.from({ length: columns }).map((_, i) => (
                        <div key={`header-${i}`} className="flex-1">
                            <Skeleton className="h-6 w-full bg-white/20" />
                        </div>
                    ))}
                </div>
            )}

            {/* Body Rows Skeleton */}
            <div className="divide-y divide-gray-100">
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div
                        key={`row-${rowIndex}`}
                        className="flex p-4 gap-4 animate-pulse"
                        style={{
                            animationDelay: `${rowIndex * 100}ms`,
                        }}
                    >
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <div key={`cell-${rowIndex}-${colIndex}`} className="flex-1">
                                <Skeleton className="h-5 w-full" />
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="flex justify-between items-center p-4 border-t border-gray-100">
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                </div>
            </div>
        </div>
    );
};

/**
 * Skeleton for the competition ranking table
 */
export const RankingTableSkeleton: FC<{ rows?: number }> = ({ rows = 5 }) => {
    const exerciseCount = 6; // Typical number of exercises

    return (
        <div className="w-full max-w-7xl">
            {/* Header */}
            <div className="flex bg-[#4F85A6] text-white text-lg font-bold text-center rounded-t-2xl p-4">
                <div className="w-[8%]">
                    <Skeleton className="h-6 w-8 mx-auto bg-white/20" />
                </div>
                <div className="w-[15%]">
                    <Skeleton className="h-6 w-20 bg-white/20" />
                </div>
                <div className="flex flex-1 justify-around">
                    {Array.from({ length: exerciseCount }).map((_, i) => (
                        <div key={`header-ex-${i}`} className="flex-1 flex justify-center">
                            <Skeleton className="h-6 w-6 bg-white/20" />
                        </div>
                    ))}
                </div>
                <div className="w-[12%]">
                    <Skeleton className="h-6 w-16 mx-auto bg-white/20" />
                </div>
            </div>

            {/* Body Rows */}
            <div className="mt-4 space-y-4">
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div
                        key={`ranking-row-${rowIndex}`}
                        className="bg-white rounded-xl shadow-md flex items-center p-4"
                        style={{
                            animationDelay: `${rowIndex * 150}ms`,
                        }}
                    >
                        {/* Position */}
                        <div className="w-[8%] flex justify-center">
                            <Skeleton className="h-8 w-10" />
                        </div>

                        {/* Team name */}
                        <div className="w-[15%] pl-2">
                            <Skeleton className="h-6 w-32" />
                        </div>

                        {/* Exercise cells */}
                        <div className="flex flex-1 justify-around">
                            {Array.from({ length: exerciseCount }).map((_, exIndex) => (
                                <div
                                    key={`cell-${rowIndex}-${exIndex}`}
                                    className="flex-1 flex justify-center"
                                >
                                    <Skeleton className="h-14 w-14 rounded-full" />
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="w-[12%] flex justify-center">
                            <Skeleton className="h-6 w-20" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TableSkeleton;
