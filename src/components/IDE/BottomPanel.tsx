"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
    Globe,
    Terminal,
    AlertTriangle,
    Trash2,
    CheckSquare,
    Square,
    ChevronRight,
    Maximize2,
} from "lucide-react";
import type { BottomTab, ConsoleLog, CodeState } from "./useIDEState";
import { generatePreviewHTML } from "../CodePlayground/utils";

interface BottomPanelProps {
    activeTab: BottomTab;
    onTabChange: (tab: BottomTab) => void;
    consoleLogs: ConsoleLog[];
    onClearLogs: () => void;
    clearLogsOnUpdate: boolean;
    onClearLogsOnUpdateChange: (value: boolean) => void;
    code: CodeState;
    height: number;
    onHeightChange: (height: number) => void;
    theme: "light" | "dark";
}

export default function BottomPanel({
    activeTab,
    onTabChange,
    consoleLogs,
    onClearLogs,
    clearLogsOnUpdate,
    onClearLogsOnUpdateChange,
    code,
    height,
    onHeightChange,
    theme,
}: BottomPanelProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const executionRef = useRef(0);
    const prevCodeRef = useRef<CodeState>(code);
    const [isDragging, setIsDragging] = useState(false);
    const [consoleInput, setConsoleInput] = useState("");
    const terminalEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom of console when new logs arrive
    useEffect(() => {
        if (activeTab === "console" && terminalEndRef.current) {
            terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [consoleLogs, activeTab]);

    // Live preview update
    useEffect(() => {
        const timer = setTimeout(() => {
            const codeChanged =
                prevCodeRef.current.html !== code.html ||
                prevCodeRef.current.css !== code.css ||
                prevCodeRef.current.javascript !== code.javascript;
            prevCodeRef.current = code;

            if (clearLogsOnUpdate && codeChanged) {
                onClearLogs();
            }
            executionRef.current += 1;
            if (iframeRef.current?.contentWindow) {
                const previewHTML = generatePreviewHTML(
                    code as any,
                    executionRef.current,
                );
                iframeRef.current.srcdoc = previewHTML;
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [code, clearLogsOnUpdate, onClearLogs]);

    // Handle resize drag
    const handleResizeStart = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            setIsDragging(true);
            const startY = e.clientY;
            const startHeight = height;

            const handleMove = (e: MouseEvent) => {
                const diff = startY - e.clientY;
                const newHeight = Math.max(
                    100,
                    Math.min(window.innerHeight * 0.6, startHeight + diff),
                );
                onHeightChange(newHeight);
            };

            const handleUp = () => {
                setIsDragging(false);
                window.removeEventListener("mousemove", handleMove);
                window.removeEventListener("mouseup", handleUp);
            };

            window.addEventListener("mousemove", handleMove);
            window.addEventListener("mouseup", handleUp);
        },
        [height, onHeightChange],
    );

    const tabs: { id: BottomTab; label: string; icon: typeof Globe }[] = [
        { id: "console", label: "Terminal", icon: Terminal },
        { id: "preview", label: "Preview", icon: Globe },
        { id: "problems", label: "Vấn đề", icon: AlertTriangle },
    ];

    const getLogStyle = (log: ConsoleLog) => {
        if (log.type === "error")
            return "text-red-400 bg-red-500/8 border-l-2 border-red-500/60";
        if (log.type === "warn")
            return "text-amber-400 bg-amber-500/8 border-l-2 border-amber-500/60";
        if (log.type === "info" && log.message.startsWith(">"))
            return "text-indigo-400 font-medium";
        return "text-[var(--ide-text)] hover:bg-[var(--ide-bg-hover)]";
    };

    return (
        <div className="ide-bottom-panel" style={{ height }}>
            {/* Resize handle */}
            <div
                className={`ide-resize-handle ${isDragging ? "dragging" : ""}`}
                onMouseDown={handleResizeStart}
            />

            {/* Tabs */}
            <div className="ide-bottom-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`ide-bottom-tab ${activeTab === tab.id ? "active" : ""}`}
                        onClick={() => onTabChange(tab.id)}
                    >
                        <tab.icon className="w-3.5 h-3.5 mr-1.5" />
                        {tab.label}
                        {tab.id === "console" && consoleLogs.length > 0 && (
                            <span className="ml-2 px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-[var(--ide-accent-subtle)] text-[var(--ide-accent)] border border-[var(--ide-accent-glow)]">
                                {consoleLogs.length}
                            </span>
                        )}
                    </button>
                ))}

                {activeTab === "console" && (
                    <div className="ml-auto flex items-center gap-1.5">
                        <button
                            type="button"
                            role="checkbox"
                            aria-checked={clearLogsOnUpdate}
                            onClick={() => onClearLogsOnUpdateChange(!clearLogsOnUpdate)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md cursor-pointer text-[var(--ide-text-muted)] hover:text-[var(--ide-text)] hover:bg-[var(--ide-bg-hover)] transition-all text-[11px]"
                            title="Xóa log cũ khi code thay đổi"
                        >
                            {clearLogsOnUpdate ? (
                                <CheckSquare className="w-3.5 h-3.5 text-[var(--ide-accent)]" />
                            ) : (
                                <Square className="w-3.5 h-3.5" />
                            )}
                            <span className="uppercase tracking-wider font-medium">Tự động xóa</span>
                        </button>
                        {consoleLogs.length > 0 && (
                            <button
                                onClick={onClearLogs}
                                className="p-1.5 text-[var(--ide-text-muted)] hover:text-[var(--ide-text)] hover:bg-[var(--ide-bg-hover)] rounded-md transition-all"
                                title="Xóa tất cả log"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto bg-[var(--ide-bg)] relative">
                {/* Preview iframe (always mounted) */}
                <iframe
                    ref={iframeRef}
                    className={`w-full h-full border-0 absolute inset-0 ${
                        activeTab !== "preview" ? "invisible" : ""
                    }`}
                    sandbox="allow-scripts allow-same-origin"
                    title="Live Preview"
                    style={{
                        background: "#ffffff",
                        pointerEvents: activeTab !== "preview" ? "none" : undefined,
                        borderRadius: activeTab === "preview" ? "0" : undefined,
                    }}
                />

                {/* Terminal / Console */}
                {activeTab === "console" && (
                    <div
                        className="relative z-10 flex flex-col h-full font-mono text-[13px]"
                        onClick={() => inputRef.current?.focus()}
                    >
                        <div className="flex-1 overflow-auto p-3 space-y-0.5 scrollbar-thin">
                            {consoleLogs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-3 text-[var(--ide-text-faint)]">
                                    <Terminal className="w-8 h-8 opacity-30" />
                                    <div className="text-center">
                                        <p className="text-sm font-medium">CodeMind Terminal v2.0</p>
                                        <p className="text-xs mt-1 opacity-60">Nhập lệnh JavaScript bên dưới để thực thi</p>
                                    </div>
                                </div>
                            ) : (
                                consoleLogs.map((log, i) => (
                                    <div
                                        key={i}
                                        className={`flex items-start gap-3 py-1.5 px-2.5 rounded-md transition-colors ${getLogStyle(log)}`}
                                    >
                                        <span className="text-[10px] text-[var(--ide-text-faint)] flex-shrink-0 mt-1 font-mono tabular-nums">
                                            {new Date(log.timestamp).toLocaleTimeString("vi-VN", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                            })}
                                        </span>
                                        <span className="whitespace-pre-wrap break-all leading-relaxed">
                                            {log.message}
                                        </span>
                                    </div>
                                ))
                            )}
                            <div ref={terminalEndRef} />
                        </div>

                        {/* Interactive Terminal Input */}
                        <div className="flex items-center gap-2 p-2.5 border-t border-[var(--ide-border)] bg-[var(--ide-bg-alt)]">
                            <ChevronRight className="w-4 h-4 text-[var(--ide-accent)] flex-shrink-0" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={consoleInput}
                                onChange={(e) => setConsoleInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && consoleInput.trim()) {
                                        if (iframeRef.current?.contentWindow) {
                                            iframeRef.current.contentWindow.postMessage({
                                                type: "eval",
                                                code: consoleInput,
                                                executionId: executionRef.current
                                            }, "*");
                                        }
                                        setConsoleInput("");
                                    }
                                }}
                                placeholder="Nhập lệnh JavaScript..."
                                className="flex-1 bg-transparent border-none outline-none text-[var(--ide-text)] placeholder-[var(--ide-text-faint)] font-mono text-[13px] caret-[var(--ide-accent)]"
                                autoComplete="off"
                                spellCheck="false"
                            />
                        </div>
                    </div>
                )}

                {/* Problems tab */}
                {activeTab === "problems" && (
                    <div className="relative z-10 flex items-center justify-center h-full text-[var(--ide-text-faint)]">
                        <div className="text-center">
                            <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            <p className="text-sm font-medium">Không có vấn đề nào</p>
                            <p className="text-xs mt-1 opacity-60">Code của bạn đang sạch ✨</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
