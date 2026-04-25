"use client";

import { useState, useMemo, useCallback } from "react";
import {
    Search as SearchIcon,
    FileText,
    FolderOpen,
    ChevronRight,
    ChevronDown,
    CaseSensitive,
    Regex,
    Replace,
    ReplaceAll,
    X,
} from "lucide-react";
import type { FileNode } from "./useIDEState";

interface SearchPanelProps {
    nodes: FileNode[];
    onResultClick: (fileId: string, line: number, column: number) => void;
    onReplaceInFile?: (fileId: string, search: string, replace: string, all: boolean) => void;
}

interface SearchMatch {
    fileId: string;
    fileName: string;
    filePath: string;
    lines: { line: number; text: string; col: number; matchLen: number }[];
}

/** Build the display path for a file by walking up parentId chain */
function buildPath(node: FileNode, nodesMap: Map<string, FileNode>): string {
    const parts: string[] = [node.name];
    let current = node;
    while (current.parentId) {
        const parent = nodesMap.get(current.parentId);
        if (!parent) break;
        parts.unshift(parent.name);
        current = parent;
    }
    return parts.join("/");
}

export default function SearchPanel({ nodes, onResultClick, onReplaceInFile }: SearchPanelProps) {
    const [query, setQuery] = useState("");
    const [replaceText, setReplaceText] = useState("");
    const [showReplace, setShowReplace] = useState(false);
    const [caseSensitive, setCaseSensitive] = useState(false);
    const [useRegex, setUseRegex] = useState(false);
    const [expandedFiles, setExpandedFiles] = useState<Record<string, boolean>>({});

    const toggleFile = useCallback((id: string) => {
        setExpandedFiles(prev => ({ ...prev, [id]: !prev[id] }));
    }, []);

    // Pre-compute nodes map for path building
    const nodesMap = useMemo(() => {
        const map = new Map<string, FileNode>();
        nodes.forEach(n => map.set(n.id, n));
        return map;
    }, [nodes]);

    // Core search across all FileNodes recursively
    const results = useMemo((): SearchMatch[] => {
        const q = query.trim();
        if (!q) return [];

        const matches: SearchMatch[] = [];
        const files = nodes.filter(n => n.type === "file" && n.content);

        let searchFn: (text: string) => { col: number; len: number }[];

        if (useRegex) {
            try {
                const flags = caseSensitive ? "g" : "gi";
                const re = new RegExp(q, flags);
                searchFn = (text: string) => {
                    const hits: { col: number; len: number }[] = [];
                    let m: RegExpExecArray | null;
                    while ((m = re.exec(text)) !== null) {
                        hits.push({ col: m.index + 1, len: m[0].length });
                        if (!m[0].length) re.lastIndex++; // avoid infinite loop on zero-width match
                    }
                    return hits;
                };
            } catch {
                // Invalid regex — return empty
                return [];
            }
        } else {
            const needle = caseSensitive ? q : q.toLowerCase();
            searchFn = (text: string) => {
                const haystack = caseSensitive ? text : text.toLowerCase();
                const hits: { col: number; len: number }[] = [];
                let start = 0;
                let idx: number;
                while ((idx = haystack.indexOf(needle, start)) !== -1) {
                    hits.push({ col: idx + 1, len: needle.length });
                    start = idx + 1;
                }
                return hits;
            };
        }

        for (const file of files) {
            const lines = file.content!.split("\n");
            const fileMatches: SearchMatch["lines"] = [];

            for (let i = 0; i < lines.length; i++) {
                const hits = searchFn(lines[i]);
                for (const hit of hits) {
                    fileMatches.push({
                        line: i + 1,
                        text: lines[i].trim(),
                        col: hit.col,
                        matchLen: hit.len,
                    });
                }
            }

            if (fileMatches.length > 0) {
                matches.push({
                    fileId: file.id,
                    fileName: file.name,
                    filePath: buildPath(file, nodesMap),
                    lines: fileMatches,
                });
            }
        }

        // Auto-expand all files with results
        const expanded: Record<string, boolean> = {};
        matches.forEach(m => { expanded[m.fileId] = true; });
        // Only set once to avoid re-render loop; users can collapse manually
        if (matches.length > 0) {
            setExpandedFiles(prev => {
                const merged = { ...prev };
                let changed = false;
                matches.forEach(m => {
                    if (!(m.fileId in merged)) {
                        merged[m.fileId] = true;
                        changed = true;
                    }
                });
                return changed ? merged : prev;
            });
        }

        return matches;
    }, [query, nodes, caseSensitive, useRegex, nodesMap]);

    const totalResults = results.reduce((sum, m) => sum + m.lines.length, 0);

    const handleReplace = useCallback((fileId: string, all: boolean) => {
        if (onReplaceInFile && query.trim()) {
            onReplaceInFile(fileId, query, replaceText, all);
        }
    }, [onReplaceInFile, query, replaceText]);

    return (
        <div className="flex flex-col h-full w-full text-[13px]">
            {/* Header */}
            <div className="px-4 py-3 font-semibold text-[11px] uppercase tracking-widest text-[var(--ide-text-faint)] border-b border-[var(--ide-border-subtle)] flex items-center justify-between">
                <span>Tìm kiếm</span>
                <button
                    onClick={() => setShowReplace(v => !v)}
                    className={`p-1 rounded transition-colors ${showReplace ? "text-[var(--ide-accent)] bg-[var(--ide-accent-subtle)]" : "text-[var(--ide-text-faint)] hover:text-[var(--ide-text)]"}`}
                    title="Tìm & Thay thế"
                >
                    <Replace className="w-3.5 h-3.5" />
                </button>
            </div>
            
            {/* Search Input */}
            <div className="px-3 py-3 space-y-2.5">
                <div className="relative flex items-center gap-1">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ide-text-faint)]" />
                        <input
                            type="text"
                            placeholder="Tìm trong tất cả file..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full bg-[var(--ide-bg)] border border-[var(--ide-border)] rounded-md pl-8 pr-3 py-2 text-[var(--ide-text)] text-[12.5px] focus:outline-none focus:border-[var(--ide-accent)] focus:ring-1 focus:ring-[var(--ide-accent-glow)] placeholder-[var(--ide-text-faint)] transition-all caret-[var(--ide-accent)]"
                        />
                    </div>
                    {/* Options */}
                    <button
                        onClick={() => setCaseSensitive(v => !v)}
                        className={`p-1.5 rounded-md transition-all ${caseSensitive ? "text-[var(--ide-accent)] bg-[var(--ide-accent-subtle)] border border-[var(--ide-accent-glow)]" : "text-[var(--ide-text-faint)] hover:bg-[var(--ide-bg-hover)] border border-transparent"}`}
                        title="Phân biệt hoa thường (Aa)"
                    >
                        <CaseSensitive className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => setUseRegex(v => !v)}
                        className={`p-1.5 rounded-md transition-all ${useRegex ? "text-[var(--ide-accent)] bg-[var(--ide-accent-subtle)] border border-[var(--ide-accent-glow)]" : "text-[var(--ide-text-faint)] hover:bg-[var(--ide-bg-hover)] border border-transparent"}`}
                        title="Biểu thức chính quy (.*)"
                    >
                        <Regex className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Replace Input */}
                {showReplace && (
                    <div className="relative flex items-center gap-1">
                        <div className="relative flex-1">
                            <Replace className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ide-text-faint)]" />
                            <input
                                type="text"
                                placeholder="Thay thế bằng..."
                                value={replaceText}
                                onChange={(e) => setReplaceText(e.target.value)}
                                className="w-full bg-[var(--ide-bg)] border border-[var(--ide-border)] rounded-md pl-8 pr-3 py-2 text-[var(--ide-text)] text-[12.5px] focus:outline-none focus:border-[var(--ide-accent)] focus:ring-1 focus:ring-[var(--ide-accent-glow)] placeholder-[var(--ide-text-faint)] transition-all caret-[var(--ide-accent)]"
                            />
                        </div>
                        <button
                            onClick={() => results.forEach(m => handleReplace(m.fileId, true))}
                            className="p-1.5 rounded-md text-[var(--ide-text-faint)] hover:bg-[var(--ide-bg-hover)] hover:text-[var(--ide-text)] border border-transparent transition-all"
                            title="Thay thế tất cả"
                        >
                            <ReplaceAll className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}

                {/* Results Summary */}
                {query.trim() && (
                    <p className="text-[10px] text-[var(--ide-text-faint)] px-1 flex items-center gap-1.5">
                        <span className="font-mono px-1.5 py-0.5 rounded bg-[var(--ide-accent-subtle)] text-[var(--ide-accent)] font-semibold">
                            {totalResults}
                        </span>
                        kết quả trong {results.length} tệp
                    </p>
                )}
            </div>

            {/* Results Tree */}
            <div className="flex-1 overflow-y-auto px-1 scrollbar-thin">
                {query.trim() && results.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-[var(--ide-text-faint)]">
                        <SearchIcon className="w-8 h-8 opacity-20 mb-2" />
                        <p className="text-sm">Không tìm thấy kết quả</p>
                        <p className="text-xs opacity-50 mt-1">Thử tìm với từ khóa khác</p>
                    </div>
                )}

                {results.map(match => (
                    <div key={match.fileId} className="flex flex-col mb-0.5">
                        <div 
                            className="flex items-center gap-2 px-2 py-1.5 text-[var(--ide-text)] hover:bg-[var(--ide-bg-hover)] cursor-pointer select-none rounded-md transition-colors"
                            onClick={() => toggleFile(match.fileId)}
                        >
                            {expandedFiles[match.fileId] ? (
                                <ChevronDown className="w-3.5 h-3.5 text-[var(--ide-text-faint)] shrink-0" />
                            ) : (
                                <ChevronRight className="w-3.5 h-3.5 text-[var(--ide-text-faint)] shrink-0" />
                            )}
                            <FileText className="w-3.5 h-3.5 text-[var(--ide-text-muted)] shrink-0" />
                            <div className="flex-1 min-w-0">
                                <span className="font-medium text-[12px] truncate block">{match.fileName}</span>
                                {match.filePath !== match.fileName && (
                                    <span className="text-[10px] text-[var(--ide-text-faint)] truncate block">{match.filePath}</span>
                                )}
                            </div>
                            <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-[var(--ide-accent-subtle)] text-[var(--ide-accent)] shrink-0">
                                {match.lines.length}
                            </span>
                        </div>

                        {expandedFiles[match.fileId] && (
                            <div className="flex flex-col gap-0.5">
                                {match.lines.map((lineMatch, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-start gap-2 pl-9 pr-2 py-1.5 text-[var(--ide-text-muted)] hover:bg-[var(--ide-bg-hover)] hover:text-[var(--ide-text)] cursor-pointer select-none rounded-md transition-colors group"
                                        onClick={() => onResultClick(match.fileId, lineMatch.line, lineMatch.col)}
                                    >
                                        <span className="text-[10px] text-[var(--ide-text-faint)] shrink-0 w-5 text-right font-mono tabular-nums mt-0.5">
                                            {lineMatch.line}
                                        </span>
                                        <HighlightedText
                                            text={lineMatch.text}
                                            query={query}
                                            caseSensitive={caseSensitive}
                                            useRegex={useRegex}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

/** Renders text with search matches highlighted in accent color */
function HighlightedText({
    text,
    query,
    caseSensitive,
    useRegex,
}: {
    text: string;
    query: string;
    caseSensitive: boolean;
    useRegex: boolean;
}) {
    const parts = useMemo(() => {
        if (!query.trim()) return [{ text, highlight: false }];

        try {
            const flags = caseSensitive ? "g" : "gi";
            const escapedQuery = useRegex ? query : query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const re = new RegExp(`(${escapedQuery})`, flags);
            const segments = text.split(re);

            return segments.map((seg, i) => ({
                text: seg,
                highlight: i % 2 === 1,
            }));
        } catch {
            return [{ text, highlight: false }];
        }
    }, [text, query, caseSensitive, useRegex]);

    return (
        <span className="truncate font-mono text-[11.5px] leading-relaxed">
            {parts.map((part, i) =>
                part.highlight ? (
                    <mark
                        key={i}
                        className="bg-[var(--ide-accent)]/25 text-[var(--ide-accent)] rounded-sm px-0.5 font-bold"
                    >
                        {part.text}
                    </mark>
                ) : (
                    <span key={i}>{part.text}</span>
                ),
            )}
        </span>
    );
}
