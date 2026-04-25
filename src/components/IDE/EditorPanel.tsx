"use client";

import Editor, { OnMount } from "@monaco-editor/react";
import {
    configureMonacoEditor,
    getEditorOptions,
} from "../CodePlayground/monacoConfig";
import type { LanguageType } from "./useIDEState";
import { Loader2 } from "lucide-react";

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
    };

    return (
        <div className="flex-1 min-h-0 overflow-hidden relative">
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
