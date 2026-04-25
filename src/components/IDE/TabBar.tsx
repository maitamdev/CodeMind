"use client";

import { X } from "lucide-react";
import type { LanguageType } from "./useIDEState";

interface TabBarProps {
    activeTab: LanguageType;
    onTabChange: (tab: LanguageType) => void;
}

const TABS: { id: LanguageType; label: string; icon: string; color: string }[] =
    [
        { id: "html", label: "index.html", icon: "</>", color: "#ef4444" },
        { id: "css", label: "style.css", icon: "{ }", color: "#3b82f6" },
        { id: "javascript", label: "app.js", icon: "JS", color: "#eab308" },
        { id: "cpp", label: "C++", icon: "C+", color: "#06b6d4" },
    ];

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
    return (
        <div className="ide-tabbar scrollbar-none">
            {TABS.map((tab) => {
                const isActive = activeTab === tab.id;

                return (
                    <div
                        key={tab.id}
                        className={`ide-tab ${isActive ? "active" : ""}`}
                        onClick={() => onTabChange(tab.id)}
                    >
                        <span
                            className="text-[10px] font-mono font-bold opacity-60"
                            style={{ color: isActive ? tab.color : "inherit" }}
                        >
                            {tab.icon}
                        </span>
                        <span className={`tracking-tight ${isActive ? "font-semibold" : "opacity-70"}`}>
                            {tab.label}
                        </span>
                        {isActive && (
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--ide-accent)] ml-1" />
                        )}
                        <div
                            className="tab-close ml-2"
                            onClick={(e) => {
                                e.stopPropagation();
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
