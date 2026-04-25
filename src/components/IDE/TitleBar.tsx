"use client";

import { Sun, Moon, ArrowLeft, GitCommit, Command, Save } from "lucide-react";

interface TitleBarProps {
    activeTab: string;
    fileName: string;
    theme: "light" | "dark";
    onToggleTheme: () => void;
    autoSaveStatus: string;
    onBack?: () => void;
    onSave?: () => void;
    onCommitAndPush?: () => void;
}

export default function TitleBar({
    activeTab,
    fileName,
    theme,
    onToggleTheme,
    autoSaveStatus,
    onBack,
    onSave,
    onCommitAndPush,
}: TitleBarProps) {
    return (
        <div className="ide-titlebar">
            {/* Left: Back + Brand */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <button
                    onClick={() => onBack ? onBack() : window.history.back()}
                    className="w-7 h-7 flex items-center justify-center hover:bg-[var(--ide-bg-active)] transition-colors"
                    title="Quay lại"
                >
                    <ArrowLeft className="w-3.5 h-3.5 text-[var(--ide-text-muted)]" />
                </button>
                <div className="flex items-center gap-1.5 select-none">
                    <div className="bg-[var(--ide-accent)] p-[3px]">
                        <Command className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-[12px] font-bold tracking-tight text-[var(--ide-text)] hidden sm:inline">
                        CodeMind
                    </span>
                </div>
            </div>

            {/* Center: Current file + status (truncates on small screens) */}
            <div className="flex-1 flex items-center justify-center min-w-0 px-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-[var(--ide-bg-active)] border border-[var(--ide-border)] max-w-[300px] min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                    <span className="text-[11px] font-mono text-[var(--ide-text)] truncate">
                        {fileName || "untitled"}
                    </span>
                    <span className="w-px h-3 bg-[var(--ide-border)] flex-shrink-0" />
                    {autoSaveStatus === "saving" ? (
                        <span className="text-[9px] text-amber-400 animate-pulse flex-shrink-0">●</span>
                    ) : (
                        <span className="text-[9px] text-emerald-400 flex-shrink-0">●</span>
                    )}
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
                {onSave && (
                    <button
                        onClick={onSave}
                        className="w-7 h-7 flex items-center justify-center hover:bg-[var(--ide-bg-active)] transition-colors"
                        title="Lưu (Ctrl+S)"
                    >
                        <Save className="w-3.5 h-3.5 text-[var(--ide-text-muted)]" />
                    </button>
                )}

                {onCommitAndPush && (
                    <button
                        onClick={onCommitAndPush}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--ide-accent)] hover:bg-[var(--ide-accent-hover)] text-white text-[10px] font-semibold uppercase tracking-wide transition-colors"
                    >
                        <GitCommit className="w-3 h-3" />
                        <span className="hidden md:inline">Deploy</span>
                    </button>
                )}

                <div className="w-px h-4 bg-[var(--ide-border)] mx-0.5" />

                <button
                    onClick={onToggleTheme}
                    className="w-7 h-7 flex items-center justify-center hover:bg-[var(--ide-bg-active)] transition-colors"
                >
                    {theme === "dark" ? (
                        <Sun className="w-3.5 h-3.5 text-[var(--ide-text-muted)]" />
                    ) : (
                        <Moon className="w-3.5 h-3.5 text-[var(--ide-text-muted)]" />
                    )}
                </button>
            </div>
        </div>
    );
}
