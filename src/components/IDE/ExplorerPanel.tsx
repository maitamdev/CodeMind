"use client";

import { 
    ChevronDown, 
    ChevronRight, 
    Folder, 
    FolderOpen, 
    Plus, 
    FolderPlus, 
    Trash2, 
    Pencil,
    FileCode2,
    FileText,
    FileJson
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
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState("");

    const toggleFolder = (id: string) => {
        setExpandedFolders(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleCreateFile = (parentId: string | null = null) => {
        const name = window.prompt("Nhập tên tệp (ví dụ: main.py, utils.ts):");
        if (name?.trim()) onAddFile(name.trim(), parentId);
    };

    const handleCreateFolder = (parentId: string | null = null) => {
        const name = window.prompt("Nhập tên thư mục:");
        if (name?.trim()) onAddFolder(name.trim(), parentId);
    };

    const startRename = (node: FileNode) => {
        setRenamingId(node.id);
        setRenameValue(node.name);
    };

    const confirmRename = () => {
        if (renamingId && renameValue.trim()) {
            onRenameNode(renamingId, renameValue.trim());
        }
        setRenamingId(null);
        setRenameValue("");
    };

    const renderTree = (parentId: string | null = null, level = 0) => {
        const children = nodes.filter(n => n.parentId === parentId)
            .sort((a, b) => {
                // Folders first, then alphabetical
                if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
                return a.name.localeCompare(b.name);
            });

        return children.map(node => {
            const isFolder = node.type === "folder";
            const isOpen = expandedFolders[node.id];
            const isActive = activeFileId === node.id;
            const isRenaming = renamingId === node.id;

            return (
                <div key={node.id} className="flex flex-col">
                    <div
                        className={`flex items-center gap-1.5 pr-2 py-[3px] cursor-pointer group transition-colors ${
                            isActive 
                                ? "bg-[var(--ide-accent-subtle)] text-[var(--ide-text)]" 
                                : "hover:bg-[var(--ide-bg-hover)] text-[var(--ide-text-muted)]"
                        }`}
                        style={{ paddingLeft: `${level * 12 + 8}px` }}
                        onClick={() => isFolder ? toggleFolder(node.id) : onFileSelect(node.id)}
                    >
                        {/* Collapse arrow for folders */}
                        {isFolder ? (
                            isOpen 
                                ? <ChevronDown className="w-3 h-3 text-[var(--ide-text-faint)] flex-shrink-0" /> 
                                : <ChevronRight className="w-3 h-3 text-[var(--ide-text-faint)] flex-shrink-0" />
                        ) : (
                            <div className="w-3 flex-shrink-0" />
                        )}
                        
                        {/* Icon */}
                        {isFolder ? (
                            isOpen 
                                ? <FolderOpen className="w-4 h-4 text-indigo-400 flex-shrink-0" /> 
                                : <Folder className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                        ) : (
                            <FileTypeIcon name={node.name} language={node.language} isActive={isActive} />
                        )}

                        {/* Name or rename input */}
                        {isRenaming ? (
                            <input
                                type="text"
                                value={renameValue}
                                onChange={(e) => setRenameValue(e.target.value)}
                                onBlur={confirmRename}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") confirmRename();
                                    if (e.key === "Escape") { setRenamingId(null); setRenameValue(""); }
                                }}
                                autoFocus
                                className="flex-1 bg-[var(--ide-bg)] border border-[var(--ide-accent)] px-1.5 py-0 text-[12px] text-[var(--ide-text)] outline-none font-mono min-w-0"
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <span className={`text-[12.5px] truncate flex-1 min-w-0 ${
                                isActive ? "font-medium" : ""
                            }`}>
                                {node.name}
                            </span>
                        )}

                        {/* Actions on Hover */}
                        {!isRenaming && (
                            <div className="hidden group-hover:flex items-center gap-0.5 flex-shrink-0">
                                {isFolder && (
                                    <>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleCreateFile(node.id); }} 
                                            title="Tạo tệp trong thư mục"
                                            className="p-0.5 hover:bg-[var(--ide-bg-active)] transition-colors"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleCreateFolder(node.id); }} 
                                            title="Tạo thư mục con"
                                            className="p-0.5 hover:bg-[var(--ide-bg-active)] transition-colors"
                                        >
                                            <FolderPlus className="w-3.5 h-3.5" />
                                        </button>
                                    </>
                                )}
                                <button 
                                    onClick={(e) => { e.stopPropagation(); startRename(node); }} 
                                    title="Đổi tên"
                                    className="p-0.5 hover:bg-[var(--ide-bg-active)] transition-colors"
                                >
                                    <Pencil className="w-3 h-3" />
                                </button>
                                <button 
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        if (confirm(`Xóa "${node.name}"?`)) onDeleteNode(node.id); 
                                    }} 
                                    title="Xóa"
                                    className="p-0.5 hover:bg-[var(--ide-bg-active)] hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Render children if folder is expanded */}
                    {isFolder && isOpen && renderTree(node.id, level + 1)}
                </div>
            );
        });
    };

    return (
        <div className="flex flex-col h-full w-full text-[13px] select-none">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-[var(--ide-border)]">
                <span className="font-semibold text-[11px] uppercase tracking-widest text-[var(--ide-text-faint)]">
                    Explorer
                </span>
                <div className="flex items-center gap-1">
                    <button 
                        onClick={() => handleCreateFile(null)} 
                        className="p-1 hover:bg-[var(--ide-bg-active)] transition-colors" 
                        title="Tạo tệp mới"
                    >
                        <Plus className="w-4 h-4 text-[var(--ide-text-muted)]" />
                    </button>
                    <button 
                        onClick={() => handleCreateFolder(null)} 
                        className="p-1 hover:bg-[var(--ide-bg-active)] transition-colors" 
                        title="Tạo thư mục mới"
                    >
                        <FolderPlus className="w-4 h-4 text-[var(--ide-text-muted)]" />
                    </button>
                </div>
            </div>

            {/* Tree */}
            <div className="flex-1 overflow-y-auto py-1 scrollbar-none">
                {renderTree(null)}
            </div>

            {/* Footer */}
            <div className="px-3 py-1.5 border-t border-[var(--ide-border)] text-[10px] text-[var(--ide-text-faint)] uppercase tracking-wider">
                {nodes.filter(n => n.type === 'file').length} tệp · {nodes.filter(n => n.type === 'folder').length} thư mục
            </div>
        </div>
    );
}
