"use client";

import { CheckCircle2, Cpu } from "lucide-react";
import type { LanguageType } from "./useIDEState";

interface StatusBarProps {
    language: string;
    line: number;
    column: number;
    theme: "light" | "dark";
    aiStatus?: "connected" | "checking" | "disconnected";
    autoSaveStatus: string;
}

const LANG_LABELS: Record<string, string> = {
    html: "HTML",
    css: "CSS",
    javascript: "JavaScript",
    cpp: "C++",
    python: "Python",
    json: "JSON",
    markdown: "Markdown",
    typescript: "TypeScript",
};

export default function StatusBar({
    language,
    line,
    column,
    theme,
    aiStatus = "checking",
    autoSaveStatus,
}: StatusBarProps) {
    return (
        <div className="ide-statusbar">
            {/* Left */}
            <div className="flex items-center h-full overflow-hidden">
                <div className="status-item">
                    <CheckCircle2 className="w-3 h-3" />
                    <span className="text-[10px] font-semibold hidden sm:inline">Ready</span>
                </div>
                <div className="status-item">
                    <span className="text-[10px]">{LANG_LABELS[language] || language}</span>
                </div>
                <div className="status-item" style={{ fontFamily: "var(--ide-font-mono)" }}>
                    <span className="text-[10px]">Ln {line}, Col {column}</span>
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center h-full overflow-hidden">
                <div className="status-item">
                    {aiStatus === "connected" ? (
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span className="text-[10px] hidden sm:inline">AI Online</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 opacity-50">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                            <span className="text-[10px] hidden sm:inline">AI Offline</span>
                        </div>
                    )}
                </div>
                <div className="status-item">
                    <span className="text-[10px]">UTF-8</span>
                </div>
            </div>
        </div>
    );
}
