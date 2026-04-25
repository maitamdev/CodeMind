"use client";

import { Sun, Moon, ArrowLeft, GitCommit, Zap, Command } from "lucide-react";
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
            {/* Left: Branding */}
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={handleBack}
                    className="p-1 hover:bg-[var(--ide-bg-active)] transition-colors"
                    title="Quay lại"
                >
                    <ArrowLeft className="w-4 h-4 text-[var(--ide-text-muted)]" />
                </button>

                <div className="flex items-center gap-2 select-none">
                    <div className="bg-[var(--ide-accent)] p-1 rounded-sm shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                        <Command className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-[13px] font-bold tracking-tight text-[var(--ide-text)] uppercase">
                            CodeMind
                        </span>
                        <span className="text-[10px] text-[var(--ide-text-muted)] font-mono opacity-50 uppercase tracking-widest">
                            v2.1
                        </span>
                    </div>
                </div>
            </div>

            {/* Center: File Status */}
            <div className="flex items-center gap-3 px-4 py-1.5 bg-[var(--ide-bg-active)] border border-[var(--ide-border)] rounded-sm">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    <span className="text-[12px] font-mono text-[var(--ide-text)] font-medium">
                        {FILE_NAMES[activeTab]}
                    </span>
                </div>
                <div className="w-px h-3 bg-[var(--ide-border)]" />
                {autoSaveStatus === "saving" ? (
                    <span className="text-[10px] text-[var(--ide-text-muted)] italic animate-pulse">
                        đang lưu...
                    </span>
                ) : (
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-tighter">
                        SYNCED
                    </span>
                )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 flex-1 justify-end">
                {onCommitAndPush && (
                    <button
                        onClick={onCommitAndPush}
                        className="flex items-center gap-2 px-4 py-1.5 bg-white text-black hover:bg-slate-200 text-[11px] font-bold uppercase tracking-wide transition-all shadow-lg active:scale-95"
                    >
                        <GitCommit className="w-3.5 h-3.5" />
                        <span>Deploy to Profile</span>
                    </button>
                )}
                
                <div className="w-px h-4 bg-[var(--ide-border)] mx-1" />
                
                <button
                    onClick={onToggleTheme}
                    className="w-8 h-8 flex items-center justify-center hover:bg-[var(--ide-bg-active)] transition-colors"
                >
                    {theme === "dark" ? (
                        <Sun className="w-4 h-4 text-[var(--ide-text-muted)]" />
                    ) : (
                        <Moon className="w-4 h-4 text-[var(--ide-text-muted)]" />
                    )}
                </button>
            </div>
        </div>
    );
}
