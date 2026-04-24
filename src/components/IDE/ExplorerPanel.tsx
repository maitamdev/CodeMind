"use client";

import { FileType, ChevronDown, Folder } from "lucide-react";
import type { LanguageType } from "./useIDEState";

interface ExplorerPanelProps {
    activeTab: LanguageType;
    onTabChange: (tab: LanguageType) => void;
}

const FILES: { id: LanguageType; label: string; icon: string; color: string }[] = [
    { id: "html", label: "index.html", icon: "html", color: "#e44d26" },
    { id: "css", label: "style.css", icon: "css", color: "#264de4" },
    { id: "javascript", label: "app.js", icon: "js", color: "#f7df1e" },
    { id: "cpp", label: "main.cpp", icon: "cpp", color: "#649ad2" },
];

function FileIcon({ type, color }: { type: string; color: string }) {
    return (
        <span className="text-[11px] font-bold font-mono w-4 text-center" style={{ color }}>
            {type === "html" ? "H" : type === "css" ? "C" : type === "js" ? "JS" : "C+"}
        </span>
    );
}

export default function ExplorerPanel({ activeTab, onTabChange }: ExplorerPanelProps) {
    return (
        <div className="flex flex-col h-full w-full text-[13px]">
            <div className="px-4 py-2 font-semibold text-[11px] uppercase tracking-wider text-[var(--ide-text-muted)]">
                Explorer
            </div>
            <div className="flex-1 overflow-y-auto">
                {/* Project Root Folder */}
                <div className="flex items-center gap-1.5 px-2 py-1.5 text-[var(--ide-text)] hover:bg-[var(--ide-bg-hover)] cursor-pointer select-none">
                    <ChevronDown className="w-4 h-4 text-[var(--ide-text-muted)]" />
                    <Folder className="w-4 h-4 text-blue-400" />
                    <span className="font-medium">MY_PROJECT</span>
                </div>
                
                {/* Files List */}
                <div className="flex flex-col mt-0.5">
                    {FILES.map((file) => (
                        <div
                            key={file.id}
                            className={`flex items-center gap-2 pl-8 pr-2 py-1.5 cursor-pointer select-none transition-colors ${
                                activeTab === file.id
                                    ? "bg-[var(--ide-bg-active)] text-[var(--ide-text)]"
                                    : "text-[var(--ide-text-muted)] hover:bg-[var(--ide-bg-hover)] hover:text-[var(--ide-text)]"
                            }`}
                            onClick={() => onTabChange(file.id)}
                        >
                            <FileIcon type={file.icon} color={file.color} />
                            <span>{file.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
