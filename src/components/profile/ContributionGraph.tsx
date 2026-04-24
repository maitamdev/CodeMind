"use client";

import { useMemo, useState } from "react";


interface Project {
    id: string;
    commits?: Array<{ timestamp: string }>;
}

interface ContributionGraphProps {
    projects: Project[];
}

export default function ContributionGraph({ projects }: ContributionGraphProps) {
    // 1. Calculate the date range (last 365 days)
    const { days, activityMap, maxCommits } = useMemo(() => {
        const map = new Map<string, number>();
        let max = 0;

        // Aggregate commits
        projects.forEach((project) => {
            if (project.commits && Array.isArray(project.commits)) {
                project.commits.forEach((commit) => {
                    if (!commit.timestamp) return;
                    const dateObj = new Date(commit.timestamp);
                    if (isNaN(dateObj.getTime())) return;
                    
                    const dateStr = dateObj.toISOString().split("T")[0];
                    const current = (map.get(dateStr) || 0) + 1;
                    map.set(dateStr, current);
                    if (current > max) max = current;
                });
            }
        });

        // Generate exactly 365 days ending today
        const today = new Date();
        const daysArray: { date: string; count: number; dateObj: Date }[] = [];
        
        // Find the start date (364 days ago)
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 364);
        
        // Adjust start date to be the Sunday of that week to make the grid align perfectly
        const startDayOfWeek = startDate.getDay();
        startDate.setDate(startDate.getDate() - startDayOfWeek);

        const current = new Date(startDate);
        while (current <= today || current.getDay() !== 0) { // pad until end of week
            if (current > today && current.getDay() === 0) break;
            
            const dateStr = current.toISOString().split("T")[0];
            daysArray.push({
                date: dateStr,
                count: map.get(dateStr) || 0,
                dateObj: new Date(current),
            });
            current.setDate(current.getDate() + 1);
        }

        return { days: daysArray, activityMap: map, maxCommits: max };
    }, [projects]);

    // Calculate level based on count (GitHub style 0-4)
    const getLevel = (count: number) => {
        if (count === 0) return 0;
        if (count === 1) return 1;
        if (count <= 3) return 2;
        if (count <= 6) return 3;
        return 4;
    };

    const getColorClass = (level: number) => {
        switch (level) {
            case 1: return "bg-green-200 border-green-300 dark:bg-green-900/40 dark:border-green-900";
            case 2: return "bg-green-400 border-green-500 dark:bg-green-700/60 dark:border-green-700";
            case 3: return "bg-green-500 border-green-600 dark:bg-green-500/80 dark:border-green-500";
            case 4: return "bg-green-600 border-green-700 dark:bg-green-400 dark:border-green-400";
            default: return "bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700";
        }
    };

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const totalCommits = Array.from(activityMap.values()).reduce((a, b) => a + b, 0);

    return (
        <div className="w-full rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_-15px_rgba(15,23,42,0.1)] dark:bg-slate-900 dark:border-slate-800">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white mb-4">
                {totalCommits} contributions in the last year
            </h2>
            
            <div className="flex flex-col overflow-x-auto pb-4">
                <div className="inline-flex gap-1 min-w-max">
                    {/* Y-axis labels (Days of week) */}
                    <div className="flex flex-col gap-1 pr-2 pt-[20px] text-[10px] text-slate-400 font-medium">
                        <div className="h-3 leading-3"></div>
                        <div className="h-3 leading-3">Mon</div>
                        <div className="h-3 leading-3"></div>
                        <div className="h-3 leading-3">Wed</div>
                        <div className="h-3 leading-3"></div>
                        <div className="h-3 leading-3">Fri</div>
                        <div className="h-3 leading-3"></div>
                    </div>

                    {/* The Grid */}
                    <div className="flex flex-col gap-1">
                        {/* X-axis labels (Months) */}
                        <div className="flex h-4 text-[10px] text-slate-400 font-medium relative w-full mb-1">
                            {(() => {
                                const months: React.ReactNode[] = [];
                                let lastMonth = -1;
                                days.forEach((day, i) => {
                                    if (i % 7 !== 0) return; // Only check on start of column
                                    const month = day.dateObj.getMonth();
                                    if (month !== lastMonth && i < days.length - 14) {
                                        months.push(
                                            <div key={i} className="absolute" style={{ left: `${(i / 7) * 16}px` }}>
                                                {monthNames[month]}
                                            </div>
                                        );
                                        lastMonth = month;
                                    }
                                });
                                return months;
                            })()}
                        </div>

                        {/* Squares */}
                        <div className="flex gap-1">
                            {Array.from({ length: Math.ceil(days.length / 7) }).map((_, colIndex) => (
                                <div key={colIndex} className="flex flex-col gap-1">
                                    {Array.from({ length: 7 }).map((_, rowIndex) => {
                                        const dayIndex = colIndex * 7 + rowIndex;
                                        const day = days[dayIndex];
                                        if (!day) return <div key={rowIndex} className="w-3 h-3" />; // empty space
                                        
                                        const level = getLevel(day.count);
                                        
                                        return (
                                            <div
                                                key={rowIndex}
                                                className={`group relative w-3 h-3 rounded-[2px] border transition-all hover:ring-2 hover:ring-slate-400 hover:ring-offset-1 dark:hover:ring-offset-slate-900 cursor-pointer ${getColorClass(level)}`}
                                            >
                                                {/* Simple Hover Tooltip */}
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden w-max rounded bg-slate-900 px-2.5 py-1.5 text-xs text-white opacity-0 transition-opacity group-hover:block group-hover:opacity-100 z-50 pointer-events-none">
                                                    <strong>{day.count} contributions</strong> on {day.dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    {/* Triangle pointer */}
                                                    <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-2 flex items-center justify-end gap-2 text-[11px] text-slate-500">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-[2px] border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"></div>
                    <div className="w-3 h-3 rounded-[2px] border border-green-300 bg-green-200 dark:border-green-900 dark:bg-green-900/40"></div>
                    <div className="w-3 h-3 rounded-[2px] border border-green-500 bg-green-400 dark:border-green-700 dark:bg-green-700/60"></div>
                    <div className="w-3 h-3 rounded-[2px] border border-green-600 bg-green-500 dark:border-green-500 dark:bg-green-500/80"></div>
                    <div className="w-3 h-3 rounded-[2px] border border-green-700 bg-green-600 dark:border-green-400 dark:bg-green-400"></div>
                </div>
                <span>More</span>
            </div>
        </div>
    );
}
