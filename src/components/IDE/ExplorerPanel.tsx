"use client";

import { ChevronDown, ChevronRight, Folder, FolderOpen } from "lucide-react";
import type { LanguageType } from "./useIDEState";
import { useState } from "react";

interface ExplorerPanelProps {
    activeTab: LanguageType;
    onTabChange: (tab: LanguageType) => void;
}

const FILES: { id: LanguageType; label: string; icon: string; color: string }[] = [
    { id: "html", label: "index.html", icon: "H", color: "#ef4444" },
    { id: "css", label: "style.css", icon: "#", color: "#3b82f6" },
    { id: "javascript", label: "app.js", icon: "JS", color: "#eab308" },
    { id: "cpp", label: "main.cpp", icon: "C+", color: "#06b6d4" },
];

function FileTypeIcon({ icon, color, isActive }: { icon: string; color: string; isActive: boolean }) {
    return (
        <span
            className="text-[10px] font-bold font-mono w-[18px] h-[18px] flex items-center justify-center rounded-[3px] flex-shrink-0"
            style={{
                color: isActive ? color : "var(--ide-text-faint)",
                background: isActive ? `${color}18` : "transparent",
            }}
        >
            {icon}
        </span>
    );
}

export default function ExplorerPanel({ activeTab, onTabChange }: ExplorerPanelProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="flex flex-col h-full w-full text-[13px]">
            {/* Header */}
            <div className="px-4 py-3 font-semibold text-[11px] uppercase tracking-widest text-[var(--ide-text-faint)] border-b border-[var(--ide-border-subtle)]">
                Explorer
            </div>

            <div className="flex-1 overflow-y-auto py-1">
                {/* Project Root */}
                <div
                    className="flex items-center gap-1.5 px-3 py-2 text-[var(--ide-text)] hover:bg-[var(--ide-bg-hover)] cursor-pointer select-none transition-colors rounded-md mx-1"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? (
                        <>
                            <ChevronDown className="w-3.5 h-3.5 text-[var(--ide-text-faint)]" />
                            <FolderOpen className="w-4 h-4 text-indigo-400" />
                        </>
                    ) : (
                        <>
                            <ChevronRight className="w-3.5 h-3.5 text-[var(--ide-text-faint)]" />
                            <Folder className="w-4 h-4 text-indigo-400" />
                        </>
                    )}
                    <span className="font-semibold text-[12px] tracking-wide">MY_PROJECT</span>
                </div>

                {/* Files List */}
                {isExpanded && (
                    <div className="flex flex-col gap-0.5 mt-0.5 mx-1">
                        {FILES.map((file) => {
                            const isActive = activeTab === file.id;

                            return (
                                <div
                                    key={file.id}
                                    className={`flex items-center gap-2.5 pl-9 pr-3 py-[6px] cursor-pointer select-none transition-all rounded-md group ${
                                        isActive
                                            ? "bg-[var(--ide-accent-subtle)] text-[var(--ide-text)]"
                                            : "text-[var(--ide-text-muted)] hover:bg-[var(--ide-bg-hover)] hover:text-[var(--ide-text)]"
                                    }`}
                                    onClick={() => onTabChange(file.id)}
                                >
                                    <FileTypeIcon icon={file.icon} color={file.color} isActive={isActive} />
                                    <span className="text-[12.5px]">{file.label}</span>
                                    {isActive && (
                                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--ide-accent)]" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Footer info */}
            <div className="px-4 py-2.5 border-t border-[var(--ide-border-subtle)] text-[10px] text-[var(--ide-text-faint)]">
                4 tệp trong dự án
            </div>
        </div>
    );
}
