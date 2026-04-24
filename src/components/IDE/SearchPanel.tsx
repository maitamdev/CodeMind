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

    return (
        <div className="flex flex-col h-full w-full text-[13px]">
            <div className="px-4 py-2 font-semibold text-[11px] uppercase tracking-wider text-[var(--ide-text-muted)]">
                Search
            </div>
            
            <div className="px-4 pb-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-[var(--ide-bg)] border border-[var(--ide-border)] rounded px-2.5 py-1.5 text-[var(--ide-text)] text-[13px] focus:outline-none focus:border-[var(--ide-accent)] placeholder-[var(--ide-text-muted)]"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {query.trim() && results.length === 0 && (
                    <div className="px-4 text-[var(--ide-text-muted)] text-center mt-4">
                        No results found.
                    </div>
                )}

                {results.map(match => (
                    <div key={match.fileId} className="flex flex-col mb-1">
                        <div 
                            className="flex items-center gap-1.5 px-2 py-1 text-[var(--ide-text)] hover:bg-[var(--ide-bg-hover)] cursor-pointer select-none"
                            onClick={() => toggleFile(match.fileId)}
                        >
                            {expandedFiles[match.fileId] ? (
                                <ChevronDown className="w-3.5 h-3.5 text-[var(--ide-text-muted)]" />
                            ) : (
                                <ChevronRight className="w-3.5 h-3.5 text-[var(--ide-text-muted)]" />
                            )}
                            <FileText className="w-3.5 h-3.5 text-[var(--ide-text-muted)]" />
                            <span className="font-medium text-[12px]">{match.label}</span>
                            <span className="ml-auto text-[10px] bg-[var(--ide-bg-active)] px-1.5 rounded-full text-[var(--ide-text-muted)]">
                                {match.lines.length}
                            </span>
                        </div>

                        {expandedFiles[match.fileId] && (
                            <div className="flex flex-col">
                                {match.lines.map((lineMatch, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-start gap-2 pl-8 pr-2 py-1 text-[var(--ide-text-muted)] hover:bg-[var(--ide-bg-hover)] hover:text-[var(--ide-text)] cursor-pointer select-none"
                                        onClick={() => onResultClick(match.fileId, lineMatch.line, lineMatch.col)}
                                    >
                                        <span className="text-[10px] opacity-50 shrink-0 w-6 text-right">
                                            {lineMatch.line}
                                        </span>
                                        <span className="truncate font-mono text-[12px]">
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
