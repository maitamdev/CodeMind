"use client";

import { Sun, Moon, ArrowLeft, GitCommit, Zap } from "lucide-react";
import type { LanguageType } from "./useIDEState";

const FILE_NAMES: Record<LanguageType, string> = {
    html: "index.html",
    css: "style.css",
    javascript: "app.js",
    cpp: "main.cpp",
};

interface TitleBarProps {
    activeTab: LanguageType;
    theme: "light" | "dark";
    onToggleTheme: () => void;
    autoSaveStatus: string;
    onBack?: () => void;
    onCommitAndPush?: () => void;
}

export default function TitleBar({
    activeTab,
    theme,
    onToggleTheme,
    autoSaveStatus,
    onBack,
    onCommitAndPush,
}: TitleBarProps) {
    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            window.history.back();
        }
    };

    return (
        <div className="ide-titlebar">
            {/* Left: Back + Branding */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                    onClick={handleBack}
                    className="flex items-center justify-center w-7 h-7 rounded-md text-[var(--ide-text-muted)] hover:text-[var(--ide-text)] hover:bg-[var(--ide-bg-hover)] transition-all"
                    title="Quay lại"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
                        <Zap className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-[13px] font-semibold tracking-tight text-[var(--ide-text)]">
                        CodeMind
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--ide-accent-subtle)] text-[var(--ide-accent)] border border-[var(--ide-accent-glow)]">
                        IDE
                    </span>
                </div>
            </div>

            {/* Center: File + Save status */}
            <div className="flex items-center gap-2.5">
                <span className="text-[13px] font-mono text-[var(--ide-text)]">
                    {FILE_NAMES[activeTab]}
                </span>
                {autoSaveStatus === "saving" && (
                    <span className="text-[10px] text-[var(--ide-text-faint)] animate-pulse">
                        đang lưu...
                    </span>
                )}
                {autoSaveStatus === "saved" && (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                        đã lưu
                    </span>
                )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5 flex-1 justify-end">
                {onCommitAndPush && (
                    <button
                        onClick={onCommitAndPush}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold rounded-md transition-all shadow-sm hover:shadow-emerald-500/20 hover:shadow-md active:scale-[0.97]"
                        title="Commit & Push lên Profile"
                    >
                        <GitCommit className="w-3.5 h-3.5" />
                        <span>Commit & Push</span>
                    </button>
                )}
                <div className="w-px h-5 bg-[var(--ide-border)] mx-1" />
                <button
                    onClick={onToggleTheme}
                    className="w-8 h-8 flex items-center justify-center rounded-md text-[var(--ide-text-muted)] hover:text-[var(--ide-text)] hover:bg-[var(--ide-bg-hover)] transition-all"
                    title={theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}
                >
                    {theme === "dark" ? (
                        <Sun className="w-4 h-4" />
                    ) : (
                        <Moon className="w-4 h-4" />
                    )}
                </button>
            </div>
        </div>
    );
}
