"use client";

import { Wifi, WifiOff, Circle } from "lucide-react";
import type { LanguageType } from "./useIDEState";

interface StatusBarProps {
    language: LanguageType;
    line: number;
    column: number;
    theme: "light" | "dark";
    aiStatus?: "connected" | "checking" | "disconnected";
    autoSaveStatus: string;
}

const LANG_LABELS: Record<LanguageType, string> = {
    html: "HTML",
    css: "CSS",
    javascript: "JavaScript",
    cpp: "C++",
};

const LANG_ICONS: Record<LanguageType, string> = {
    html: "{ }",
    css: "# ",
    javascript: "λ ",
    cpp: "⟨⟩",
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
            <div className="flex items-center">
                <div className="status-item gap-1.5">
                    <span className="font-mono text-[10px] opacity-70">{LANG_ICONS[language]}</span>
                    <span className="font-medium">{LANG_LABELS[language]}</span>
                </div>
                <div className="status-item">
                    <span className="font-mono">
                        Ln {line}, Col {column}
                    </span>
                </div>
                <div className="status-item opacity-70">
                    <span>Spaces: 2</span>
                </div>
                <div className="status-item opacity-70">
                    <span>UTF-8</span>
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center">
                {autoSaveStatus === "saving" && (
                    <div className="status-item animate-pulse">
                        <span>Đang lưu...</span>
                    </div>
                )}
                <div className="status-item">
                    {aiStatus === "connected" ? (
                        <>
                            <Circle className="w-2 h-2 fill-emerald-300 text-emerald-300" />
                            <span>AI Online</span>
                        </>
                    ) : aiStatus === "checking" ? (
                        <>
                            <Circle className="w-2 h-2 fill-amber-300 text-amber-300 animate-pulse" />
                            <span>AI Checking...</span>
                        </>
                    ) : (
                        <>
                            <Circle className="w-2 h-2 fill-red-400 text-red-400" />
                            <span>AI Offline</span>
                        </>
                    )}
                </div>
                <div className="status-item opacity-60">
                    <span>CodeMind v2.0</span>
                </div>
            </div>
        </div>
    );
}
