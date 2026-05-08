"use client";

import Editor, { OnMount } from "@monaco-editor/react";
import {
    configureMonacoEditor,
    getEditorOptions,
} from "../CodePlayground/monacoConfig";
import type { LanguageType } from "./useIDEState";
import { Loader2, Sparkles, X, CornerDownLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type MonacoEditor = Parameters<OnMount>[0];

interface EditorPanelProps {
    code: string;
    language: LanguageType;
    theme: "light" | "dark";
    onChange: (value: string) => void;
    onCursorChange: (line: number, column: number) => void;
    onSave?: () => void;
    editorRef: React.MutableRefObject<MonacoEditor | null>;
}

const MONACO_LANG_MAP: Record<string, string> = {
    html: "html",
    css: "css",
    javascript: "javascript",
    cpp: "cpp",
    python: "python",
    json: "json",
    markdown: "markdown",
    typescript: "typescript",
};

export default function EditorPanel({
    code,
    language,
    theme,
    onChange,
    onCursorChange,
    onSave,
    editorRef,
}: EditorPanelProps) {
    const [showAIPrompt, setShowAIPrompt] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const promptInputRef = useRef<HTMLInputElement>(null);

    // Focus input when shown
    useEffect(() => {
        if (showAIPrompt && promptInputRef.current) {
            promptInputRef.current.focus();
        }
    }, [showAIPrompt]);

    const handleGenerateCode = async () => {
        if (!aiPrompt.trim() || isGenerating) return;
        
        setIsGenerating(true);
        try {
            const editor = editorRef.current;
            const selection = editor?.getSelection();
            const existingCode = selection && !selection.isEmpty()
                ? editor?.getModel()?.getValueInRange(selection)
                : code;

            const res = await fetch("/api/ai/generate-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: aiPrompt,
                    language,
                    existingCode,
                }),
            });
            const data = await res.json();
            
            if (data.error) throw new Error(data.error);

            if (editor && data.code) {
                // If there's a selection, replace it. Otherwise insert at cursor.
                const targetRange = selection && !selection.isEmpty()
                    ? selection
                    : new (window as any).monaco.Range(
                        editor.getPosition()?.lineNumber || 1,
                        editor.getPosition()?.column || 1,
                        editor.getPosition()?.lineNumber || 1,
                        editor.getPosition()?.column || 1
                    );

                editor.executeEdits("ai-generate", [
                    {
                        range: targetRange,
                        text: data.code + "\n",
                        forceMoveMarkers: true
                    }
                ]);
            }
            setShowAIPrompt(false);
            setAiPrompt("");
        } catch (error) {
            console.error("Lỗi khi sinh code:", error);
            alert("Có lỗi xảy ra khi gọi AI sinh code.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;
        configureMonacoEditor(monaco, theme);

        editor.onDidChangeCursorPosition((e) => {
            onCursorChange(e.position.lineNumber, e.position.column);
        });

        // Ctrl+S / Cmd+S
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
            if (onSave) onSave();
        });

        // Ctrl+K / Cmd+K for AI Generation
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
            setShowAIPrompt(true);
        });
    };

    return (
        <div className="flex-1 min-h-0 overflow-hidden relative">
            {/* AI Code Generation Prompt */}
            {showAIPrompt && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[450px] max-w-[90%] bg-[var(--ide-bg-active)] border border-[var(--ide-border)] rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-top-4 fade-in duration-200">
                    <div className="flex items-center gap-2 p-3 bg-indigo-500/10 border-b border-[var(--ide-border)]">
                        <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="text-xs font-semibold text-indigo-400">CodeMind AI Generator</span>
                        <button 
                            onClick={() => setShowAIPrompt(false)}
                            className="ml-auto text-[var(--ide-text-muted)] hover:text-[var(--ide-text)] transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="p-3">
                        <input
                            ref={promptInputRef}
                            type="text"
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleGenerateCode();
                                if (e.key === "Escape") setShowAIPrompt(false);
                            }}
                            placeholder="Nhập yêu cầu sinh code (VD: tạo hàm tính giai thừa)..."
                            disabled={isGenerating}
                            className="w-full bg-[var(--ide-bg)] border border-[var(--ide-border)] rounded-lg px-3 py-2 text-[13px] text-[var(--ide-text)] outline-none focus:border-indigo-500/50 transition-colors placeholder:text-[var(--ide-text-faint)] disabled:opacity-50"
                        />
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 bg-[var(--ide-bg-alt)] border-t border-[var(--ide-border)] text-[10px] text-[var(--ide-text-muted)]">
                        <span>Nhấn <kbd className="px-1 py-0.5 bg-[var(--ide-bg)] border border-[var(--ide-border)] rounded">Esc</kbd> để đóng</span>
                        <button 
                            onClick={handleGenerateCode}
                            disabled={isGenerating || !aiPrompt.trim()}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-[var(--ide-border)] disabled:text-[var(--ide-text-faint)] text-white rounded-md transition-colors font-medium"
                        >
                            {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CornerDownLeft className="w-3.5 h-3.5" />}
                            {isGenerating ? "Đang sinh code..." : "Tạo code"}
                        </button>
                    </div>
                </div>
            )}

            <Editor
                height="100%"
                language={MONACO_LANG_MAP[language] || language}
                value={code}
                theme={
                    theme === "dark"
                        ? "codeplayground-dark"
                        : "codeplayground-light"
                }
                onChange={(value) => onChange(value || "")}
                onMount={handleEditorDidMount}
                options={{
                    fontSize: 13.5,
                    fontFamily:
                        "JetBrains Mono, Fira Code, Cascadia Code, SF Mono, Consolas, monospace",
                    fontLigatures: true,
                    fontWeight: "400",
                    lineHeight: 20,
                    letterSpacing: 0.2,
                    minimap: {
                        enabled: true,
                        maxColumn: 80,
                        renderCharacters: false,
                        scale: 1,
                        showSlider: "mouseover",
                    },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: "on",
                    bracketPairColorization: { enabled: true },
                    guides: {
                        bracketPairs: true,
                        indentation: true,
                        highlightActiveIndentation: true,
                    },
                    renderLineHighlight: "all",
                    renderLineHighlightOnlyWhenFocus: false,
                    cursorBlinking: "smooth",
                    cursorSmoothCaretAnimation: "on",
                    cursorWidth: 2,
                    cursorStyle: "line",
                    smoothScrolling: true,
                    padding: { top: 8, bottom: 8 },
                    suggest: {
                        showMethods: true,
                        showFunctions: true,
                        showConstructors: true,
                        showSnippets: true,
                        showWords: true,
                        preview: true,
                    },
                    parameterHints: { enabled: true },
                    formatOnPaste: true,
                    formatOnType: true,
                    linkedEditing: true,
                    autoClosingBrackets: "always",
                    autoClosingQuotes: "always",
                    autoIndent: "full",
                    stickyScroll: { enabled: false },
                    overviewRulerBorder: false,
                    hideCursorInOverviewRuler: true,
                    scrollbar: {
                        verticalScrollbarSize: 8,
                        horizontalScrollbarSize: 8,
                        useShadows: false,
                    },
                    glyphMargin: false,
                    folding: true,
                    foldingHighlight: true,
                    showFoldingControls: "mouseover",
                    lineDecorationsWidth: 8,
                    lineNumbersMinChars: 3,
                    renderWhitespace: "none",
                }}
                loading={
                    <div className="h-full flex flex-col items-center justify-center bg-[var(--ide-bg)] gap-3">
                        <Loader2 className="w-5 h-5 text-[var(--ide-accent)] animate-spin" />
                        <span className="text-[var(--ide-text-faint)] text-xs">
                            Loading editor...
                        </span>
                    </div>
                }
            />
        </div>
    );
}

export type { MonacoEditor };
