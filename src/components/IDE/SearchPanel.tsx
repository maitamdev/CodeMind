"use client";

import { useState, useMemo } from "react";
import { Search as SearchIcon, FileText, ChevronRight, ChevronDown } from "lucide-react";
import type { LanguageType, CodeState } from "./useIDEState";

interface SearchPanelProps {
    code: CodeState;
    onResultClick: (tab: LanguageType, line: number, column: number) => void;
}

const FILES: { id: LanguageType; label: string }[] = [
    { id: "html", label: "index.html" },
    { id: "css", label: "style.css" },
    { id: "javascript", label: "app.js" },
    { id: "cpp", label: "main.cpp" },
];

export default function SearchPanel({ code, onResultClick }: SearchPanelProps) {
    const [query, setQuery] = useState("");
    const [expandedFiles, setExpandedFiles] = useState<Record<string, boolean>>({
        html: true,
        css: true,
        javascript: true,
        cpp: true,
    });

    const toggleFile = (id: string) => {
        setExpandedFiles(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const results = useMemo(() => {
        if (!query.trim()) return [];
        
        const lowerQuery = query.toLowerCase();
        const matches: { 
            fileId: LanguageType; 
            label: string; 
            lines: { line: number; text: string; col: number }[] 
        }[] = [];

        FILES.forEach(file => {
            const fileCode = code[file.id];
            if (!fileCode) return;

            const lines = fileCode.split('\n');
            const fileMatches: { line: number; text: string; col: number }[] = [];

            lines.forEach((text, i) => {
                const col = text.toLowerCase().indexOf(lowerQuery);
                if (col !== -1) {
                    fileMatches.push({ line: i + 1, text: text.trim(), col: col + 1 });
                }
            });

            if (fileMatches.length > 0) {
                matches.push({ fileId: file.id, label: file.label, lines: fileMatches });
            }
        });

        return matches;
    }, [query, code]);

    const totalResults = results.reduce((sum, m) => sum + m.lines.length, 0);

    return (
        <div className="flex flex-col h-full w-full text-[13px]">
            {/* Header */}
            <div className="px-4 py-3 font-semibold text-[11px] uppercase tracking-widest text-[var(--ide-text-faint)] border-b border-[var(--ide-border-subtle)]">
                Tìm kiếm
            </div>
            
            {/* Search Input */}
            <div className="px-3 py-3">
                <div className="relative">
                    <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ide-text-faint)]" />
                    <input
                        type="text"
                        placeholder="Tìm trong dự án..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-[var(--ide-bg)] border border-[var(--ide-border)] rounded-md pl-8 pr-3 py-2 text-[var(--ide-text)] text-[12.5px] focus:outline-none focus:border-[var(--ide-accent)] focus:ring-1 focus:ring-[var(--ide-accent-glow)] placeholder-[var(--ide-text-faint)] transition-all caret-[var(--ide-accent)]"
                    />
                </div>
                {query.trim() && (
                    <p className="text-[10px] text-[var(--ide-text-faint)] mt-2 px-1">
                        {totalResults} kết quả trong {results.length} tệp
                    </p>
                )}
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto px-1">
                {query.trim() && results.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-[var(--ide-text-faint)]">
                        <SearchIcon className="w-8 h-8 opacity-20 mb-2" />
                        <p className="text-sm">Không tìm thấy kết quả</p>
                    </div>
                )}

                {results.map(match => (
                    <div key={match.fileId} className="flex flex-col mb-1">
                        <div 
                            className="flex items-center gap-2 px-2 py-1.5 text-[var(--ide-text)] hover:bg-[var(--ide-bg-hover)] cursor-pointer select-none rounded-md transition-colors"
                            onClick={() => toggleFile(match.fileId)}
                        >
                            {expandedFiles[match.fileId] ? (
                                <ChevronDown className="w-3.5 h-3.5 text-[var(--ide-text-faint)]" />
                            ) : (
                                <ChevronRight className="w-3.5 h-3.5 text-[var(--ide-text-faint)]" />
                            )}
                            <FileText className="w-3.5 h-3.5 text-[var(--ide-text-muted)]" />
                            <span className="font-medium text-[12px]">{match.label}</span>
                            <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-[var(--ide-accent-subtle)] text-[var(--ide-accent)]">
                                {match.lines.length}
                            </span>
                        </div>

                        {expandedFiles[match.fileId] && (
                            <div className="flex flex-col gap-0.5">
                                {match.lines.map((lineMatch, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-start gap-2 pl-9 pr-2 py-1.5 text-[var(--ide-text-muted)] hover:bg-[var(--ide-bg-hover)] hover:text-[var(--ide-text)] cursor-pointer select-none rounded-md transition-colors"
                                        onClick={() => onResultClick(match.fileId, lineMatch.line, lineMatch.col)}
                                    >
                                        <span className="text-[10px] text-[var(--ide-text-faint)] shrink-0 w-5 text-right font-mono tabular-nums mt-0.5">
                                            {lineMatch.line}
                                        </span>
                                        <span className="truncate font-mono text-[11.5px] leading-relaxed">
                                            {lineMatch.text}
                                        </span>
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
