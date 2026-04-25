"use client";

import { useState, useCallback, useEffect } from "react";

export type LanguageType = "html" | "css" | "javascript" | "cpp" | "python" | "json" | "markdown" | "typescript";

export interface FileNode {
    id: string;
    name: string;
    type: "file" | "folder";
    content?: string;
    parentId: string | null;
    language?: LanguageType;
}

export type CodeState = Record<string, string>;

export interface IDEPanels {
    bottom: boolean;
    agent: boolean;
    explorer: boolean;
}

export type BottomTab = "preview" | "console" | "problems";
export type ActivityView = "explorer" | "search" | "ai" | null;

export interface ConsoleLog {
    type: "log" | "error" | "warn" | "info";
    message: string;
    timestamp: number;
}

const DEFAULT_NODES: FileNode[] = [
    {
        id: "1",
        name: "index.html",
        type: "file",
        content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello World!</h1>\n</body>\n</html>',
        parentId: null,
        language: "html"
    },
    {
        id: "2",
        name: "style.css",
        type: "file",
        content: "body {\n  font-family: sans-serif;\n  margin: 0;\n  padding: 20px;\n  background: #f0f0f0;\n}\n\nh1 {\n  color: #333;\n}",
        parentId: null,
        language: "css"
    },
    {
        id: "3",
        name: "app.js",
        type: "file",
        content: '// JavaScript\nconsole.log("Hello from JavaScript!");\n\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));',
        parentId: null,
        language: "javascript"
    },
    {
        id: "4",
        name: "main.cpp",
        type: "file",
        content: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, C++!" << endl;\n    return 0;\n}',
        parentId: null,
        language: "cpp"
    }
];

const STORAGE_KEY_PREFIX = "ide_playground_v2_";

export function useIDEState(
    lessonId: string,
    initialFileId: string = "1",
) {
    // Filesystem state
    const [nodes, setNodes] = useState<FileNode[]>(() => {
        if (typeof window === "undefined") return DEFAULT_NODES;
        try {
            const saved = localStorage.getItem(
                `${STORAGE_KEY_PREFIX}fs_${lessonId || "scratch"}`,
            );
            return saved ? JSON.parse(saved) : DEFAULT_NODES;
        } catch {
            return DEFAULT_NODES;
        }
    });

    const [activeFileId, setActiveFileId] = useState<string>(initialFileId);
    const [isCodeLoaded, setIsCodeLoaded] = useState(false);

    // Sync active tab if file is deleted
    useEffect(() => {
        if (!nodes.find(n => n.id === activeFileId && n.type === "file")) {
            const firstFile = nodes.find(n => n.type === "file");
            if (firstFile) setActiveFileId(firstFile.id);
        }
    }, [nodes, activeFileId]);

    // Code state for compatibility with legacy components
    const code = nodes.reduce((acc, node) => {
        if (node.type === "file") {
            acc[node.id] = node.content || "";
        }
        return acc;
    }, {} as Record<string, string>);

    const activeFile = nodes.find(n => n.id === activeFileId);

    // Save to local storage whenever nodes change
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem(`${STORAGE_KEY_PREFIX}fs_${lessonId || "scratch"}`, JSON.stringify(nodes));
        }
    }, [nodes, lessonId]);

    // Theme
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        if (typeof window === "undefined") return "dark";
        return (
            (localStorage.getItem("ide_theme") as "light" | "dark") || "dark"
        );
    });

    // Panel visibility
    const [panels, setPanels] = useState<IDEPanels>({
        bottom: true,
        agent: true,
        explorer: true,
    });

    const [activeView, setActiveView] = useState<ActivityView>("explorer");
    const [bottomTab, setBottomTab] = useState<BottomTab>("preview");
    const [bottomHeight, setBottomHeight] = useState(220);
    const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);
    const [clearLogsOnUpdate, setClearLogsOnUpdate] = useState(() => {
        if (typeof window === "undefined") return false;
        try {
            return localStorage.getItem("ide_console_clear_on_update") === "true";
        } catch {
            return false;
        }
    });

    const setClearLogsOnUpdateWithStorage = useCallback((value: boolean) => {
        setClearLogsOnUpdate(value);
        try {
            localStorage.setItem("ide_console_clear_on_update", String(value));
        } catch {
            /* ignore */
        }
    }, []);

    const [cursorPosition, setCursorPosition] = useState({
        line: 1,
        column: 1,
    });

    // --- FS Operations ---
    const updateFileContent = useCallback((id: string, content: string) => {
        setNodes(prev => prev.map(n => n.id === id ? { ...n, content } : n));
    }, []);

    const addFile = useCallback((name: string, parentId: string | null = null) => {
        const ext = name.split('.').pop() || '';
        const langMap: Record<string, LanguageType> = {
            html: 'html', css: 'css', js: 'javascript', cpp: 'cpp', py: 'python', 
            json: 'json', md: 'markdown', ts: 'typescript'
        };
        const newNode: FileNode = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            type: "file",
            content: "",
            parentId,
            language: langMap[ext] || 'javascript'
        };
        setNodes(prev => [...prev, newNode]);
        setActiveFileId(newNode.id);
    }, []);

    const addFolder = useCallback((name: string, parentId: string | null = null) => {
        const newNode: FileNode = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            type: "folder",
            parentId
        };
        setNodes(prev => [...prev, newNode]);
    }, []);

    const deleteNode = useCallback((id: string) => {
        setNodes(prev => {
            // Recursive delete for folders
            const idsToDelete = new Set([id]);
            const findChildren = (pid: string) => {
                prev.forEach(n => {
                    if (n.parentId === pid) {
                        idsToDelete.add(n.id);
                        if (n.type === "folder") findChildren(n.id);
                    }
                });
            };
            const node = prev.find(n => n.id === id);
            if (node?.type === "folder") findChildren(id);
            
            return prev.filter(n => !idsToDelete.has(n.id));
        });
    }, []);

    const renameNode = useCallback((id: string, newName: string) => {
        setNodes(prev => prev.map(n => n.id === id ? { ...n, name: newName } : n));
    }, []);

    // --- Compatibility Methods ---
    const updateCode = useCallback((value: string) => {
        updateFileContent(activeFileId, value);
    }, [activeFileId, updateFileContent]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => {
            const next = prev === "dark" ? "light" : "dark";
            localStorage.setItem("ide_theme", next);
            return next;
        });
    }, []);

    const toggleActivityView = useCallback((view: ActivityView) => {
        setActiveView((prev) => (prev === view ? null : view));
        if (view === "ai") {
            setPanels((prev) => ({ ...prev, agent: !prev.agent }));
        }
    }, []);

    const resetCode = useCallback(() => {
        setNodes(DEFAULT_NODES);
        setConsoleLogs([]);
    }, []);

    return {
        nodes,
        code,
        activeFileId,
        activeFile,
        theme,
        panels,
        activeView,
        bottomTab,
        bottomHeight,
        consoleLogs,
        clearLogsOnUpdate,
        setClearLogsOnUpdate: setClearLogsOnUpdateWithStorage,
        cursorPosition,
        setActiveFileId,
        updateFileContent,
        addFile,
        addFolder,
        deleteNode,
        renameNode,
        updateCode,
        toggleTheme,
        toggleActivityView,
        setBottomTab,
        setBottomHeight,
        setCursorPosition,
        addConsoleLog: (log: ConsoleLog) => setConsoleLogs(prev => [...prev, log]),
        clearConsoleLogs: () => setConsoleLogs([]),
        resetCode,
        isCodeLoaded: true, // simplified for now
    };
}
