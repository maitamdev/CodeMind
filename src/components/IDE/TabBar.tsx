"use client";

import { X, FileCode2, FileText, FileJson } from "lucide-react";
import type { FileNode, LanguageType } from "./useIDEState";

interface TabBarProps {
    activeFileId: string;
    openTabIds: string[];
    nodes: FileNode[];
    onFileSelect: (id: string) => void;
    onCloseTab: (id: string) => void;
}

function TabIcon({ name, language, isActive }: { name: string, language?: LanguageType; isActive: boolean }) {
    const ext = name.split('.').pop()?.toLowerCase();
    
    let Icon = FileText;
    let color = "var(--ide-text-muted)";

    if (ext === 'html' || ext === 'htm') { Icon = FileCode2; color = "#ef4444"; }
    else if (ext === 'css') { Icon = FileCode2; color = "#3b82f6"; }
    else if (ext === 'js' || ext === 'jsx') { Icon = FileCode2; color = "#eab308"; }
    else if (ext === 'ts' || ext === 'tsx') { Icon = FileCode2; color = "#3b82f6"; }
    else if (ext === 'cpp' || ext === 'c' || ext === 'h') { Icon = FileCode2; color = "#06b6d4"; }
    else if (ext === 'py') { Icon = FileCode2; color = "#34d399"; }
    else if (ext === 'json') { Icon = FileJson; color = "#a78bfa"; }
    else if (ext === 'md') { Icon = FileText; color = "#fb923c"; }

    return (
        <Icon 
            className="w-3.5 h-3.5 flex-shrink-0" 
            style={{ color: isActive ? color : "inherit", opacity: isActive ? 1 : 0.5 }} 
        />
    );
}

export default function TabBar({ activeFileId, openTabIds, nodes, onFileSelect, onCloseTab }: TabBarProps) {
    // Only show files that are in the openTabIds list (VS Code behavior)
    const openFiles = openTabIds
        .map(id => nodes.find(n => n.id === id))
        .filter((n): n is FileNode => n != null && n.type === "file");

    if (openFiles.length === 0) {
        return (
            <div className="ide-tabbar scrollbar-none">
                <div className="flex items-center px-4 h-full text-[12px] text-[var(--ide-text-faint)] italic">
                    Không có tệp nào đang mở
                </div>
            </div>
        );
    }

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
                        <span className={`tracking-tight text-[12px] ${isActive ? "font-medium" : "opacity-60"}`}>
                            {file.name}
                        </span>
                        <div
                            className="tab-close ml-1"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCloseTab(file.id);
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
