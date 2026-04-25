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

const LANGUAGE_LABELS: Record<string, string> = {
    html: "HTML",
    css: "CSS",
    javascript: "JavaScript",
    cpp: "C++",
    python: "Python",
    json: "JSON",
    markdown: "Markdown",
    typescript: "TypeScript",
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
        nodes,
        code,
        activeFileId,
        activeFile,
        openTabIds,
        theme,
        panels,
        activeView,
        bottomTab,
        bottomHeight,
        consoleLogs,
        clearLogsOnUpdate,
        setClearLogsOnUpdate,
        cursorPosition,
        setActiveFileId,
        openFile,
        closeTab,
        updateFileContent,
        updateCode,
        addFile,
        addFolder,
        deleteNode,
        renameNode,
        toggleTheme,
        toggleActivityView,
        setBottomTab,
        setBottomHeight,
        setCursorPosition,
        addConsoleLog,
        clearConsoleLogs,
        resetCode,
        isCodeLoaded,
    } = useIDEState(lessonId);

    const editorRef = useRef<MonacoEditor | null>(null);
    // Compatibility: useAutoSave needs the full code object which is now derived from nodes
    const autoSaveStatus = useAutoSave(code as any, lessonId, isCodeLoaded);
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
            } else if (activeFile) {
                updateCode(activeFile.content + "\n" + insertedCode);
            }
        },
        [activeFile, updateCode],
    );

    // Agent edit_code: update tab content + switch to edited tab so user sees the change
    const handleEditCode = useCallback(
        (tab: string, content: string) => {
            // Map legacy 'javascript' etc to actual files if possible
            const node = nodes.find(n => n.language === tab || n.name.toLowerCase().includes(tab));
            if (node) {
                updateFileContent(node.id, content);
                setActiveFileId(node.id);
            }
        },
        [nodes, updateFileContent, setActiveFileId],
    );

    const handleManualSave = async () => {
        try {
            // Save locally
            const key = `ide_playground_code_${lessonId || "scratch"}`;
            localStorage.setItem(key, JSON.stringify(code));
            
            // Save to cloud
            const res = await fetch("/api/user/code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    lessonId: lessonId || "scratch",
                    ...code
                })
            });

            if (res.ok) {
                // We can use a toast or just rely on the autoSaveStatus in TitleBar
            }
        } catch (error) {
            console.error("Save error:", error);
        }
    };

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
                    activeTab={activeFile?.language || "javascript"}
                    fileName={activeFile?.name || ""}
                    theme={theme}
                    onToggleTheme={toggleTheme}
                    autoSaveStatus={autoSaveStatus}
                    onBack={onBack}
                    onSave={handleManualSave}
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
                                nodes={nodes}
                                activeFileId={activeFileId}
                                onFileSelect={setActiveFileId}
                                onAddFile={addFile}
                                onAddFolder={addFolder}
                                onDeleteNode={deleteNode}
                                onRenameNode={renameNode}
                            />
                        )}
                        {activeView === "search" && (
                            <SearchPanel
                                code={code as any}
                                onResultClick={(fileId, line, column) => {
                                    setActiveFileId(fileId);
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
                    <TabBar 
                        activeFileId={activeFileId} 
                        openTabIds={openTabIds}
                        nodes={nodes} 
                        onFileSelect={openFile} 
                        onCloseTab={closeTab}
                    />

                    {/* Editor or Welcome */}
                    {activeFile ? (
                        <EditorPanel
                            code={activeFile.content || ""}
                            language={activeFile.language || "javascript"}
                            theme={theme}
                            onChange={updateCode}
                            onCursorChange={(line, col) =>
                                setCursorPosition({ line, column: col })
                            }
                            onSave={handleManualSave}
                            editorRef={editorRef}
                        />
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-[var(--ide-bg)]">
                            <div className="text-center space-y-4 select-none">
                                <div className="text-6xl opacity-10">⌨️</div>
                                <p className="text-[var(--ide-text-faint)] text-sm">
                                    Mở file từ Explorer hoặc tạo file mới để bắt đầu
                                </p>
                                <div className="flex gap-3 justify-center text-[11px] text-[var(--ide-text-faint)]">
                                    <kbd className="px-2 py-1 border border-[var(--ide-border)] bg-[var(--ide-bg-alt)]">Ctrl+S</kbd>
                                    <span className="opacity-50">Lưu</span>
                                    <kbd className="px-2 py-1 border border-[var(--ide-border)] bg-[var(--ide-bg-alt)]">Ctrl+N</kbd>
                                    <span className="opacity-50">Tạo mới</span>
                                </div>
                            </div>
                        </div>
                    )}

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
                                codeContext={activeFile?.content || ""}
                                language={activeFile?.language || "javascript"}
                                onInsertCode={handleInsertCode}
                                code={code as any}
                                onEditCode={handleEditCode as any}
                                theme={theme}
                                aiServerStatus={aiServerStatus}
                            />
                        </AIErrorBoundary>
                    </div>
                )}

                {/* Status Bar */}
                <StatusBar
                    language={activeFile?.language || "javascript"}
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
