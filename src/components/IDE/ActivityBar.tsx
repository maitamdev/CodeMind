"use client";

import { Files, Search, Bot, Settings } from "lucide-react";
import type { ActivityView } from "./useIDEState";
import { useToast } from "@/contexts/ToastContext";

interface ActivityBarProps {
    activeView: ActivityView;
    onToggleView: (view: ActivityView) => void;
    agentOpen: boolean;
    hideAIAgent?: boolean;
}

export default function ActivityBar({
    activeView,
    onToggleView,
    agentOpen,
    hideAIAgent,
}: ActivityBarProps) {
    const { info } = useToast();

    const allItems: { id: ActivityView; icon: typeof Files; label: string }[] =
        [
            { id: "explorer", icon: Files, label: "Explorer" },
            { id: "search", icon: Search, label: "Tìm kiếm" },
            { id: "ai", icon: Bot, label: "AI Agent" },
        ];

    const items = hideAIAgent
        ? allItems.filter((i) => i.id !== "ai")
        : allItems;

    return (
        <div className="ide-activitybar">
            <div className="flex flex-col items-center gap-0.5 flex-1 pt-1">
                {items.map((item) => {
                    const isActive = item.id === "ai" ? agentOpen : activeView === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onToggleView(item.id)}
                            className={isActive ? "active" : ""}
                            title={item.label}
                        >
                            <item.icon className="w-[18px] h-[18px]" />
                            {item.id === "ai" && (
                                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.6)]" />
                            )}
                        </button>
                    );
                })}
            </div>
            <div className="pb-2">
                <button
                    onClick={() => info("Cài đặt IDE đang được phát triển.", 3000)}
                    className="w-[48px] h-[48px] flex items-center justify-center text-[var(--ide-text-faint)] hover:text-[var(--ide-text-muted)] transition-colors rounded-md"
                    title="Cài đặt"
                >
                    <Settings className="w-[18px] h-[18px]" />
                </button>
            </div>
        </div>
    );
}
