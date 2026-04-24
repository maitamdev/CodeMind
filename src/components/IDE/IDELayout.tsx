"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useIDEState, type LanguageType } from "./useIDEState";
import { useAutoSave } from "./useAutoSave";
import TitleBar from "./TitleBar";
import ActivityBar from "./ActivityBar";
import TabBar from "./TabBar";
import EditorPanel, { type MonacoEditor } from "./EditorPanel";
import BottomPanel from "./BottomPanel";
import StatusBar from "./StatusBar";
import ExplorerPanel from "./ExplorerPanel";
import SearchPanel from "./SearchPanel";
import { AIAgentPanel, AIErrorBoundary } from "../AIAssistant";
import type { ConsoleLog } from "./useIDEState";
import "./ide.css";

const LANGUAGE_LABELS: Record<LanguageType, string> = {
    html: "HTML",
    css: "CSS",
    javascript: "JavaScript",
    cpp: "C++",
};

interface IDELayoutProps {
    lessonId?: string;
    initialLanguage?: LanguageType;
    hideAIAgent?: boolean;
    onBack?: () => void;
}

export default function IDELayout({
    lessonId = "",
    initialLanguage = "html",
    hideAIAgent = false,
    onBack,
}: IDELayoutProps) {
    const {
        code,
        activeTab,
        theme,
        panels,
        activeView,
        bottomTab,
        bottomHeight,
        consoleLogs,
        clearLogsOnUpdate,
        setClearLogsOnUpdate,
        cursorPosition,
        setActiveTab,
        updateCode,
        updateCodeByTab,
        toggleTheme,
        togglePanel,
        toggleActivityView,
        setBottomTab,
        setBottomHeight,
        setCursorPosition,
        addConsoleLog,
        clearConsoleLogs,
        resetCode,
        isCodeLoaded,
    } = useIDEState(lessonId, initialLanguage);

    const editorRef = useRef<MonacoEditor | null>(null);
    const autoSaveStatus = useAutoSave(code, lessonId, isCodeLoaded);
    const [aiServerStatus, setAiServerStatus] = useState<
        "connected" | "checking" | "disconnected"
    >("checking");

    // AI health check
    useEffect(() => {
        const checkHealth = async () => {
            try {
                const res = await fetch("/api/ai/health");
                const data = await res.json();
                setAiServerStatus(
                    data.status === "connected" ? "connected" : "disconnected",
                );
            } catch {
                setAiServerStatus("disconnected");
            }
        };
        checkHealth();
        const interval = setInterval(checkHealth, 30000);
        return () => clearInterval(interval);
    }, []);

    // Handle console messages from preview iframe
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === "console") {
                const newLog: ConsoleLog = {
                    type: event.data.level || "log",
                    message: event.data.message || "",
                    timestamp: Date.now(),
                };
                addConsoleLog(newLog);
            }
        };
        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [addConsoleLog]);

    // Insert code from AI
    const handleInsertCode = useCallback(
        (insertedCode: string) => {
            if (editorRef.current) {
                const selection = editorRef.current.getSelection();
                if (selection) {
                    editorRef.current.executeEdits("ai-insert", [
                        {
                            range: selection,
                            text: insertedCode,
                        },
                    ]);
                }
            } else {
                updateCode(code[activeTab] + "\n" + insertedCode);
            }
        },
        [activeTab, code, updateCode],
    );

    // Agent edit_code: update tab content + switch to edited tab so user sees the change
    const handleEditCode = useCallback(
        (tab: "html" | "css" | "javascript", content: string) => {
            updateCodeByTab(tab, content);
            setActiveTab(tab);
        },
        [updateCodeByTab, setActiveTab],
    );

    const handleCommitAndPush = async () => {
        const msg = window.prompt("Nhập nội dung commit (ví dụ: 'Hoàn thành giao diện đăng nhập'):");
        if (!msg) return;

        const projectName = window.prompt("Nhập tên Project để hiển thị trên Profile (để trống sẽ dùng tên mặc định):") || undefined;

        try {
            const res = await fetch("/api/user/code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    lessonId: lessonId || "scratch",
                    action: "commit",
                    message: msg,
                    isPublic: true, // Publish to profile
                    projectName: projectName,
                    ...code
                })
            });
            if (res.ok) {
                alert("🎉 Đã Commit và Push thành công lên Profile của bạn!");
            } else {
                alert("❌ Có lỗi xảy ra, vui lòng thử lại sau.");
            }
        } catch (error) {
            alert("❌ Lỗi kết nối mạng!");
        }
    };

    // --- Custom Resizing Logic ---
    const [sidebarWidth, setSidebarWidth] = useState(250);
    const [agentWidth, setAgentWidth] = useState(400);
    const [isResizing, setIsResizing] = useState<"sidebar" | "agent" | null>(null);

    const handleSidebarResizeStart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing("sidebar");
        const startX = e.clientX;
        const startWidth = sidebarWidth;

        const handleMove = (e: MouseEvent) => {
            const diff = e.clientX - startX;
            setSidebarWidth(Math.max(150, Math.min(600, startWidth + diff)));
        };

        const handleUp = () => {
            setIsResizing(null);
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseup", handleUp);
        };

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", handleUp);
    }, [sidebarWidth]);

    const handleAgentResizeStart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing("agent");
        const startX = e.clientX;
        const startWidth = agentWidth;

        const handleMove = (e: MouseEvent) => {
            const diff = startX - e.clientX;
            setAgentWidth(Math.max(250, Math.min(800, startWidth + diff)));
        };

        const handleUp = () => {
            setIsResizing(null);
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseup", handleUp);
        };

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", handleUp);
    }, [agentWidth]);

    const isSidebarOpen = activeView === "explorer" || activeView === "search";
    const isAgentOpen = !hideAIAgent && panels.agent;

    const gridStyle = {
        gridTemplateColumns: `48px ${isSidebarOpen ? `${sidebarWidth}px` : "0px"} 1fr ${isAgentOpen ? `${agentWidth}px` : "0px"}`,
        // Prevent pointer events on iframe while resizing so drag doesn't get interrupted
        pointerEvents: isResizing ? "none" as const : "auto" as const
    };

    return (
        <div className={`ide-root ${theme === "light" ? "light" : ""}`}>
            <div className={`ide-grid ${panels.agent ? "agent-open" : ""} ${(activeView === "explorer" || activeView === "search") ? "sidebar-open" : ""}`} style={gridStyle}>
                {/* Title Bar */}
                <TitleBar
                    activeTab={activeTab}
                    theme={theme}
                    onToggleTheme={toggleTheme}
                    autoSaveStatus={autoSaveStatus}
                    onBack={onBack}
                    onCommitAndPush={handleCommitAndPush}
                />

                {/* Activity Bar */}
                <ActivityBar
                    activeView={activeView}
                    onToggleView={toggleActivityView}
                    agentOpen={panels.agent}
                    hideAIAgent={hideAIAgent}
                />

                {/* Sidebar Panel */}
                {(activeView === "explorer" || activeView === "search") && (
                    <div className="ide-sidebar">
                        {activeView === "explorer" && (
                            <ExplorerPanel
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                            />
                        )}
                        {activeView === "search" && (
                            <SearchPanel
                                code={code}
                                onResultClick={(tab, line, column) => {
                                    setActiveTab(tab);
                                    setCursorPosition({ line, column });
                                }}
                            />
                        )}
                        {/* Custom Resize Handle for Sidebar */}
                        <div 
                            className={`ide-grid-resize-handle sidebar-handle ${isResizing === "sidebar" ? "dragging" : ""}`}
                            onMouseDown={handleSidebarResizeStart}
                        />
                    </div>
                )}

                {/* Editor Area */}
                <div className="ide-editor flex flex-col overflow-hidden bg-[var(--ide-bg)]">
                    {/* Tab Bar */}
                    <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

                    {/* Editor */}
                    <EditorPanel
                        code={code[activeTab]}
                        language={activeTab}
                        theme={theme}
                        onChange={updateCode}
                        onCursorChange={(line, col) =>
                            setCursorPosition({ line, column: col })
                        }
                        editorRef={editorRef}
                    />

                    {/* Bottom Panel */}
                    {panels.bottom && (
                        <BottomPanel
                            activeTab={bottomTab}
                            onTabChange={setBottomTab}
                            consoleLogs={consoleLogs}
                            onClearLogs={clearConsoleLogs}
                            clearLogsOnUpdate={clearLogsOnUpdate}
                            onClearLogsOnUpdateChange={setClearLogsOnUpdate}
                            code={code}
                            height={bottomHeight}
                            onHeightChange={setBottomHeight}
                            theme={theme}
                        />
                    )}
                </div>

                {/* AI Agent Panel */}
                {!hideAIAgent && panels.agent && (
                    <div className="ide-agent overflow-hidden relative">
                        {/* Custom Resize Handle for Agent */}
                        <div 
                            className={`ide-grid-resize-handle agent-handle ${isResizing === "agent" ? "dragging" : ""}`}
                            onMouseDown={handleAgentResizeStart}
                        />
                        <AIErrorBoundary fallbackMessage="AI Agent tạm thời không hoạt động.">
                            <AIAgentPanel
                                codeContext={code[activeTab]}
                                language={LANGUAGE_LABELS[activeTab]}
                                onInsertCode={handleInsertCode}
                                code={code}
                                onEditCode={handleEditCode}
                                theme={theme}
                                aiServerStatus={aiServerStatus}
                            />
                        </AIErrorBoundary>
                    </div>
                )}

                {/* Status Bar */}
                <StatusBar
                    language={activeTab}
                    line={cursorPosition.line}
                    column={cursorPosition.column}
                    theme={theme}
                    aiStatus={aiServerStatus}
                    autoSaveStatus={autoSaveStatus}
                />
            </div>
        </div>
    );
}
