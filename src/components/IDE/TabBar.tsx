"use client";

import { X } from "lucide-react";
import type { LanguageType } from "./useIDEState";

interface TabBarProps {
    activeTab: LanguageType;
    onTabChange: (tab: LanguageType) => void;
}

const TABS: { id: LanguageType; label: string; icon: string; color: string }[] =
    [
        { id: "html", label: "index.html", icon: "H", color: "#e44d26" },
        { id: "css", label: "style.css", icon: "C", color: "#3b82f6" },
        { id: "javascript", label: "app.js", icon: "JS", color: "#eab308" },
        { id: "cpp", label: "main.cpp", icon: "C+", color: "#06b6d4" },
    ];

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
    return (
        <div className="ide-tabbar">
            {TABS.map((tab) => {
                const isActive = activeTab === tab.id;

                return (
                    <div
                        key={tab.id}
                        className={`ide-tab ${isActive ? "active" : ""}`}
                        onClick={() => onTabChange(tab.id)}
                    >
                        <span
                            className="text-[10px] font-bold font-mono w-5 h-5 flex items-center justify-center rounded"
                            style={{
                                color: isActive ? tab.color : "var(--ide-text-faint)",
                                background: isActive ? `${tab.color}15` : "transparent",
                            }}
                        >
                            {tab.icon}
                        </span>
                        <span className="text-[12.5px]">{tab.label}</span>
                        <div
                            className="tab-close"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <X className="w-3 h-3" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
