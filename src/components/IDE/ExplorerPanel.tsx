"use client";

import { 
    ChevronDown, 
    ChevronRight, 
    Folder, 
    FolderOpen, 
    File, 
    Plus, 
    FolderPlus, 
    Trash2, 
    MoreVertical,
    FileCode2,
    FileText,
    FileJson,
    FileType
} from "lucide-react";
import type { FileNode, LanguageType } from "./useIDEState";
import { useState } from "react";

interface ExplorerPanelProps {
    nodes: FileNode[];
    activeFileId: string;
    onFileSelect: (id: string) => void;
    onAddFile: (name: string, parentId: string | null) => void;
    onAddFolder: (name: string, parentId: string | null) => void;
    onDeleteNode: (id: string) => void;
    onRenameNode: (id: string, newName: string) => void;
}

function FileTypeIcon({ name, language, isActive }: { name: string, language?: LanguageType; isActive: boolean }) {
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
            className="w-4 h-4 flex-shrink-0" 
            style={{ color: isActive ? color : "var(--ide-text-faint)" }} 
        />
    );
}

export default function ExplorerPanel({ 
    nodes, 
    activeFileId, 
    onFileSelect,
    onAddFile,
    onAddFolder,
    onDeleteNode,
    onRenameNode
}: ExplorerPanelProps) {
    const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({ "root": true });

    const toggleFolder = (id: string) => {
        setExpandedFolders(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleCreateFile = (parentId: string | null = null) => {
        const name = window.prompt("Nhập tên tệp (ví dụ: main.py):");
        if (name) onAddFile(name, parentId);
    };

    const handleCreateFolder = (parentId: string | null = null) => {
        const name = window.prompt("Nhập tên thư mục:");
        if (name) onAddFolder(name, parentId);
    };

    const renderTree = (parentId: string | null = null, level = 0) => {
        const children = nodes.filter(n => n.parentId === parentId)
            .sort((a, b) => {
                if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
                return a.name.localeCompare(b.name);
            });

        return children.map(node => {
            const isFolder = node.type === "folder";
            const isOpen = expandedFolders[node.id];
            const isActive = activeFileId === node.id;

            return (
                <div key={node.id} className="flex flex-col">
                    <div
                        className={`flex items-center gap-2 px-2 py-1.5 cursor-pointer group rounded-sm mx-1 transition-colors ${
                            isActive ? "bg-[var(--ide-bg-active)]" : "hover:bg-[var(--ide-bg-hover)]"
                        }`}
                        style={{ paddingLeft: `${level * 12 + 8}px` }}
                        onClick={() => isFolder ? toggleFolder(node.id) : onFileSelect(node.id)}
                    >
                        {isFolder ? (
                            isOpen ? <ChevronDown className="w-3.5 h-3.5 text-[var(--ide-text-faint)]" /> : <ChevronRight className="w-3.5 h-3.5 text-[var(--ide-text-faint)]" />
                        ) : (
                            <div className="w-3.5" />
                        )}
                        
                        {isFolder ? (
                            isOpen ? <FolderOpen className="w-4 h-4 text-indigo-400" /> : <Folder className="w-4 h-4 text-indigo-400" />
                        ) : (
                            <FileTypeIcon name={node.name} language={node.language} isActive={isActive} />
                        )}

                        <span className={`text-[12.5px] truncate flex-1 ${isActive ? "text-[var(--ide-text)] font-medium" : "text-[var(--ide-text-muted)]"}`}>
                            {node.name}
                        </span>

                        {/* Actions on Hover */}
                        <div className="hidden group-hover:flex items-center gap-1 opacity-60">
                            {isFolder && (
                                <button onClick={(e) => { e.stopPropagation(); handleCreateFile(node.id); }} title="Tạo tệp">
                                    <Plus className="w-3.5 h-3.5 hover:text-white" />
                                </button>
                            )}
                            <button onClick={(e) => { e.stopPropagation(); if(confirm(`Xoá ${node.name}?`)) onDeleteNode(node.id); }} title="Xoá">
                                <Trash2 className="w-3.5 h-3.5 hover:text-red-400" />
                            </button>
                        </div>
                    </div>

                    {isFolder && isOpen && renderTree(node.id, level + 1)}
                </div>
            );
        });
    };

    return (
        <div className="flex flex-col h-full w-full text-[13px] select-none">
            {/* Header with Actions */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--ide-border-subtle)]">
                <span className="font-semibold text-[11px] uppercase tracking-widest text-[var(--ide-text-faint)]">
                    Explorer
                </span>
                <div className="flex items-center gap-2">
                    <button onClick={() => handleCreateFile(null)} className="p-1 hover:bg-[var(--ide-bg-active)] rounded transition-colors" title="Tạo tệp mới">
                        <Plus className="w-4 h-4 text-[var(--ide-text-muted)]" />
                    </button>
                    <button onClick={() => handleCreateFolder(null)} className="p-1 hover:bg-[var(--ide-bg-active)] rounded transition-colors" title="Tạo thư mục mới">
                        <FolderPlus className="w-4 h-4 text-[var(--ide-text-muted)]" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-2 scrollbar-none">
                {renderTree(null)}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-[var(--ide-border-subtle)] text-[10px] text-[var(--ide-text-faint)] uppercase tracking-tighter">
                {nodes.filter(n => n.type === 'file').length} FILES / {nodes.filter(n => n.type === 'folder').length} FOLDERS
            </div>
        </div>
    );
}
