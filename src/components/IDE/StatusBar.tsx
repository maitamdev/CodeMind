"use client";

import { Wifi, Circle, Cpu, CheckCircle2 } from "lucide-react";
import type { LanguageType } from "./useIDEState";

interface StatusBarProps {
    language: LanguageType;
    line: number;
    column: number;
    theme: "light" | "dark";
    aiStatus?: "connected" | "checking" | "disconnected";
    autoSaveStatus: string;
}

const LANG_LABELS: Record<string, string> = {
    html: "HTML5",
    css: "CSS3",
    javascript: "ES6+",
    cpp: "C++17",
    python: "Python 3",
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
            <div className="flex items-center h-full">
                <div className="status-item bg-[rgba(0,0,0,0.2)]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span className="font-bold uppercase tracking-wider text-[9px]">Ready</span>
                </div>
                <div className="status-item">
                    <span className="opacity-60">Source:</span>
                    <span className="font-semibold">{LANG_LABELS[language] || language.toUpperCase()}</span>
                </div>
                <div className="status-item font-mono text-[10px]">
                    <span className="opacity-50">Pos</span>
                    <span>{line}:{column}</span>
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center h-full">
                <div className="status-item">
                    {aiStatus === "connected" ? (
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                            <span className="font-bold uppercase">AI Engine Online</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 opacity-50">
                            <div className="w-2 h-2 rounded-full bg-slate-400" />
                            <span className="uppercase">Connecting AI...</span>
                        </div>
                    )}
                </div>
                
                <div className="status-item border-l border-[rgba(255,255,255,0.1)] px-4">
                    <Cpu className="w-3 h-3 opacity-60" />
                    <span className="font-mono text-[10px] opacity-60">UTF-8</span>
                </div>
            </div>
        </div>
    );
}
