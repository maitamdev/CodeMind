"use client";

import { X, FileCode2, FileText, FileJson } from "lucide-react";
import type { FileNode, LanguageType } from "./useIDEState";

interface TabBarProps {
    activeFileId: string;
    nodes: FileNode[];
    onFileSelect: (id: string) => void;
    onCloseFile: (id: string) => void;
}

function TabIcon({ name, language, isActive }: { name: string, language?: LanguageType; isActive: boolean }) {
    const ext = name.split('.').pop()?.toLowerCase();
    
    let Icon = FileText;
    let color = "var(--ide-text-muted)";

    if (ext === 'html') { Icon = FileCode2; color = "#ef4444"; }
    else if (ext === 'css') { Icon = FileCode2; color = "#3b82f6"; }
    else if (ext === 'js' || ext === 'javascript') { Icon = FileCode2; color = "#eab308"; }
    else if (ext === 'cpp' || ext === 'c') { Icon = FileCode2; color = "#06b6d4"; }
    else if (ext === 'py') { Icon = FileCode2; color = "#34d399"; }
    else if (ext === 'json') { Icon = FileJson; color = "#a78bfa"; }
    else if (ext === 'md') { Icon = FileText; color = "#fb923c"; }

    return (
        <Icon 
            className="w-3.5 h-3.5" 
            style={{ color: isActive ? color : "inherit", opacity: isActive ? 1 : 0.6 }} 
        />
    );
}

export default function TabBar({ activeFileId, nodes, onFileSelect, onCloseFile }: TabBarProps) {
    // For now, we'll just show all files as "open" tabs for simplicity, 
    // or we could filter to show only recently active ones.
    const openFiles = nodes.filter(n => n.type === "file");

    return (
        <div className="ide-tabbar scrollbar-none">
            {openFiles.map((file) => {
                const isActive = activeFileId === file.id;

                return (
                    <div
                        key={file.id}
                        className={`ide-tab ${isActive ? "active" : ""}`}
                        onClick={() => onFileSelect(file.id)}
                    >
                        <TabIcon name={file.name} language={file.language} isActive={isActive} />
                        <span className={`tracking-tight ${isActive ? "font-semibold" : "opacity-70"}`}>
                            {file.name}
                        </span>
                        {isActive && (
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--ide-accent)] ml-1" />
                        )}
                        <div
                            className="tab-close ml-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCloseFile(file.id);
                            }}
                        >
                            <X className="w-3 h-3" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
